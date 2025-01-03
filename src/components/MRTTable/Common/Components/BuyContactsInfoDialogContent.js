import React, { useEffect, useContext, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Backdrop, FormLabel, Grid, Tooltip } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import ErrorIcon from '@material-ui/icons/Error';
import KeyboardTabIcon from '@material-ui/icons/KeyboardTab';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useLazyQuery, useMutation } from '@apollo/client';

import { FEATURES } from 'components/Shared/FeatureFlag/common';

import { GET_FEATURE_QUOTA } from 'graphQL/useQueryGetFeatureQuota';
import { GET_IDICORE_DATA } from 'graphQL/useQueryGetIdiCoreData';

import { jobController } from 'hookstate/jobStateController';
import { tableGlobalController } from 'hookstate/tableController';

import { Modals } from 'styles/Modal';

import { showErrorMessage, showSuccessMessage } from 'actions';
import { AppContext } from 'AppContext';

const styles = () => ({
	dialogTitle: {
		padding: '25px',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
});

const useStyles = makeStyles(() => ({
	iconsSuccess: {
		'& svg': {
			fill: '#04b004 !important',
		},
	},
	iconsError: {
		'& svg': {
			fill: 'red !important',
		},
	},
	label: {
		background: 'rgba(0,0,0,0.65)',
		color: '#ffffff',
		padding: '4px 10px',
		margin: 3,
		borderRadius: 4,
		boxShadow: '0 0 3px rgb(0 0 0 / 10%)',
		fontWeight: 700,
	},
	addressAutocomplete: {
		borderRadius: 7,
		marginTop: '15px',
	},
}));

const DialogTitle = withStyles(styles)(props => {
	const { children, classes, onClose, ...other } = props;
	return (
		<MuiDialogTitle disableTypography className={classes.dialogTitle} {...other}>
			<Typography variant="h5" style={{ fontWeight: 'bold' }}>
				{children}
			</Typography>
			{onClose ? (
				<IconButton aria-label="close" onClick={onClose} size="medium">
					<KeyboardTabIcon fontSize="large" />
				</IconButton>
			) : null}
		</MuiDialogTitle>
	);
});

// Address field options
const addressOptions = [
	{ label: 'Primary Address', value: 'primaryAddress' },
	{ label: 'Secondary Address', value: 'secondaryAddress' },
];

export default function BuyContactsInfoDialogContent(props) {
	const dispatch = useDispatch();
	const classes = useStyles();
	const [stateApp] = useContext(AppContext);
	const [, setFeatureQuota] = useState(null);
	const [contactDataMissing, setContactDataMissing] = useState([]);
	const [validContactData, setValidContactData] = useState([]);
	const [buyNowClicked, setBuyNowClicked] = useState(false);
	const [dataFetched, setDataFetched] = useState(false);
	const [currentCredits, setCurrentCredits] = useState(-1);
	const [rowsLoading, setRowsLoading] = useState(false);
	const [mondoRes, setMondoRes] = useState([]);

	const [address, setAddress] = useState('primaryAddress'); // Address state
	const modalClass = Modals();

	const jobState = jobController.useState(['JobOutput', 'isJobCompleted', 'isJobFailed'], 'jobStateValues');
	const { jobStateValues } = jobState;

	const [getFeatureQuota, { data: quota }] = useLazyQuery(GET_FEATURE_QUOTA);

	useEffect(() => {
		const feature = stateApp?.user?.features?.find(f => f.name === FEATURES.IDICORE);
		getFeatureQuota({
			variables: {
				featureId: feature.id,
				tenantId: stateApp.user.tenantId,
			},
		});
	}, []);

	useEffect(() => {
		if (quota && quota.featureQuota) {
			setFeatureQuota(quota.featureQuota);
			setCurrentCredits(
				quota.featureQuota.QuotaLimit - (quota.featureQuota.QuotaPending + quota.featureQuota.QuotaUsed)
			);
		}
	}, [quota]);

	const [getIdICoreData, { data: idiCoreData, loading: idiLoading }] = useMutation(GET_IDICORE_DATA);

	// useEffect hook to run side-effects when `idiCoreData` changes
	useEffect(() => {
		// Check if the idiCoreData response indicates success
		if (idiCoreData?.getIdiCoreData?.success) {
			// Update job state with the jobId from idiCoreData
			jobController.updateState({
				storeJobOutput: {
					jobId: idiCoreData?.getIdiCoreData?.jobId,
				},
			});

			// Toggle the bulk upload state
			jobController.toggleBulkUpload();

			// Set dataFetched to true to indicate data has been fetched
			setDataFetched(true);

			// Dispatch a success message to the user
			dispatch(showSuccessMessage('The contact data is being fetched in the job and will be available shortly'));

			// Refetch the table data
			tableGlobalController.refetch();

			// Handle case when idiCoreData indicates failure
		} else if (idiCoreData?.getIdiCoreData?.success === false) {
			// Set dataFetched to true to indicate data has been fetched (even though it failed)
			setDataFetched(true);

			// Dispatch an error message to the user
			dispatch(showErrorMessage('An error occurred - please try again'));
		}
	}, [dispatch, idiCoreData]); // Dependency array to rerun the effect when idiCoreData changes

	// useEffect hook to run side-effects when `jobStateValues.JobOutput` changes
	useEffect(() => {
		// Check if jobStateValues has JobOutput data
		if (jobStateValues?.JobOutput) {
			// Set MondoRes state with the mongoRes from jobStateValues
			setMondoRes(jobStateValues?.JobOutput?.outputs?.insertedMongoRecords);
		}
	}, [jobState.JobOutput, jobStateValues?.JobOutput]); // Dependency array to rerun the effect when jobState.JobOutput changes

	useEffect(() => {
		return () => {
			setMondoRes([]);
			jobController.updateState({ JobOutput: null, storeJobOutput: null });
		};
	}, []);

	function loadPersonData() {
		if (validContactData.length > currentCredits) {
			dispatch(
				showErrorMessage(
					`Requested amount of ${validContactData.length} is greater than remaining credit balance of ${currentCredits} `
				)
			);
		} else {
			setBuyNowClicked(true);
			const feature = stateApp?.user?.features?.find(f => f.name === FEATURES.IDICORE);
			getIdICoreData({
				variables: {
					featureId: feature.id,
					tenantId: stateApp.user.tenantId,
					persons: validContactData,
				},
				refetchQueries: ['featureQuota', 'getCheckPurchaseData', 'getContactPurchaseData', 'getDbData'],
				awaitRefetchQueries: true,
			});
		}
	}

	const setMissingLabelsFunc = contact => {
		const labels = [];
		if (!contact.firstName) {
			labels.push('F');
		}

		if (!contact.lastName) {
			labels.push('L');
		}

		if (!contact.address1) {
			labels.push('A');
		}
		return labels;
	};

	useEffect(() => {
		if (!props.rows || props.rows.length === 0) {
			setRowsLoading(true);
		} else {
			setRowsLoading(false);
			const missingContacts = [];
			let validContacts = [];

			// Check if the address is primary
			const isPrimaryAddress = address === 'primaryAddress';
			for (const row of props.rows) {
				if (!row.name || !row.firstName || !row.lastName || !row.address1) {
					missingContacts.push(row);
				} else if (row.name && row.firstName && row.lastName && (row.address1 || row.address1Alt)) {
					let person = {
						id: row.contactId || row.contact?._id || row._id,
						name: row.name,
						firstName: row.firstName,
						lastName: row.lastName,
						address: (isPrimaryAddress ? row.address1 : row.address1Alt) ?? '', // User either primary/secondary or empty string
						city: (isPrimaryAddress ? row.city : row.cityAlt) ?? '',
						state: (isPrimaryAddress ? row.state : row.stateAlt) ?? '',
						country: (isPrimaryAddress ? row.country : row.countryAlt) ?? '',
						postal: (isPrimaryAddress ? row.zip : row.zipAlt) ?? '',
					};
					validContacts.push(person);
				}
			}
			setContactDataMissing(missingContacts);
			setValidContactData(validContacts);
		}
	}, [props.rows, address]);

	return (
		<React.Fragment>
			{rowsLoading ? (
				<div className={modalClass.loaderWrapper}>
					<CircularProgress color="secondary" className={modalClass.loader} size={80} disableShrink />
				</div>
			) : (
				<>
					<DialogTitle id="customized-dialog-title" onClose={props.onClose}>
						{props.header ? props.header : 'Contact Info Purchase'}
					</DialogTitle>
					<DialogContent>
						<Grid container spacing={1}>
							{props.header === 'Contact Data Integration' && (
								<>
									<Grid item xs={12}>
										<h3 style={{ padding: 0, marginTop: '20px', marginBottom: 0 }}>Available search credits</h3>
									</Grid>
									<Grid item xs={12} className={modalClass.inputContainer}>
										<FormLabel className={modalClass.inputLabel}>Current Balance</FormLabel>
										<FormLabel className={modalClass.inputContent}>
											{currentCredits} Credit
											{currentCredits && currentCredits > 1 ? 's' : ''}
										</FormLabel>
									</Grid>
								</>
							)}

							{/* Address field for contact data enrichment */}
							<Grid item xs={12} style={{ marginTop: '50px' }}>
								<h3 style={{ margin: '0' }}>Contact address to use for search</h3>
								<div className={classes.addressAutocomplete}>
									<Autocomplete
										id="address"
										options={addressOptions}
										getOptionLabel={option => option.label}
										size="small"
										defaultValue={address}
										value={addressOptions.find(opt => opt.value === address)}
										onChange={(_, value) => {
											setAddress(value?.value);
										}}
										renderInput={params => <TextField {...params} label="Address" variant="outlined" value={address} />}
									/>
								</div>
							</Grid>

							<Grid item xs={12} style={{ marginTop: '50px' }}>
								<h3 style={{ margin: '0' }}>Contacts missing required information (will be excluded)</h3>
							</Grid>

							{contactDataMissing &&
								contactDataMissing.map(row => (
									<Grid item xs={12} className={modalClass.inputContainer}>
										<FormLabel className={modalClass.inputLabel}>{`${row.name || 'Name Missing'}`}</FormLabel>
										<FormLabel className={modalClass.inputContent}>
											<div className="flex jusifyEnd alignCenter">
												{setMissingLabelsFunc(row) &&
													setMissingLabelsFunc(row).map((label, index) => (
														<p key={index + 1} className={classes.label}>
															{label}
														</p>
													))}
											</div>
										</FormLabel>
									</Grid>
								))}

							<Grid item xs={12}>
								<p style={{ margin: '0' }}>
									Note: contact data enrichment integration requires contacts to have a valid first name, last name and
									address entered.
								</p>
							</Grid>

							<Grid item xs={12} style={{ marginTop: '50px' }}>
								{validContactData && validContactData.length > 0 && (
									<h3 style={{ margin: '0' }}>Selected contacts with valid information</h3>
								)}
								{validContactData && validContactData.length === 0 && (
									<div className="flex justifyStart alignCenter" style={{ margin: '0 0 8px 0' }}>
										<WarningRoundedIcon style={{ fill: '#000000' }} />
										<h3 style={{ margin: '0 0 0 8px' }}>No selected contacts with valid information</h3>
									</div>
								)}
							</Grid>
							{validContactData &&
								validContactData.map((row, index) => (
									<Grid item xs={12} className={modalClass.inputContainer}>
										<FormLabel className={modalClass.inputLabel}>{`${row.name}`}</FormLabel>
										<FormLabel className={modalClass.inputContent}>
											{(jobStateValues?.isJobCompleted || jobStateValues?.isJobFailed) && jobStateValues?.JobOutput && (
												<>
													{mondoRes?.find(contact => contact.contactId === row.id) ? (
														<span className={classes.iconsSuccess}>
															<Tooltip title="Data found for contact">
																<CheckCircleIcon />
															</Tooltip>
														</span>
													) : (
														<span className={classes.iconsError}>
															<Tooltip title="No data found for contact">
																<ErrorIcon />
															</Tooltip>
														</span>
													)}
												</>
											)}
											{!dataFetched && (
												<DeleteOutlinedIcon
													fontSize="small"
													style={{ cursor: 'pointer', float: 'right' }}
													onClick={() => {
														const validId = validContactData[index].id;
														const reducedRows = props.rows.filter(
															item =>
																// Filter out rows where the contact ID or document ID does not match the validId.
																// Handles cases where contactId, _id, or nested contact._id may be missing.
																item?.contactId !== validId && item?._id !== validId && item?.contact?._id !== validId
														);
														props.setRows(reducedRows);
													}}
												/>
											)}
										</FormLabel>
									</Grid>
								))}

							{validContactData && validContactData.length > 0 && (
								<Grid item xs={12} className={modalClass.greyedInputContainer}>
									<h3 style={{ float: 'left', margin: '5px' }}>TOTAL</h3>
									<h3 style={{ float: 'right', margin: '5px' }}>
										{validContactData && validContactData.length ? validContactData.length : ''} CREDIT
										{validContactData && validContactData.length && validContactData.length > 1 ? 'S' : ''}
									</h3>
								</Grid>
							)}
						</Grid>
					</DialogContent>
					<DialogActions className={modalClass.actionButtons}>
						<Button
							onClick={() => {
								props.onClose();
							}}
							color="primary"
						>
							Cancel
						</Button>
						<Button
							onClick={() => {
								loadPersonData();
							}}
							disabled={buyNowClicked || idiLoading || validContactData.length === 0 || mondoRes?.length}
							color="secondary"
							variant="contained"
						>
							Buy Now
						</Button>
						{idiLoading && (
							<Backdrop style={{ zIndex: 999999 }} open={true} invisible={false}>
								<CircularProgress size={80} disableShrink color="secondary" />{' '}
							</Backdrop>
						)}
					</DialogActions>
				</>
			)}
		</React.Fragment>
	);
}
