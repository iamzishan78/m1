import React from 'react';
import { useDispatch } from 'react-redux';

import { Button, Grid, makeStyles } from '@material-ui/core';

import { TextField } from '@mui/material';

import { useLazyQuery, useMutation } from '@apollo/client';

import { ADD_EXTERNAL_TOOL } from 'graphQL/useMutationAddExternalTool';
import { SYNC_DIALPAD } from 'graphQL/useMutationSyncDialpad';
import { EXTERNAL_TOOL_EXISTS } from 'graphQL/useQueryExternalToolExists';

import { adminOperationsController } from 'hookstate/adminOperationsController';

import { showErrorMessage, showSuccessMessage } from 'actions';

const useStyles = makeStyles(() => ({
	root: {
		marginTop: '65px',
	},
	formSection: {
		padding: '20px',
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
}));

const formFields = [
	{
		name: 'dialpad',
		label: 'Dialpad Api Key',
		buttonLabel: 'Sync Contacts',
	},
];

const ExternalTools = () => {
	const classes = useStyles();
	const dispatch = useDispatch();

	const [addExternalTool] = useMutation(ADD_EXTERNAL_TOOL);
	const [syncDialpad] = useMutation(SYNC_DIALPAD);
	const [externalToolExists] = useLazyQuery(EXTERNAL_TOOL_EXISTS);

	const {
		adminOperationsState: { apiKeys },
	} = adminOperationsController.useState(['apiKeys'], 'adminOperationsState');

	const handleSave = async (value, fieldName) => {
		if (!value) {
			return;
		}

		addExternalTool({ variables: { toolName: fieldName, apikey: value } }).then(({ data }) => {
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
		console.log('toolName', toolName);
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
				}
			});
		}
	};

	return (
		<div className={classes.root}>
			<div className={classes.formSection}>
				{formFields.map(field => (
					<Grid key={field.name} container spacing={2}>
						<>
							<Grid item xs={9}>
								<TextField
									className={classes.inputField}
									variant="outlined"
									label={field.label}
									value={apiKeys[field.name]}
									onChange={e => {
										adminOperationsController.updateState({ apiKeys: { ...apiKeys, [field.name]: e.target.value } });
									}}
									type={'text'}
									placeholder="************"
								/>
							</Grid>
							<Grid item xs={3} className={classes.buttonBar}>
								<Button variant="contained" onClick={() => handleSave(apiKeys[field.name], field.name)} color="primary">
									Save
								</Button>
								<Button variant="contained" onClick={() => handleSync(field.name)} color="primary">
									{field.buttonLabel}
								</Button>
							</Grid>
						</>
					</Grid>
				))}
			</div>
		</div>
	);
};

export default ExternalTools;
