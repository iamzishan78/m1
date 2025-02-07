import React, { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { Grid, Dialog, IconButton, Button, TextField, MenuItem, Chip } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { useLazyQuery, useMutation } from '@apollo/client';

import Loader from 'components/Loaders';

import { UPSERT_ASSOCIATED_MODELS } from 'graphQL/useMutationUpsertCustomAssetInfo';
import { GET_ALL_MODELS } from 'graphQL/useQueryModels';

import { tableGlobalController } from 'hookstate/tableController';

import { showInfoMessage } from 'actions';

import { useStyles } from './styles';
import DynamicForm from '../Forms/DynamicForm';

function AssetAssociationDialog() {
	const classes = useStyles();
	const [modelsOptions, setModelsOptions] = useState([]);
	const dispatch = useDispatch();

	const defaultFields = [
		{
			_id: '',
			mappingKey: '',
			keyType: '',
			label: '',
			isControlColumn: false,
			isGridDisplayed: true,
			isDialogDisplayed: true,
			isRequired: false,
		},
	];

	const { control, handleSubmit, watch, reset, setValue } = useForm({
		defaultValues: {
			associatedModels: '',
			fields: [],
		},
	});

	const fields = useWatch({ control, name: 'fields' });

	const { stateValues } = tableGlobalController.useState(['AssetAssociationDialog', 'selectedAsset']);

	const { type, isOpen } = stateValues.AssetAssociationDialog || {};
	const { selectedAsset } = stateValues || {};

	const isCreateMode = type === 'addAssetAssociation';

	// Check if any field has isControlColumn set to true
	const hasControlColumnSelected = fields.some(field => field.isControlColumn === true);

	const [getAllModels, { data: allModels }] = useLazyQuery(GET_ALL_MODELS, {
		fetchPolicy: 'no-cache',
		onCompleted: () => {
			const models = allModels?.getAllModels?.models || [];

			// Filter already associated models
			const currentAsssociations = selectedAsset?.associatedModels?.map(model => model.modelName);
			const options = models.filter(model => !currentAsssociations?.includes(model.modelName));

			setModelsOptions(options);
		},
	});

	const [upsertAssociatedModels, { data }] = useMutation(UPSERT_ASSOCIATED_MODELS, {
		onCompleted: () => {
			tableGlobalController.refetch();

			const updatedAsset = data?.upsertAssociatedModels?.asset || {};
			tableGlobalController.updateState({
				AssetAssociationDialog: {},
				selectedAsset: updatedAsset,
			});
		},
	});

	useEffect(() => {
		if (isOpen) {
			getAllModels();
		}
	}, [isOpen, getAllModels]);

	const handleClose = () => {
		tableGlobalController.updateState({
			AssetAssociationDialog: {},
		});
		reset({
			associatedModels: '',
			fields: defaultFields,
		});
	};

	const onSubmit = data => {
		if (!hasControlColumnSelected) {
			dispatch(showInfoMessage('Control column selection is required'));
			return;
		}

		const toastType = isCreateMode ? 'create' : 'update';
		const capitalizedToastType = toastType.charAt(0).toUpperCase() + toastType.slice(1);
		Loader.createToast(toastType, `${capitalizedToastType} Entity Association in Progress`);
		handleClose();

		const { associatedModels = [], fields } = data;
		const modelId = associatedModels._id;

		// Find if the model already exists in selectedAsset's associated models
		const existingModelIndex = selectedAsset?.associatedModels?.findIndex(model => model._id === modelId);

		let resultantModels;

		if (existingModelIndex >= 0) {
			// If the model exists, update its keys
			resultantModels = [...selectedAsset.associatedModels];
			resultantModels[existingModelIndex] = { ...associatedModels, modelKeys: fields };
		} else {
			// If the model is new, add it to the array
			resultantModels = [...selectedAsset.associatedModels, { ...associatedModels, modelKeys: fields }];
		}

		upsertAssociatedModels({
			variables: {
				name: selectedAsset.name,
				associatedModels: resultantModels, // Use the updated array
			},
		}).then(res => {
			if (res?.data?.upsertAssociatedModels) {
				const { success, message } = res.data.upsertAssociatedModels;
				if (success) {
					Loader.successToast(toastType, message);
				} else {
					Loader.errorToast(toastType, message);
				}
			} else {
				Loader.errorToast(toastType, `Failed to ${capitalizedToastType} Entity Association`);
			}
		});
	};

	const handleChipClick = model => {
		// When a chip is clicked, reset the form with the selected model's data
		tableGlobalController.updateState({
			AssetAssociationDialog: {
				type: 'editAssetAssociation',
				isOpen: true,
			},
		});
		reset({
			associatedModels: model,
			fields: model.modelKeys || defaultFields,
		});
	};

	const hasAtLeastOneKey = fields.some(field => field.mappingKey && field.keyType && field.label);

	return (
		<Dialog fullWidth maxWidth="lg" open={isOpen} onClose={handleClose}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div>
					<div className={classes.header}>
						<Grid container justify="space-between" direction="row" display="flex">
							<Grid item>
								<h3>Associate Models to {selectedAsset?.name}</h3>
							</Grid>
							<Grid item xs={6} className={classes.dialogActions}>
								<IconButton onClick={handleClose}>
									<CloseIcon />
								</IconButton>
							</Grid>
						</Grid>
					</div>

					<div>
						<div style={{ padding: '5px 35px' }}>
							{selectedAsset?.associatedModels?.length > 0 && (
								<>
									<Grid item>
										<h3>Current Associated Models</h3>
									</Grid>
									<Grid xs={6}>
										{selectedAsset.associatedModels.map(model => (
											<Chip
												key={model._id}
												label={model.modelName}
												onClick={() => handleChipClick(model)} // Handle chip click
												style={{ margin: 2, cursor: 'pointer' }}
											/>
										))}
									</Grid>
								</>
							)}

							<Grid item>
								<h3>Associate New Model</h3>
							</Grid>
							<Grid container spacing={2} alignItems="center">
								<Grid item xs={6}>
									<Controller
										control={control}
										name="associatedModels"
										render={field => (
											<TextField
												select
												size="small"
												type="text"
												variant="outlined"
												value={field.value || []}
												inputRef={field.ref}
												onWheel={e => e.target.blur()}
												onChange={e => {
													const selectedModel = e.target.value;
													field.onChange(selectedModel);
													reset({
														...watch(), // Retain other form fields
														fields: selectedModel?.modelKeys || [], // Reset based on selected model's keys
													});
												}}
												label="Associations"
												placeholder="Associations"
												fullWidth
												defaultValue=""
												SelectProps={{
													renderValue: selected => {
														// If there's no selection, show a placeholder
														if (!selected || !selected.modelName) {
															return '';
														}
														return (
															<div style={{ display: 'flex', flexWrap: 'wrap' }}>
																<Chip key={selected._id} label={selected.modelName} style={{ margin: 2 }} />
															</div>
														);
													},
												}}
											>
												{modelsOptions?.map(option => (
													<MenuItem key={option._id} value={option}>
														{option.label}
													</MenuItem>
												))}
											</TextField>
										)}
									/>
								</Grid>
							</Grid>
							{fields?.length > 1 && (
								<>
									<Grid item>
										<h3>Associated Model Keys</h3>
									</Grid>
									<DynamicForm control={control} setValue={setValue} />
								</>
							)}
						</div>

						<div
							style={{
								borderTop: '1px solid #EEF1F4',
							}}
						>
							<div style={{ float: 'right' }}>
								<Button style={{ margin: '25px 5px 25px 0px' }} variant="outlined" onClick={handleClose}>
									Cancel
								</Button>
								<Button
									type="submit"
									className={hasAtLeastOneKey ? classes.btnColor : ''}
									style={{ margin: '25px 25px 25px 5px' }}
									variant="outlined"
									disabled={hasAtLeastOneKey ? false : true}
								>
									{isCreateMode ? 'Create Association' : 'Update Association'}
								</Button>
							</div>
						</div>
					</div>
				</div>
			</form>
		</Dialog>
	);
}

export default AssetAssociationDialog;
