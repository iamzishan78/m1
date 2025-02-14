import React, { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import {
	Grid,
	Dialog,
	IconButton,
	Button,
	TextField,
	MenuItem,
	RadioGroup,
	FormControlLabel,
	Radio,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { useMutation } from '@apollo/client';

import Loader from 'components/Loaders';
import { entityCreationOptions, entityShapeOptions } from 'components/MRTTable/utils/data';

import { UPSERT_CUSTOM_ASSET_INFO } from 'graphQL/useMutationUpsertCustomAssetInfo';

import { tableGlobalController } from 'hookstate/tableController';

import { showInfoMessage } from 'actions';

import { useStyles } from './styles';
import DynamicForm from '../Forms/DynamicForm';

function CustomAssetEntityDialog() {
	const classes = useStyles();

	const dispatch = useDispatch();

	const defaultFields = [
		{
			_id: '',
			mappingKey: '',
			keyType: '',
			label: '',
			isSummaryField: false,
			isControlColumn: false,
			isGridDisplayed: true,
			isDialogDisplayed: true,
			isRequired: false,
		},
	];
	const { control, handleSubmit, watch, reset, setValue } = useForm({
		defaultValues: {
			asset_name: '',
			fields: defaultFields,
			creation_place: '',
			shape_type: 'Polygon',
		},
	});

	const fields = useWatch({ control, name: 'fields' });
	const name = watch('asset_name', ''); // Watch the "asset_name" field
	const creationPlace = watch('creation_place', ''); // Watch the "creation_place" field

	const { stateValues } = tableGlobalController.useState(['AssetCustomEntityDialog', 'selectedAsset']);
	const { type, isOpen } = stateValues.AssetCustomEntityDialog || {};
	const { selectedAsset } = stateValues || {};

	const isCreateMode = type === 'addCustomAsset';

	// Check if any field has isControlColumn set to true
	const hasControlColumnSelected = fields.some(field => field.isControlColumn === true);

	const [storeCustomAsset, { data }] = useMutation(UPSERT_CUSTOM_ASSET_INFO, {
		onCompleted: () => {
			tableGlobalController.refetch();

			const updatedAsset = data?.upsertCustomAssetInfo?.newModel || {};
			tableGlobalController.updateState({
				AssetCustomEntityDialog: {},
				selectedAsset: updatedAsset,
			});
		},
	});

	useEffect(() => {
		reset({
			asset_name: selectedAsset?.name || '',
			fields: selectedAsset?.modelKeys || defaultFields,
			creation_place: selectedAsset?.creationPlace || '',
			shape_type: selectedAsset?.shapeType || '',
		});
	}, [selectedAsset, reset]);

	const handleClose = async () => {
		tableGlobalController.updateState({
			AssetCustomEntityDialog: {},
		});
	};

	const onSubmit = data => {
		if (!hasControlColumnSelected) {
			dispatch(showInfoMessage('Control column selection is required'));
			return;
		}

		const toastType = isCreateMode ? 'create' : 'update';
		const capitalizedToastType = toastType.charAt(0).toUpperCase() + toastType.slice(1);
		Loader.createToast(toastType, `${capitalizedToastType} Entity in Progress`);
		handleClose();

		const modelKeys = data?.fields?.map(({ _id, ...rest }) => (_id ? { _id, ...rest } : rest));

		storeCustomAsset({
			variables: {
				name: data.asset_name,
				modelKeys,
				creationPlace: data.creation_place,
				shapeType: data.shape_type,
			},
		}).then(res => {
			if (res?.data?.upsertCustomAssetInfo) {
				const { success, message } = res.data.upsertCustomAssetInfo;
				if (success) {
					Loader.successToast(toastType, message);
				} else {
					Loader.errorToast(toastType, message);
				}
			} else {
				Loader.errorToast(toastType, `Failed to ${capitalizedToastType} Entity`);
			}
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
								<h3>Add New Custom Entity on Asset Management Tab</h3>
							</Grid>
							<Grid item xs={6} className={classes.dialogActions}>
								<IconButton onClick={handleClose}>
									<CloseIcon />
								</IconButton>
							</Grid>
						</Grid>
					</div>

					<div>
						<div>
							<div style={{ padding: '5px 35px' }}>
								<Grid container spacing={2} alignItems="center">
									<Grid item xs={6}>
										<Controller
											control={control}
											name="asset_name"
											render={({ field }) => (
												<TextField
													size="small"
													type="text"
													variant="outlined"
													value={field.value}
													inputRef={field.ref}
													onWheel={e => e.target.blur()}
													onChange={e => {
														field.onChange(e.target.value);
													}}
													label="Table Name"
													placeholder="Table Name"
													fullWidth
													defaultValue=""
													disabled={!isCreateMode}
												/>
											)}
										/>
									</Grid>
									<Grid item xs={6}>
										<Controller
											control={control}
											name={'creation_place'}
											render={({ field }) => (
												<TextField
													select
													size="small"
													type="text"
													variant="outlined"
													value={field.value}
													inputRef={field.ref}
													onWheel={e => e.target.blur()}
													onChange={e => {
														field.onChange(e.target.value);
													}}
													label="Creationn Place"
													placeholder="creation place"
													fullWidth
													defaultValue=""
													disabled={!isCreateMode}
												>
													{entityCreationOptions.map(option => (
														<MenuItem key={option.value} value={option.value}>
															{option.label}
														</MenuItem>
													))}
												</TextField>
											)}
										/>
									</Grid>
									{creationPlace && creationPlace === 'onMap' && (
										<Grid item xs={6}>
											<h3>Select the Shape Type</h3>
											<Controller
												control={control}
												name={'shape_type'}
												render={({ field }) => (
													<RadioGroup
														row
														value={field.value}
														onChange={e => {
															field.onChange(e.target.value);
														}}
													>
														{entityShapeOptions.map((option, index) => (
															<FormControlLabel
																disabled={!isCreateMode}
																index={index}
																value={option.value}
																control={<Radio />}
																label={option.label}
															/>
														))}
													</RadioGroup>
												)}
											/>
										</Grid>
									)}
								</Grid>
								<Grid item>
									<h3>Add Model Keys for this Entity in this table </h3>
								</Grid>
								<DynamicForm control={control} setValue={setValue} />
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
										className={hasAtLeastOneKey && name ? classes.btnColor : ''}
										style={{ margin: '25px 25px 25px 5px' }}
										variant="outlined"
										disabled={hasAtLeastOneKey && name ? false : true}
									>
										{isCreateMode ? 'Create Asset' : 'Update Asset'}
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</form>
		</Dialog>
	);
}

export default CustomAssetEntityDialog;
