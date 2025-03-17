import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { Box, CircularProgress, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';

import { useMutation } from '@apollo/client';

import RightDialog from 'components/ContactDetailCard/components/RightDialog';
import AutoCompleteShapeLayer from 'components/Shared/Forms/Fields/AutoCompleteShapeLayer';

import { ADD_TRACTS_TOA_SHAPE } from 'graphQL/useMutationAddTractsToAShape';

import { tableGlobalController } from 'stateManagement/tableController';

const useStyles = makeStyles(theme => ({
	dialogFooter: {
		display: 'flex',
		justifyContent: 'flex-end',
		paddingTop: '10px',
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
}));

function AddTractUnitDialog(props) {
	const classes = useStyles();
	const { control, reset } = useForm();
	const dialogFieldsKeys = [
		{ name: 'uName', label: 'Unit Name' },
		{ name: 'uNumber', label: 'Unit Number' },
		{ name: 'uType', label: 'Unit Type' },
		{ name: 'uStatus', label: 'Unit Status' },
		{ name: 'uAcres', label: 'Unit Acres' },
		{ name: 'uPrimaryOperator', label: 'Current Operator' },
		{ name: 'uUnitPricing', label: 'Target Unit Pricing (per NRA)' },
		{ name: 'uMaxUnitPricing', label: 'Max Unit Pricing (per NRA)' },
		{ name: 'qualifier', label: 'Qualifier' },
		{ name: 'reviewer', label: 'Reviewer' },
		{ name: 'campaigns', label: 'Campaigns' },
	];
	const [loading, setLoading] = useState(false);
	const [selectedShapeLayer, setSelectedShapeLayer] = useState(null);

	const [addShapeTract] = useMutation(ADD_TRACTS_TOA_SHAPE, {
		onCompleted: () => {
			setLoading(false);
			handleClose();
			tableGlobalController.refetch();
		},
		refetchQueries: ['getDbData', 'getESFilterList'],
		awaitRefetchQueries: true,
	});

	useEffect(() => {
		if (selectedShapeLayer?.shapeJson) {
			reset({
				...selectedShapeLayer?.shapeJson?.properties,
				qualifier: selectedShapeLayer?.shapeJson?.properties?.qualifier?.name,
				reviewer: selectedShapeLayer?.shapeJson?.properties?.reviewer?.name,
				campaigns: selectedShapeLayer?.shapeJson?.properties?.campaigns?.map(c => c.name)?.join(', '),
			});
		}
	}, [reset, selectedShapeLayer]);

	const handleClose = () => {
		setSelectedShapeLayer(null);
		reset({});
		props.onClose();
	};

	const handleSave = () => {
		setLoading(true);
		addShapeTract({
			variables: {
				shapeTracts: [
					{
						shapeId: selectedShapeLayer._id,
						...props.selectedTract,
					},
				],
				shapeType: 'Unit',
			},
		});
	};

	const DialogFields = () => {
		return dialogFieldsKeys.map(({ name, label }) => (
			<Controller
				key={name}
				as={TextField}
				control={control}
				variant="outlined"
				margin="dense"
				name={name}
				label={label}
				InputLabelProps={{ shrink: true }}
				fullWidth
				disabled
				defaultValue={''}
			/>
		));
	};

	return (
		<>
			<RightDialog open={props.open} handleClickDialogClose={handleClose} width={props.width}>
				<div style={{ padding: '30px', width: '500px' }}>
					<Grid item xs={12} style={{ minHeight: '35px' }}>
						<h4
							style={{
								margin: '0 0 15px 0',
								float: 'left',
								fontSize: '1.1rem',
							}}
						>
							Add Related Unit to Tract
						</h4>
						<div style={{ float: 'right' }}>
							<IconButton onClick={handleClose} size="small">
								<CloseIcon fontSize="small" />
							</IconButton>
						</div>
					</Grid>

					<div>
						<Box mt={2}>
							<Typography>Search for existing unit to associate to the tract</Typography>
						</Box>

						<AutoCompleteShapeLayer shapeType="unit" setSelectedShapeLayer={setSelectedShapeLayer} />
						<DialogFields />
					</div>

					<div className={classes.dialogFooter}>
						<Button
							variant="contained"
							color="default"
							size="medium"
							disableElevation
							onClick={handleClose}
							disabled={loading}
							className={classes.footerButton}
							style={{ margin: '0px 15px 0px 0px' }}
						>
							Cancel
						</Button>

						<Button
							variant="contained"
							color="secondary"
							size="medium"
							disableElevation
							onClick={() => {
								handleSave();
							}}
							className={classes.footerButton}
							disabled={!selectedShapeLayer?._id}
						>
							{loading ? <CircularProgress size={14} /> : 'Save'}
						</Button>
					</div>
				</div>
			</RightDialog>
		</>
	);
}

export default AddTractUnitDialog;
