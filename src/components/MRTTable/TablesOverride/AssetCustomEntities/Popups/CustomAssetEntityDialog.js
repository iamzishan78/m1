import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import CloseIcon from '@material-ui/icons/Close';
import { Grid, Dialog, IconButton, Button, TextField, MenuItem, Chip } from '@material-ui/core';
import Loader from 'components/Loaders';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { tableGlobalController } from 'hookstate/tableController';
import { UPSERT_CUSTOM_ASSET_INFO } from 'graphQL/useMutationUpsertCustomAssetInfo';
import { GET_ALL_MODELS } from 'graphQL/useQueryModels';
import DynamicForm from '../Forms/DynamicForm';
import { entityCreationOptions } from 'components/MRTTable/utils/data';

const useStyles = makeStyles(theme => ({
	header: {
		display: 'flex',
		justifyContent: 'space-between',
		padding: '15px 30px',
	},

	dialogActions: {
		display: 'flex',
		justifyContent: 'flex-end',
		'& svg': {
			fill: '#d9d9d9',
			'&:hover': {
				fill: '#b5b2b2',
			},
		},
	},

	btnColor: {
		color: 'white',
		backgroundColor: '#4576CF',
	},

	assetsContainer: {
		marginTop: '20px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
	},

	tableWrapper: {
		maxHeight: '500px', // Set the maximum height
		overflowY: 'auto', // Enable vertical scrolling
		width: '80%',
	},

	assetTable: {
		width: '100%',
		borderCollapse: 'collapse',
		'& th, & td': {
			border: '1px solid #ddd',
			padding: '8px',
		},
		'& th': {
			backgroundColor: '#f2f2f2',
			position: 'sticky',
			top: '0', // Stick to the top of the container
		},
	},

	columnContainer: {
		width: '100%',
		marginLeft: '80px',
	},

	entityRow: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
		width: '100%',
	},

	actionButton: {
		marginLeft: theme.spacing(1),
	},
}));

function CustomAssetEntityDialog() {
	const classes = useStyles();
	const [modelsOptions, setModelsOptions] = useState([]);
	const defaultFields = [
		{ _id: '', mappingKey: '', keyType: '', label: '', isSummaryField: false, isControlColumn: false },
	];
	const { control, handleSubmit, watch, reset, setValue } = useForm({
		defaultValues: {
			table_name: '',
			fields: defaultFields,
			creation_place: '',
      associatedModels: [],
		},
	});

	const fields = useWatch({ control, name: 'fields' });
	const tableName = watch('table_name', ''); // Watch the "table_name" field

	const { stateValues } = tableGlobalController.useState(['AssetCustomEntityDialog', 'selectedAsset']);
	const { type, isOpen } = stateValues.AssetCustomEntityDialog || {};
	const { selectedAsset } = stateValues || {};

	const isCreateMode = type === 'addCustomAsset';

	const [getAllModels, { data: allModels }] = useLazyQuery(GET_ALL_MODELS, {
		fetchPolicy: 'no-cache',
		onCompleted: () => {
			const models = allModels?.getAllModels?.models || [];
			setModelsOptions(models);
		},
	});

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
		if (isOpen) {
			getAllModels();
		}
	}, [isOpen]);

	useEffect(() => {
		reset({
			table_name: selectedAsset?.tableName || '',
			fields: selectedAsset?.modelKeys || defaultFields,
			creation_place: selectedAsset?.creationPlace || '',
			associatedModels: selectedAsset?.associatedModels || [],
		});
	}, [selectedAsset, reset]);

	const handleClose = async () => {
		tableGlobalController.updateState({
			AssetCustomEntityDialog: {},
		});
	};

	const onSubmit = data => {
		const toastType = isCreateMode ? 'create' : 'update';
		Loader.createToast(toastType, `${toastType} Entity in Progress`);
		handleClose();

		storeCustomAsset({
			variables: {
				tableName: data.table_name,
				modelKeys: data.fields,
				creationPlace: data.creation_place,
        associatedModels: data.associatedModels,
			},
		}).then(res => {
			if (res?.data?.upsertCustomAssetInfo) {
				const { success, message } = res.data.upsertCustomAssetInfo;
				if (success) {
					Loader.successToast(toastType, message);
				} else Loader.errorToast(toastType, message);
			} else Loader.errorToast(toastType, `Failed to ${toastType} entity`);
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
											name="table_name"
											render={props => (
												<TextField
													size="small"
													type="text"
													variant="outlined"
													value={props.value}
													inputRef={props.ref}
													onWheel={e => e.target.blur()}
													onChange={e => {
														props.onChange(e.target.value);
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
											name={`creation_place`}
											render={props => (
												<TextField
													select
													size="small"
													type="text"
													variant="outlined"
													value={props.value}
													inputRef={props.ref}
													onWheel={e => e.target.blur()}
													onChange={e => {
														props.onChange(e.target.value);
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
									<Grid item xs={6}>
										<Controller
											control={control}
											name={`associatedModels`}
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
														props.onChange(e.target.value);
													}}
													label="Associations"
													placeholder="Associations"
													fullWidth
													defaultValue=""
													SelectProps={{
														multiple: true,
														renderValue: selected => (
															<div style={{ display: 'flex', flexWrap: 'wrap' }}>
																{selected.map(value => (
																	<Chip key={value} label={value} style={{ margin: 2 }} />
																))}
															</div>
														),
													}}
													disabled={!isCreateMode}
												>
													{modelsOptions?.map(option => (
														<MenuItem key={option.value} value={option.value}>
															{option.label}
														</MenuItem>
													))}
												</TextField>
											)}
										/>
									</Grid>
								</Grid>
								<Grid item>
									<h3>Add Model Keys for this Entity in this table </h3>
								</Grid>
								<DynamicForm control={control} setValue={setValue} isCreateMode={isCreateMode} />
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
										className={hasAtLeastOneKey && tableName ? classes.btnColor : ''}
										style={{ margin: '25px 25px 25px 5px' }}
										variant="outlined"
										disabled={hasAtLeastOneKey && tableName ? false : true}
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
