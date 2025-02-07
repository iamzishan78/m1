import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Grid, makeStyles } from '@material-ui/core';

import { Autocomplete, TextField } from '@mui/material';

import { useLazyQuery, useMutation, useQuery } from '@apollo/client';

import { ADD_EXTERNAL_TOOL } from 'graphQL/useMutationAddExternalTool';
import { SYNC_DIALPAD } from 'graphQL/useMutationSyncDialpad';
import { ALL_EXTERNAL_TOOLS } from 'graphQL/useQueryAllExternalTools';
import { EXTERNAL_TOOL_EXISTS } from 'graphQL/useQueryExternalToolExists';

import { adminOperationsController } from 'hookstate/adminOperationsController';
import { jobController } from 'hookstate/jobStateController';

import { getURL } from 'utils/helper';

import { showErrorMessage, showSuccessMessage } from 'actions';
import DialpadIntegration from './DialpadIntegration';

const useStyles = makeStyles(() => ({
	root: {
		marginTop: '65px',
	},
	formSection: {
		backgroundColor: '#f5f5f5',
		borderRadius: '8px',
		marginBottom: '20px',
	},
	inputField: {
		width: '100%',
	},
	buttonBar: {
		display: 'flex',
		justifyContent: 'space-evenly',
		height: '10%',
		marginTop: '10px',
	},
	endAdorment: {
		marginRight: '-20px',
	},
	actionBar: ({ isBackground }) => ({
		padding: '10px 25px',
		display: 'flex',
		alignItems: 'center',
		backgroundColor: isBackground ? '#F2F2F2' : 'transparent',
		width: '100%',
		minHeight: '65px',

		'& .MuiSelect-select:focus, & .MuiOutlinedInput-root': {
			backgroundColor: '#ffff',
		},
		'& .MuiButtonGroup-groupedContainedSecondary:not(:last-child)': {
			borderColor: '#ffff',
		},
	}),
}));

const formFields = [
	{
		name: 'dialpad',
		value: 'dialpad',
		label: 'VOIP - Dialpad',
		buttonLabel: 'Sync Contacts',
	},
];

const Integrations = () => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const [selectedOption, setSeletedOption] = useState(formFields[0]);

	const [addExternalTool] = useMutation(ADD_EXTERNAL_TOOL);
	const [syncDialpad] = useMutation(SYNC_DIALPAD);
	const [externalToolExists] = useLazyQuery(EXTERNAL_TOOL_EXISTS);
	const { data: allTools } = useQuery(ALL_EXTERNAL_TOOLS);

	const {
		adminOperationsState: { apiKeys },
	} = adminOperationsController.useState(['apiKeys'], 'adminOperationsState');

	const handleSave = async (value, fieldName) => {
		if (!value) {
			return;
		}
		const url = getURL();

		addExternalTool({
			variables: { toolName: fieldName, apikey: value, webhookUrl: url.replace(/\/m1graph.*$/, '') },
			refetchQueries: ['allExternalTools'],
			awaitRefetchQueries: true,
		}).then(({ data }) => {
			if (!data?.addExternalTool) {
				dispatch(showErrorMessage('An error occured while saving Api Ky'));
			} else if (!data.addExternalTool?.success) {
				dispatch(showErrorMessage('Invalid Api Key'));
			} else {
				dispatch(showSuccessMessage('Api Key saved successfully'));
				if (value) {
					adminOperationsController.updateState({ apiKeys: { ...apiKeys, [fieldName]: '' } });
				}
			}
		});
	};

	const handleSync = async toolName => {
		const { data } = await externalToolExists({ variables: { toolName } });

		if (!data?.externalToolExists) {
			dispatch(showErrorMessage('An error occured while syncing'));
		} else if (!data.externalToolExists?.success) {
			dispatch(showErrorMessage('Please save a valid Api Key first'));
		}

		if (toolName === 'dialpad') {
			// Call the syncDialpad mutation here
			syncDialpad({ variables: { toolName } }).then(({ data }) => {
				if (!data?.syncDialpad?.success) {
					dispatch(showErrorMessage('An error occured while syncing'));
				} else {
					dispatch(showSuccessMessage('Contacts will be synced shortly'));
					jobController.toggleBulkUpload();
				}
			});
		}
	};

	return (
		<div className={classes.root}>
			<div className={classes.formSection}>
				<IntegrationsHeader selectedOption={selectedOption} setSeletedOption={setSeletedOption} />
			</div>
			{selectedOption?.value === 'dialpad' && (
				<DialpadIntegration
					apikey={apiKeys[selectedOption.name]}
					handleSave={() => handleSave(apiKeys[selectedOption.name], selectedOption.name)}
					apiKeyExists={allTools?.allExternalTools?.find(tool => tool.toolName === selectedOption.name)}
					onChange={e => {
						adminOperationsController.updateState({ apiKeys: { ...apiKeys, [selectedOption.name]: e.target.value } });
					}}
					handleSync={() => handleSync(selectedOption.name)}
				/>
			)}
		</div>
	);
};

const IntegrationsHeader = ({ selectedOption, setSeletedOption, fullWidth = false }) => {
	const classes = useStyles({ isBackground: true });
	return (
		<>
			<Grid container direction="row" display="flex" justify="space-between" className={classes.actionBar}>
				<Grid item xs={fullWidth ? 12 : 3} md={fullWidth ? 12 : 3}>
					<Autocomplete
						options={formFields}
						getOptionLabel={option => option.label}
						style={{ width: 300 }}
						size="small"
						defaultValue={selectedOption}
						value={selectedOption}
						onChange={(_, value) => {
							setSeletedOption(value);
						}}
						renderInput={params => <TextField {...params} variant="outlined" value={selectedOption?.label} />}
					/>
				</Grid>
			</Grid>
		</>
	);
};

export default Integrations;
