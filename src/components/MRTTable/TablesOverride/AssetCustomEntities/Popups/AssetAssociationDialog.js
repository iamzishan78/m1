import React, { useEffect, useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import { Grid, Dialog, IconButton, Button, TextField, MenuItem, Chip } from '@material-ui/core';
import Loader from 'components/Loaders';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { tableGlobalController } from 'hookstate/tableController';
import { UPSERT_CUSTOM_ASSET_INFO } from 'graphQL/useMutationUpsertCustomAssetInfo';
import { GET_ALL_MODELS } from 'graphQL/useQueryModels';
import DynamicForm from '../Forms/DynamicForm';
import { useStyles } from './styles';
import Chips from 'components/MRTTable/Common/TableCells/Chips';

function AssetAssociationDialog() {
	const classes = useStyles();
	const [modelsOptions, setModelsOptions] = useState([]);
	const defaultFields = [{ _id: '', mappingKey: '', keyType: '', label: '', isControlColumn: false }];

	const { control, handleSubmit, watch, reset, setValue } = useForm({
		defaultValues: {
			fields: [],
		},
	});

	const fields = useWatch({ control, name: 'fields' });

	const { stateValues } = tableGlobalController.useState(['AssetAssociationDialog', 'selectedAsset']);

	const { type, isOpen } = stateValues.AssetAssociationDialog || {};
	const { selectedAsset } = stateValues || {};

	const isCreateMode = type === 'addAssetAssociation';

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

	const [storeCustomAsset, { data }] = useMutation(UPSERT_CUSTOM_ASSET_INFO, {
		onCompleted: () => {
			tableGlobalController.refetch();

			const updatedAsset = data?.upsertCustomAssetInfo?.newModel || {};
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

	const handleClose = async () => {
		tableGlobalController.updateState({
			AssetAssociationDialog: {},
		});
		reset({
			fields: defaultFields,
		});
	};

	const onSubmit = data => {
		const toastType = isCreateMode ? 'create' : 'update';
		Loader.createToast(toastType, `${toastType} Entity Association in Progress`);
		handleClose();

		storeCustomAsset({
			variables: {
				tableName: selectedAsset.tableName,
				modelKeys: selectedAsset.modelKeys,
				creationPlace: selectedAsset.creationPlace,
				associatedModels: [...selectedAsset?.associatedModels, data.associatedModels],
			},
		}).then(res => {
			if (res?.data?.upsertCustomAssetInfo) {
				const { success, message } = res.data.upsertCustomAssetInfo;
				if (success) {
					Loader.successToast(toastType, message);
				} else Loader.errorToast(toastType, message);
			} else Loader.errorToast(toastType, `Failed to ${toastType} entity association`);
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
								<h3>Associate Models to {selectedAsset?.tableName}</h3>
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
										<Chips list={selectedAsset?.associatedModels} />
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
										render={props => (
											<TextField
												select
												size="small"
												type="text"
												variant="outlined"
												value={props.value || []}
												inputRef={props.ref}
												onWheel={e => e.target.blur()}
												onChange={e => {
													const selectedModel = e.target.value;
													props.onChange(selectedModel);
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
														if (!selected || !selected.modelName) return '';
														return (
															<div style={{ display: 'flex', flexWrap: 'wrap' }}>
																<Chip key={selected._id} label={selected.modelName} style={{ margin: 2 }} />
															</div>
														);
													},
												}}
												disabled={!isCreateMode}
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
