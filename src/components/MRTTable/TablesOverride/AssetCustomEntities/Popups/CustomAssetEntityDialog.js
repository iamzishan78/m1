import React, { useState, useEffect } from 'react';
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
	FormHelperText,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { useLazyQuery, useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import _ from 'lodash';
import { z } from 'zod';

import Loader from 'components/Loaders';
import { entityCreationOptions, entityShapeOptions } from 'components/MRTTable/utils/data';

import { tableGlobalController } from 'controllers/tableController';

import { UPSERT_CUSTOM_ASSET_INFO } from 'graphQL/useMutationUpsertCustomAssetInfo';
import { IS_TABLE_NAME_VALID } from 'graphQL/useQueryAllCustomAssetInfo.js';

import { showInfoMessage } from 'actions';

import { useStyles } from './styles';
import DynamicForm from '../Forms/DynamicForm';

const zodValidationSchema = z.object({
	asset_name: z.string().nonempty('Table name is required'),
	creation_place: z.string().nonempty('Creation place is required'),
	shape_type: z.string().nonempty('Shape type is required'),
	fields: z.array(
		z.object({
			_id: z.string(),
			mappingKey: z.string().nonempty('Key is required'),
			keyType: z.string().nonempty('Key type is required'),
			label: z.string().nonempty('Label is required'),
			isSummaryField: z.boolean(),
			isControlColumn: z.boolean(),
			isGridDisplayed: z.boolean(),
			isDialogDisplayed: z.boolean(),
			isRequired: z.boolean(),
		})
	),
});

function CustomAssetEntityDialog() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const [isDisabled, setIsDisabled] = useState(false);

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
	const {
		control,
		handleSubmit,
		watch,
		reset,
		setValue,
		formState: { errors },
		clearErrors,
	} = useForm({
		resolver: zodResolver(zodValidationSchema),
		defaultValues: {
			asset_name: '',
			fields: defaultFields,
			creation_place: '',
			shape_type: 'Polygon',
		},
	});

	const fields = useWatch({ control, name: 'fields' });
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

	const [isTableNameValid] = useLazyQuery(IS_TABLE_NAME_VALID, {
		fetchPolicy: 'no-cache',
	});

	useEffect(() => {
		reset({
			asset_name: selectedAsset?.name || '',
			fields: selectedAsset?.modelKeys || defaultFields,
			creation_place: selectedAsset?.creationPlace || '',
			shape_type: selectedAsset?.shapeType || 'Polygon',
		});
	}, [selectedAsset, reset]);

	const handleClose = async () => {
		tableGlobalController.updateState({
			AssetCustomEntityDialog: {},
		});
	};

	const handleTableNameBlur = value => {
		if (!value) {return;}

		const tableName = value.replace(/\s+/g, '').toLowerCase() || '';
		isTableNameValid({
			variables: {
				tableName,
			},
		}).then(({ data }) => {
			const { success, message } = data.isTableNameValid;
			setIsDisabled(!success);
			!success && dispatch(showInfoMessage(message));
		});
	};

	const onSubmit = data => {
		const repeatedKeys = _(data.fields)
			.filter(fieldObj => fieldObj.mappingKey !== '')
			.countBy('mappingKey')
			.pickBy(count => count > 1)
			.keys()
			.value();

		if (repeatedKeys.length) {
			const repeatedKeysMessage = `Cannot create asset. The following keys are repeated: \n"${repeatedKeys.join(', ')}"`;
			dispatch(showInfoMessage(repeatedKeysMessage));
			return;
		}

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
												<>
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
														onBlur={e => handleTableNameBlur(e.target.value)}
														label="Table Name"
														placeholder="Table Name"
														fullWidth
														defaultValue=""
														error={errors['asset_name']}
														disabled={!isCreateMode}
													/>
													<FormHelperText error>{errors['asset_name']?.message || ' '}</FormHelperText>
												</>
											)}
										/>
									</Grid>
									<Grid item xs={6}>
										<Controller
											control={control}
											name={'creation_place'}
											render={({ field }) => (
												<>
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
														label="Creation Place"
														placeholder="creation place"
														fullWidth
														defaultValue=""
														error={errors['creation_place']}
														disabled={!isCreateMode}
													>
														{entityCreationOptions.map(option => (
															<MenuItem key={option.value} value={option.value}>
																{option.label}
															</MenuItem>
														))}
													</TextField>
													<FormHelperText error>{errors['creation_place']?.message || ' '}</FormHelperText>
												</>
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
													<RadioGroup row {...field}>
														{entityShapeOptions.map((option, index) => (
															<FormControlLabel
																key={option.label}
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
								<DynamicForm
									control={control}
									setValue={setValue}
									errors={errors['fields']}
									clearErrors={clearErrors}
								/>
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
										className={isDisabled && isCreateMode ? classes.btnColor_disabled : classes.btnColor_active}
										style={{ margin: '25px 25px 25px 5px' }}
										variant="outlined"
										disabled={isCreateMode ? isDisabled : false}
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
