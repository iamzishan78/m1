import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import { Typography, Grid, TextField, MenuItem, Select, Button, IconButton } from '@material-ui/core';
import { Clear } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

import { useMutation } from '@apollo/client';
import moment from 'moment';
import PropTypes from 'prop-types';

import ContactPaginatedAutocomplete from 'components/Revenue/components/Common/ContactsPaginatedAutocomplete';
import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';
import { getDateWithoutTime } from 'components/Shared/functions';
import ArrowForwardIcon from 'components/Shared/svgIcons/KeyboardTabBlackIcon';

import { ADD_PROPERTY_INTEREST } from 'graphQL/useMutationAddpropertyInterest';
import { UPDATE_PROPERTY_INTEREST } from 'graphQL/useMutationUpdatepropertyInterest';

import { tableGlobalController } from 'stateManagement/tableController';

import GlobalStyles from 'GlobalStyles.js';

const interestTypeOptions = ['Royalty Interest', 'Overriding Royalty', 'Working Interest'];

const statusOptions = ['Active', 'Inactive'];

const costFreeOptions = ['No', 'Yes - All Products', 'Yes - Gas', 'Yes - Oil', 'Unknown'];

const productTypeOptions = ['OIL', 'GAS', 'NGL', 'ALL'];

const useStyles = makeStyles(() => ({
	sideModal: {
		marginTop: 20,
		marginRight: 24,
		padding: '16px 10px',
		background: '#ffffff',
		borderRadius: 8,
		overflow: 'auto',
		maxWidth: '620px',
	},
	metaPanelCloseIcon: {
		'& svg': {
			fontSize: 18,
			cursor: 'pointer',
			fill: '#808080 !important',
		},
	},
	numberField: {
		'& input[type=number]': {
			'-moz-appearance': 'textfield',
		},
		'& input[type=number]::-webkit-outer-spin-button': {
			'-webkit-appearance': 'none',
			margin: 0,
		},
		'& input[type=number]::-webkit-inner-spin-button': {
			'-webkit-appearance': 'none',
			margin: 0,
		},
	},
	dateRoot: {
		color: 'grey',
		'& input': {
			marginLeft: '20px',
		},
	},
	select: {
		width: '100%',
	},
	btnColor: {
		color: 'white',
		// backgroundColor: "#60ABD6",
		backgroundColor: GlobalStyles.colors.lightBlue,
	},
	fieldset: {
		marginTop: 40,
	},
}));

const InterestDetailForm = ({ selectedInterest, propertyOwnerContact, onClose }) => {
	const classes = useStyles();
	let history = useHistory();

	const { control, getValues, reset, watch } = useForm();

	const [addPropertyInterest, { loading: addLoading }] = useMutation(ADD_PROPERTY_INTEREST, {
		onCompleted: () => {
			onClose();
			tableGlobalController.refetch();
		},
		refetchQueries: ['getDbData', 'getESFilterList'],
		awaitRefetchQueries: true,
	});
	const [updatePropertyInterest, { loading: updateLoading }] = useMutation(UPDATE_PROPERTY_INTEREST, {
		onCompleted: () => {
			onClose();
			tableGlobalController.refetch();
		},
		refetchQueries: ['getDbData', 'getESFilterList'],
		awaitRefetchQueries: true,
	});

	const handleSave = () => {
		const id = history.location.pathname.split('/')[4];
		const values = getValues();

		values.effectiveDate = getDateWithoutTime(values.effectiveDate);
		if (selectedInterest) {
			updatePropertyInterest({
				variables: {
					propertyInterest: {
						...values,
						_id: selectedInterest._id,
						interestType: values?.interestType?.name ? values.interestType.name : values.interestType,
						owner: values?.owner?._id ? values.owner._id : null,
					},
				},
			});
		} else {
			addPropertyInterest({
				variables: {
					propertyInterest: {
						...values,
						interestType: values?.interestType?.name ? values.interestType.name : values.interestType,
						owner: values?.owner?._id ? values.owner._id : null,
						propertyId: id,
					},
				},
			});
		}
	};

	useEffect(() => {
		if (selectedInterest) {
			const { interestAmount, effectiveDate, owner } = selectedInterest;
			reset({
				...selectedInterest,
				interestAmount: typeof interestAmount === 'number' ? interestAmount.toString() : interestAmount,
				effectiveDate: effectiveDate ? moment(effectiveDate).format('YYYY-MM-DD') : null,
				owner: owner
					? {
							...owner,
							name: owner?.entityDetail?.name,
						}
					: { name: '', _id: null },
			});
		} else if (propertyOwnerContact) {
			reset({ owner: propertyOwnerContact });
		}
	}, [selectedInterest, propertyOwnerContact]);

	return (
		<div className={`flex column justifyStart alignStart w-100 ${classes.sideModal}`}>
			<div className="flex justifyBetween alignCenter w-100">
				<Typography
					varient="h5"
					className={classes.titleText}
					style={{
						textTransform: 'uppercase',
						fontWeight: 'bold',
						marginLeft: '5px',
					}}
				>
					{selectedInterest ? 'Update' : 'Add'} Interest Details
				</Typography>
				<div className="flex alignCenter">
					<span onClick={onClose} className={classes.metaPanelCloseIcon}>
						<ArrowForwardIcon />
					</span>
				</div>
			</div>
			<Grid container style={{ padding: '0px 10px' }}>
				<Grid item xs={12} className={classes.fieldset}>
					<label>Owner Name</label>
					<Controller
						control={control}
						name="owner"
						defaultValue={{ name: '', _id: null }}
						render={({ field }) => (
							<ContactPaginatedAutocomplete
								nameAutValue={field.value}
								setNameAutValue={value => {
									field.onChange(value);
								}}
							/>
						)}
					/>
				</Grid>
				<Grid item xs={12} className={classes.fieldset}>
					<label>Interest Type</label>
					<CustomAutoComplete
						control={control}
						watch={watch}
						fieldConfig={{
							margin: 'dense',
							allowNewOptions: true,
						}}
						fieldAttributes={{
							name: 'interestType',
							optionArray: interestTypeOptions,
						}}
					/>
				</Grid>
				<Grid item xs={12} className={classes.fieldset}>
					<label>Product Type</label>
					<Controller
						control={control}
						name="productType"
						defaultValue={null}
						render={({ field }) => (
							<Select
								fullWidth
								value={field.value}
								onChange={e => {
									field.onChange(e.target.value);
								}}
							>
								{productTypeOptions.map(option => (
									<MenuItem key={option} value={option}>
										{option}
									</MenuItem>
								))}
							</Select>
						)}
					/>
				</Grid>
				<Grid item xs={12} className={classes.fieldset}>
					<label>Interest Amount</label>
					<Controller
						control={control}
						name="interestAmount"
						defaultValue={''}
						render={({ field }) => (
							<TextField
								style={{ width: '100%' }}
								className={classes.numberField}
								type="number"
								value={field.value}
								onChange={e => field.onChange(e.target.value)}
							/>
						)}
					/>
				</Grid>
				<Grid item xs={12} className={classes.fieldset}>
					<label>Effective Date</label>
					<Controller
						control={control}
						name="effectiveDate"
						defaultValue={null}
						render={({ field }) => (
							<TextField
								{...field}
								type="date"
								margin="dense"
								fullWidth
								value={field.value ? moment(field.value).utc(true).format('yyyy-MM-DD') : ''}
								InputLabelProps={{ shrink: true }}
								InputProps={{
									endAdornment: (
										<IconButton
											onClick={() => {
												field.onChange('');
											}}
										>
											<Clear style={{ height: 22, width: 22 }} />
										</IconButton>
									),
									classes: { root: classes.dateRoot },
								}}
							/>
						)}
					/>
				</Grid>
				<Grid item xs={12} className={classes.fieldset}>
					<label>End Date</label>
					<Controller
						control={control}
						name="endDate"
						defaultValue={null}
						render={({ field }) => (
							<TextField
								{...field}
								type="date"
								margin="dense"
								fullWidth
								value={field.value ? moment(field.value).utc(true).format('yyyy-MM-DD') : ''}
								InputLabelProps={{ shrink: true }}
								InputProps={{
									endAdornment: (
										<IconButton
											onClick={() => {
												field.onChange('');
											}}
										>
											<Clear style={{ height: 22, width: 22 }} />
										</IconButton>
									),
									classes: { root: classes.dateRoot },
								}}
							/>
						)}
					/>
				</Grid>
				<Grid item xs={12} className={classes.fieldset}>
					<label>Status</label>
					<Controller
						control={control}
						name="status"
						defaultValue={null}
						render={({ field }) => (
							<Select
								fullWidth
								value={field.value}
								onChange={e => {
									field.onChange(e.target.value);
								}}
							>
								{statusOptions.map(option => (
									<MenuItem key={option} value={option}>
										{option}
									</MenuItem>
								))}
							</Select>
						)}
					/>
				</Grid>
				<Grid item xs={12} className={classes.fieldset}>
					<label>Cost Free?</label>
					<Controller
						control={control}
						name="costFree"
						defaultValue={null}
						render={({ field }) => (
							<Select
								fullWidth
								value={field.value}
								onChange={e => {
									field.onChange(e.target.value);
								}}
							>
								{costFreeOptions.map(option => (
									<MenuItem key={option} value={option}>
										{option}
									</MenuItem>
								))}
							</Select>
						)}
					/>
				</Grid>
				<Grid item xs={12} className={classes.fieldset}>
					<div>
						<div style={{ float: 'right' }}>
							<Button
								style={{ margin: '25px 5px 25px 0px' }}
								variant="outlined"
								onClick={onClose}
								disabled={updateLoading || addLoading}
							>
								Cancel
							</Button>
							<Button
								className={classes.btnColor}
								variant="outlined"
								onClick={handleSave}
								disabled={updateLoading || addLoading}
							>
								{selectedInterest ? 'Update' : 'Add'}
							</Button>
						</div>
					</div>
				</Grid>
			</Grid>
		</div>
	);
};

InterestDetailForm.propTypes = {
	selectedInterest: PropTypes.object,
	propertyOwnerContact: PropTypes.object,
	onClose: PropTypes.func.isRequired,
};

export default InterestDetailForm;
