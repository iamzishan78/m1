import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { DialogTitle, DialogActions, DialogContent, Grid, makeStyles, Button, IconButton } from '@material-ui/core';

import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';

import RightDialog from 'components/ContactDetailCard/components/RightDialog';
import CommonForm from 'components/Shared/FormsFieldsData/CommonForm';
import { customAssetForm } from 'components/Shared/FormsFieldsData/RightDialogsSchema/CustomAssetGrid/custom_asset_form_schema';
import { customAssetFormValidationSchema } from 'components/Shared/FormsFieldsData/RightDialogsSchema/CustomAssetGrid/custom_asset_form_validation_schema';
import KeyboardTabBlackIcon from 'components/Shared/svgIcons/KeyboardTabBlackIcon';

import { ADD_RECORD_IN_RUN_TIME_MODEL } from 'graphQL/useMutationRunTimeModel';

import { globalStateController } from 'stateManagement/globalStateController';
import { sideDialogController } from 'stateManagement/sideDialogController';
import { tableGlobalController } from 'stateManagement/tableController';

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

export default function AddCustomAssetDialog(props) {
	const classes = useStyles();
	const {
		globalStateValues: { currentAsset },
	} = globalStateController.useState(['currentAsset'], 'globalStateValues');

	const validationSchema = useMemo(
		() => customAssetFormValidationSchema({ fields: currentAsset?.modelKeys }),
		[currentAsset?.modelKeys]
	);

	const {
		control,
		reset,
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
		onCompleted: () => {
			handleClickDialogClose();
			tableGlobalController.refetch();
		},
	});

	useEffect(() => {
		window.setStateApp(state => ({ ...state, universalCircularLoaderAct: loading }));
	}, [loading]);

	const handleClickDialogClose = () => {
		props?.onClose();
		sideDialogController('customAssetDialog').reset();
		reset();
	};

	const handleClickAdd = customAssetData => {
		if (props?.onClickAddHandler) {
			props?.onClickAddHandler({ currentAsset, customAssetData });
			handleClickDialogClose();
			return;
		}

		sideDialogController('customAssetDialog').updateState({
			...customAssetData,
		});

		addRecordInRunTimeModel({
			variables: { tableName: currentAsset?.tableName, record: customAssetData },
		});
	};

	const formSchema = useMemo(() => {
		return customAssetForm({
			fields: currentAsset?.modelKeys,
		});
	}, [currentAsset?.modelKeys]);

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
