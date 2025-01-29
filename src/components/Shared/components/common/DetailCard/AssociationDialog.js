import React, { useEffect, useState } from 'react';

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

import { useLazyQuery, useMutation } from '@apollo/client';
import { isEmpty } from 'lodash';

import RightDialog from 'components/ContactDetailCard/components/RightDialog';
import { formatDate } from 'components/Shared/functions';
import KeyboardTabBlackIcon from 'components/Shared/svgIcons/KeyboardTabBlackIcon';

import { ADD_ASSOCIATED_MODEL_DATA } from 'graphQL/useMutationAssociatedModelData';
import { GET_DB_DATA } from 'graphQL/useQueryDbQuery';

import { detailCardController } from 'hookstate/detailCardController';
import { globalStateController } from 'hookstate/globalStateController';
import { tableGlobalController } from 'hookstate/tableController';

const useStyles = makeStyles(() => ({
	maxWidth: {
		width: '100%',
	},
	gridStyle: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
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
		globalStateValues: { currentAsset },
	} = globalStateController.useState(['currentAsset'], 'globalStateValues');

	const {
		stateValues: { selectedAssoicatedModel: currentAssociatedModel, currentAssetRecord },
	} = detailCardController.useState(['selectedAssoicatedModel', 'currentAssetRecord']);

	const controlColumn = currentAssociatedModel?.modelKeys?.find(key => !!key.isControlColumn);

	const handleClickRightDialogClose = async () => {
		tableGlobalController.updateState({
			AssociateDataDialog: {},
		});
		setSelectedOption({});
	};

	const [getDbData] = useLazyQuery(GET_DB_DATA, {
		onCompleted: data => {
			const associatedModelData = data?.getDbData?.hits || [];

			setAssociatedDataOptions(associatedModelData);
		},
		fetchPolicy: 'no-cache',
	});

	const [addAossciatedData] = useMutation(ADD_ASSOCIATED_MODEL_DATA, {
		onCompleted: () => {
			handleClickRightDialogClose();
			tableGlobalController.refetch();
		},
	});

	useEffect(() => {
		if (isOpen) {
			getDbData({
				variables: {
					index: currentAssociatedModel?.tableName,
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
					isDynamicAsset: true,
				},
			});
		}
	}, [isOpen, getDbData, currentAssociatedModel]);

	const addAssociatedDataHandler = () => {
		if (selectedOption && currentAssetRecord && currentAsset) {
			const selectedId = selectedOption._id;

			addAossciatedData({
				variables: {
					assetTableName: currentAsset?.tableName,
					associatedModelName: currentAssociatedModel?.modelName,
					descriptorObject: currentAssetRecord?._id,
					descriptorType: currentAsset?.name,
					relatedObject: selectedId,
					relatedObjectType: currentAssociatedModel?.modelName,
				},
			});
		}
	};

	const getFormattedValue = (key, selectedOption) => {
		const value = key.keyType === 'user' ? selectedOption[key.mappingKey]?.['name'] : selectedOption[key.mappingKey];
		return key.keyType === 'date' ? formatDate(value) : value || 'N/A';
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
									placeholder={`Select ${currentAssociatedModel?.modelName}`}
									variant="outlined"
								/>
							)}
						/>
					</Grid>
					{!isEmpty(selectedOption) && (
						<>
							<Typography variant="h6" style={{ marginTop: '20px' }}>
								Record Details
							</Typography>

							<Grid container spacing={2}>
								{currentAssociatedModel?.modelKeys?.map(key => (
									<Grid item xs={12} key={key.mappingKey}>
										<TextField
											className={classes.maxWidth}
											margin="dense"
											label={key.label}
											value={getFormattedValue(key, selectedOption)}
											variant="outlined"
											disabled
											fullWidth
										/>
									</Grid>
								))}
							</Grid>
						</>
					)}
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
					disabled={!selectedOption}
					onClick={addAssociatedDataHandler}
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
