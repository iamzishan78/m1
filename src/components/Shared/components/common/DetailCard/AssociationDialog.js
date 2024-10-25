import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';

import {
	Button,
	TextField,
	Grid,
	DialogTitle,
	IconButton,
	DialogActions,
	DialogContent,
	FormControl,
	Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { tableGlobalController } from 'hookstate/tableController';
import { detailCardController } from 'hookstate/detailCardController';

import { GET_ES_SIMPLE_SEARCH } from 'graphQL/useQueryESSimpleSearch';

import RightDialog from 'components/ContactDetailCard/components/RightDialog';
import KeyboardTabBlackIcon from 'components/Shared/svgIcons/KeyboardTabBlackIcon';

const useStyles = makeStyles(theme => ({
	maxWidth: {
		width: '100%',
	},
	gridStyle: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		padding: '10px',
		'& .MuiAutocomplete-popper': {
			width: '560px !important',
		},
		width: '100%',
	},
	dialogContent: {
		'& header': {
			position: 'absolute',
			left: '0',
			top: '55px',
		},
	},
	primary: {
		color: 'black',
		backgroundColor: '#E0E0E0',
	},
	secondary: {
		color: 'white',
		backgroundColor: '#26ACD8',
	},
	dialogAction: {
		'& .Mui-disabled': {
			backgroundColor: 'transparent',
		},
	},
}));

function AssociationDialog() {
	const classes = useStyles();
	const [associatedDataOptions, setAssociatedDataOptions] = useState([]);
	const [selectedOption, setSelectedOption] = useState({});

	const { stateValues } = tableGlobalController.useState(['AssociateDataDialog']);
	const { isOpen } = stateValues.AssociateDataDialog || {};

	const {
		stateValues: { selectedAssoicatedModel: currentAssociatedModel },
	} = detailCardController.useState(['selectedAssoicatedModel']);

	const controlColumn = currentAssociatedModel?.modelKeys?.find(key => !!key.isControlColumn);

	const [getESSearch] = useLazyQuery(GET_ES_SIMPLE_SEARCH, {
		onCompleted: data => {
			const associatedModelData = data?.getESSimpleSearch?.hits || [];

			setAssociatedDataOptions(associatedModelData);
		},
		fetchPolicy: 'no-cache',
	});

	useEffect(() => {
		if (isOpen) {
			getESSearch({
				variables: {
					index: currentAssociatedModel?.flatModel,
					pagination: {
						first: 25,
						after: null,
					},
					sort: {
						field: 'lastUpdateAt',
						order: 'desc',
						unmapped_type: 'date',
					},
					filters: [],
				},
			});
		}
	}, [isOpen, getESSearch, currentAssociatedModel]);

	const handleClickRightDialogClose = async () => {
		tableGlobalController.updateState({
			AssociateDataDialog: {},
		});
		setSelectedOption({});
	};

	return (
		<RightDialog open={isOpen} handleClickDialogClose={handleClickRightDialogClose} width="450px">
			<Grid container display="flex" direction="row" justifyContent="space-between" alignItems="center">
				<Grid item md={10} xs={10}>
					<DialogTitle id="customized-dialog-title" style={{ fontWeight: 'bold' }}>
						{`Add Associated ${currentAssociatedModel?.modelName}`}
					</DialogTitle>
				</Grid>
				<Grid item md={1} xs={1} style={{ marginLeft: '20px' }}>
					<div style={{ float: 'right', display: 'flex', marginRight: '10px' }}>
						<IconButton
							size="small"
							component="span"
							style={{
								background: 'transparent',
								align: 'center',
								float: 'right',
							}}
							onClick={handleClickRightDialogClose}
						>
							<KeyboardTabBlackIcon />
						</IconButton>
					</div>
				</Grid>
			</Grid>
			<DialogContent className={classes.dialogContent}>
				<FormControl variant="outlined" fullWidth size="small">
					<Grid container className={classes.gridStyle}>
						<Autocomplete
							className={classes.maxWidth}
							options={associatedDataOptions}
							onChange={(e, selected) => {
								setSelectedOption(selected);
							}}
							value={selectedOption}
							getOptionSelected={(option, value) => option._id === value?._id}
							getOptionLabel={option => option[controlColumn?.mappingKey] || ''}
							renderOption={option => (
								<Grid container spacing={0}>
									<Grid container item xs={12} alignItems="center">
										<Grid item xs>
											<span style={{ fontWeight: 400 }}>{option[controlColumn?.mappingKey]}</span>
											<Typography variant="body2" color="textSecondary">
												{option.label}
											</Typography>
										</Grid>
									</Grid>
								</Grid>
							)}
							renderInput={params => (
								<TextField
									margin="dense"
									{...params}
									InputLabelProps={{ shrink: true }}
									label={`${currentAssociatedModel?.modelName}'s`}
									variant="outlined"
								/>
							)}
						/>
					</Grid>
				</FormControl>
			</DialogContent>
			<DialogActions className={classes.dialogAction}>
				<Button
					className={classes.primary}
					onClick={handleClickRightDialogClose}
					color="primary"
					style={{ marginBottom: '40px' }}
				>
					Cancel
				</Button>
				<Button
					className={classes.secondary}
					disabled={false}
					onClick={() => {}}
					color="secondary"
					style={{ marginBottom: '40px', marginRight: '20px', bottom: 0 }}
					data-testid="action-button"
				>
					{'Add'}
				</Button>
			</DialogActions>
		</RightDialog>
	);
}

export default AssociationDialog;
