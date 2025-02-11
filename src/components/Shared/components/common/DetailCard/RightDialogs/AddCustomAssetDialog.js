import React, { useEffect, useMemo } from 'react';
import { DialogTitle, DialogActions, DialogContent, Grid, makeStyles, Button, IconButton } from '@material-ui/core';
import { ADD_RECORD_IN_RUN_TIME_MODEL } from 'graphQL/useMutationRunTimeModel';
import { globalStateController } from 'hookstate/globalStateController';
import { sideDialogController } from 'hookstate/sideDialogController';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import RightDialog from 'components/ContactDetailCard/components/RightDialog';

import { useMutation } from '@apollo/client';

import CommonForm from 'components/Shared/FormsFieldsData/CommonForm';
import KeyboardTabBlackIcon from 'components/Shared/svgIcons/KeyboardTabBlackIcon';

const useStyles = makeStyles(theme => ({
	maxWidth: {
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
	move: {
		zIndex: 10000,
	},
	baseValueChanged: {
		width: '100%',
		'& .MuiInputBase-input': {
			color: 'dodgerblue',
			fontWeight: 'bold',
		},
	},
	addContactButton: {
		float: 'right',
		display: 'flex',
		alignItems: 'center',
		// marginTop: "15px",
		cursor: 'pointer',
	},
	addContactButtonSelected: {
		float: 'right',
		display: 'flex',
		alignItems: 'center',
		// marginTop: "15px",
		cursor: 'pointer',
		color: `${theme.palette.secondary.main} !important`,
	},

	personAddIcon: {
		color: `${theme.palette.secondary.main} !important`,
		fill: `${theme.palette.secondary.main} !important`,
	},
	addDataButton: {
		backgroundColor: 'white',
		color: 'black',
		textTransform: 'capitalize',
		'&:hover': {
			backgroundColor: theme.palette.common.white,
			opacity: 0.15,
		},
	},
}));

const createZodValidationSchema = (fields = []) => {
	if (!Array.isArray(fields) || fields.length === 0) return z.object({});

	const schema = fields.reduce((acc, field) => {
		let validator;
		const { keyType, label, isRequired, mappingKey } = field;

		switch (keyType) {
			case 'string':
				validator = z
					.string({
						required_error: `${label} is required`,
					})
					.trim();

				if (isRequired) {
					validator = validator.min(1, `${label} is required`);
				} else {
					validator = validator.optional();
				}
				break;

			case 'number':
				validator = z.coerce
					.number({
						required_error: `${label} is required`,
						invalid_type_error: `${label} must be a valid number`,
					})
					.refine(val => (isRequired ? val !== 0 && val !== '' : true), {
						message: `${label} is required`,
					});

				if (!isRequired) validator = validator.optional();
				break;

			case 'date':
				validator = z.preprocess(
					val => (val === '' || val === null || val === undefined ? undefined : new Date(val)),
					z.date({
						required_error: `${label} is required`,
						invalid_type_error: `${label} must be a valid date`,
					})
				);

				if (isRequired) {
					validator = validator.refine(value => value instanceof Date && !isNaN(value), {
						message: `${label} is required`,
					});
				} else {
					validator = validator.optional();
				}
				break;

			case 'boolean':
				validator = z.coerce.boolean();
				if (!isRequired) validator = validator.optional();
				break;

			default:
				validator = z.any();
				if (!isRequired) {
					validator = validator.optional();
				} else {
					validator = validator.refine(value => value !== undefined && value !== null && value !== '' && value !== 0, {
						message: `${label} is required`,
					});
				}
		}

		acc[mappingKey] = validator;
		return acc;
	}, {});

	return z.object(schema);
};

export default function AddCustomAssetDialog({ ...props }) {
	const classes = useStyles();
	const {
		globalStateValues: { currentAsset },
	} = globalStateController.useState(['currentAsset'], 'globalStateValues');

	const validationSchema = useMemo(() => createZodValidationSchema(currentAsset?.modelKeys), [currentAsset?.modelKeys]);

	const {
		control,
		reset,
		setValue,
		watch,
		formState: { errors },
		handleSubmit,
	} = useForm({
		resolver: zodResolver(validationSchema),
	});

	const [addRecordInRunTimeModel, { loading }] = useMutation(ADD_RECORD_IN_RUN_TIME_MODEL, {
		fetchPolicy: 'no-cache',
		awaitRefetchQueries: true,
		refetchQueries: ['getDbData', 'getDbDataTotal'],
	});

	useEffect(() => {
		window.setStateApp(state => ({ ...state, universalCircularLoaderAct: loading }));
	}, [loading]);

	const handleClickDialogClose = () => {
		props.onClose();
		sideDialogController('customAssetDialog').reset();
		reset();
	};

	const handleClickAdd = customAssetData => {
		sideDialogController('customAssetDialog').updateState({
			...customAssetData,
		});

		addRecordInRunTimeModel({
			variables: { tableName: currentAsset?.tableName, record: customAssetData },
		});
	};

	const formSchema = currentAsset?.modelKeys?.map(field => {
		const booleanOptions = [
			{ value: true, label: 'Yes' },
			{ value: false, label: 'No' },
		];

		return {
			label: field.label,
			name: field.mappingKey,
			type: field.keyType,
			renderField: field.keyType,
			options: field.keyType === 'boolean' ? booleanOptions : [],
			required: field.isRequired,
			onChange: value => {
				console.log(field.mappingKey, value);
				setValue(field.mappingKey, value);
			},
		};
	});

	return (
		<div className={classes.move}>
			<React.Fragment>
				<RightDialog open={true} handleClickDialogClose={handleClickDialogClose} width={'450px'}>
					<form onSubmit={handleSubmit(handleClickAdd)}>
						<Grid container display="flex" direction="row" justifyContent="space-between" alignItems="center">
							<Grid item md={10} xs={10}>
								<DialogTitle id="customized-dialog-title" style={{ fontWeight: 'bold' }}>
									Add {currentAsset?.name}
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
										onClick={handleClickDialogClose}
									>
										<KeyboardTabBlackIcon />
									</IconButton>
								</div>
							</Grid>
						</Grid>
						<DialogContent className={classes.dialogContent}>
							<Grid container spacing={2}>
								<CommonForm
									formSchema={formSchema}
									control={control}
									reset={reset}
									watch={watch}
									dialogKey={'customAssetDialog'}
									errors={errors}
								/>
							</Grid>
						</DialogContent>
						<DialogActions className={classes.dialogAction}>
							<Button
								className={classes.primary}
								onClick={handleClickDialogClose}
								color="primary"
								style={{ marginBottom: '40px' }}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								className={classes.secondary}
								disabled={errors?.length > 0}
								// onClick={handleClickAdd}
								color="secondary"
								style={{ marginBottom: '40px', marginRight: '20px' }}
								data-testid="action-button"
							>
								Add
							</Button>
						</DialogActions>
					</form>
				</RightDialog>
			</React.Fragment>
		</div>
	);
}
