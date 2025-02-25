import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button, CircularProgress, Grid, makeStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import { useMutation } from '@apollo/client';

import RightDialog from 'components/ContactDetailCard/components/RightDialog';
import Loaders from 'components/Loaders';
import AutoCompleteShapeLayer from 'components/Shared/Forms/Fields/AutoCompleteShapeLayer';
import CloseIcon2 from 'components/Shared/svgIcons/KeyboardTabBlackIcon';

import { ADD_RELATED_SHAPE } from 'graphQL/useMutationAddUnitToAgreement';

import { tableGlobalController } from 'stateManagement/tableController';

// Styles
const useStyles = makeStyles(theme => ({
	dialogFooter: {
		display: 'flex',
		justifyContent: 'flex-end',
		paddingTop: '10px',
		paddingBottom: '15px',
	},
	footerButton: {
		letterSpacing: '1px',
		textTransform: 'capitalize',
		fontWeight: 'bold',
		padding: '8px 20px',
	},
	dialog: {
		zIndex: '9999999999 !important',
	},
	royaltyAcres: {
		'& .MuiInputBase-input': {
			color: 'red',
		},
	},
	selectedType: {
		color: 'black',
		borderBottom: '4px solid #01B0F0',
		display: 'inline',
		cursor: 'pointer',
	},
	unSelectedType: {
		display: 'inline',
		color: '#827F7F',
		cursor: 'pointer',
	},
	netAcresOveridden: {
		'& .MuiInputBase-input': {
			color: '#01B0F0 !important',
			fontWeight: 'bold !important',
		},
	},
	netAcresNormal: {
		'& .MuiInputBase-input': {
			color: 'inherit !important',
			fontWeight: 'normal !important',
		},
	},
	qtrCalls: {
		margin: '5px 0px',
	},
}));

// Form for adding related unit
function AgreementUnitDialog(props) {
	const { control, reset, getValues } = useForm();
	const classes = useStyles();
	const [unitValue, setUnitValue] = useState({ name: '', _id: null });
	const [selectedShapeLayer, setSelectedShapeLayer] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		// if launched from grid row set initializing based on selectedWell state
		if (selectedShapeLayer?.shapeJson) {
			setUnitValue({ _id: selectedShapeLayer._id, name: selectedShapeLayer.name });
			const form = {
				unit: {
					...selectedShapeLayer,
					unitId: selectedShapeLayer?._id,
					unitName: selectedShapeLayer?.name,
					status: selectedShapeLayer?.shapeJson?.properties?.uStatus,
					number: selectedShapeLayer?.shapeJson?.properties?.uNumber,
					acres: selectedShapeLayer?.shapeJson?.properties?.uAcres,
					state: selectedShapeLayer?.shapeJson?.properties?.originalProperties?.State,
				},
			};
			reset({ ...form });
		} else {
			if (selectedShapeLayer?.clear) {
				setUnitValue({ name: '', _id: null });
				reset({ ...getValues(), tract: {} });
			}
		}
	}, [selectedShapeLayer]);

	const [addRelatedShape] = useMutation(ADD_RELATED_SHAPE, {
		onCompleted: data => {
			if (data.addRelatedShape.success) {
				Loaders.successToast('ageement-unit-creation', 'Agreement unit created Successfully');
			} else {
				Loaders.errorToast('ageement-unit-creation', data.addRelatedShape.message);
			}
		},
		refetchQueries: ['getDbData', 'getESFilterList'],
		awaitRefetchQueries: true,
	});

	const handleSave = async () => {
		if (!props?.shapeId || !selectedShapeLayer?._id) {
			return;
		}
		setLoading(true);
		await addRelatedShape({
			variables: {
				descriptorObject: props.shapeId,
				relatedObject: selectedShapeLayer._id,
			},
			refetchQueries: ['getDbData', 'getCustomLayer'],
			awaitRefetchQueries: true,
		});
		tableGlobalController.refetch();
		props.onClose();
		setLoading(false);
	};

	return (
		<RightDialog open={props.open} handleClickDialogClose={() => props.onClose()} width={'450px'}>
			<div style={{ padding: '30px' }}>
				<Grid item xs={12} style={{ maxHeight: '75px' }}>
					<h4
						style={{
							margin: '0 0 15px 0',
							float: 'left',
							fontSize: '1.1rem',
						}}
					>
						Associate Unit to Agreement
					</h4>
					<div style={{ float: 'right' }}>
						<IconButton onClick={() => props.onClose()} size="small">
							<CloseIcon2 fontSize="small" />
						</IconButton>
					</div>
				</Grid>
				<AutoCompleteShapeLayer value={unitValue} shapeType="unit" setSelectedShapeLayer={setSelectedShapeLayer} />
				<Controller
					as={TextField}
					id="unitName"
					disabled
					control={control}
					variant="outlined"
					margin="dense"
					name={`${'unit.'}name`}
					label={'Unit Name'}
					InputLabelProps={{ shrink: true }}
					fullWidth
					defaultValue={''}
				/>
				<Controller
					as={TextField}
					id="unitNumber"
					disabled
					control={control}
					variant="outlined"
					margin="dense"
					name={`${'unit.'}number`}
					label={'Unit Number'}
					InputLabelProps={{ shrink: true }}
					fullWidth
					defaultValue={''}
				/>

				<Controller
					as={TextField}
					id="unitAcres"
					disabled
					control={control}
					variant="outlined"
					margin="dense"
					name={`${'unit.'}acres`}
					label={'Unit Acres'}
					InputLabelProps={{ shrink: true }}
					fullWidth
					defaultValue={''}
				/>

				<Controller
					as={TextField}
					id="state"
					disabled
					control={control}
					variant="outlined"
					margin="dense"
					name={`${'unit.'}state`}
					label={'State'}
					InputLabelProps={{ shrink: true }}
					fullWidth
					defaultValue={''}
				/>

				<Controller
					as={TextField}
					id="unitStatus"
					disabled
					control={control}
					variant="outlined"
					margin="dense"
					name={'unit.status'}
					label={'Unit Status'}
					InputLabelProps={{ shrink: true }}
					fullWidth
					defaultValue={''}
				/>
				<div className={classes.dialogFooter}>
					<Button
						variant="contained"
						color="default"
						size="medium"
						disableElevation
						onClick={() => props.onClose()}
						disabled={false}
						className={classes.footerButton}
						style={{ margin: '0px 15px 0px 0px' }}
					>
						Cancel
					</Button>

					<Button
						variant="contained"
						color="secondary"
						id="saveButton"
						size="medium"
						disableElevation
						onClick={() => {
							handleSave();
						}}
						className={classes.footerButton}
						// disabled={!selectedShapeLayer?._id}
					>
						{loading ? <CircularProgress size={14} /> : 'Save'}
					</Button>
				</div>
			</div>
		</RightDialog>
	);
}

export default AgreementUnitDialog;
