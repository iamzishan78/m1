import { useLazyQuery, useMutation } from '@apollo/client';
import {
	CircularProgress,
	Dialog,
	OutlinedInput,
	InputAdornment,
	Typography,
	Menu,
	MenuItem,
	ListItemIcon,
	ListItemText,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import DeleteIcon from '@material-ui/icons/Delete';
import KeyboardTabIcon from '@material-ui/icons/KeyboardTab';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Autocomplete from '@material-ui/lab/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useContext } from 'react';
import NumberFormat from 'react-number-format';

import DeleteConfirmationDialogContent from 'components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent';

import { ADDWELLINTEREST } from 'graphQL/useMutationAddWellInterest';
import { UPDATEWELLINTEREST } from 'graphQL/useMutationUpdateWellInterest';
import { GET_ES_SIMPLE_SEARCH } from 'graphQL/useQueryESSimpleSearch';
import { INTERESTOWNERTYPESQUERY } from 'graphQL/useQueryInterestOwnerTypes';
import { INTERESTTYPESQUERY } from 'graphQL/useQueryInterestTypes';
import { TENANTWELL } from 'graphQL/useQueryTenantWell';

// contexts
import { tableGlobalController } from 'hookstate/tableController';

import { AppContext } from 'AppContext';

import RightDialog from '../../RightDialog';

function NumberFormatCustom(props) {
	const { inputRef, onChange, name, ...other } = props;

	return (
		<NumberFormat
			{...other}
			getInputRef={inputRef}
			onValueChange={values => {
				onChange({
					target: {
						name: props.name,
						value: values.value,
					},
				});
			}}
			// thousandSeparator
			// isNumericString
			// prefix="$"
		/>
	);
}

NumberFormatCustom.propTypes = {
	inputRef: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};
function CurrencyFormatCustom(props) {
	const { inputRef, onChange, name, ...other } = props;

	return (
		<NumberFormat
			{...other}
			getInputRef={inputRef}
			onValueChange={values => {
				onChange({
					target: {
						name: props.name,
						value: values.value,
					},
				});
			}}
			thousandSeparator
			isNumericString
			prefix="$"
		/>
	);
}

CurrencyFormatCustom.propTypes = {
	inputRef: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};

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
	menu: {
		'& .MuiListItem-root': {
			'& .MuiListItemIcon-root': {
				minWidth: '30px',
				'& .MuiSvgIcon-root': {
					fill: 'red !important',
				},
			},
		},
	},
}));

function AddWellInterestDialog(props) {
	const classes = useStyles();

	const [stateApp, setStateApp] = useContext(AppContext);

	const [initializing, setInitializing] = useState(true);
	const [loading, setLoading] = useState(false);
	const [foundWells, setFoundWells] = useState([]);
	const [selectedWell, setSelectedWell] = useState(null);
	const [formLeaseName, setFormLeaseName] = useState('');
	const [formLeaseAcres, setFormLeaseAcres] = useState(null);
	const [formOwnerName, setFormOwnerName] = useState('');
	const [formInterestOwnerType, setFormInterestOwnerType] = useState('');
	const [formInterestType, setFormInterestType] = useState('');
	const [formInterestAmount, setFormInterestAmount] = useState(null);
	const [formRoyaltyAcres, setFormRoyaltyAcres] = useState(null);
	const [formTaxValue, setFormTaxValue] = useState(null);
	const [interestOwnerTypes, setInterestOwnerTypes] = useState([]);
	const [interestTypes, setInterestTypes] = useState([]);
	const [valid, setValid] = useState({});
	const [anchorEl, setAnchorEl] = useState();

	const [getInterestOwnerTypes, { data: dataInterestOwnerTypes }] = useLazyQuery(INTERESTOWNERTYPESQUERY, {
		fetchPolicy: 'cache-and-network',
	});
	const [getInterestTypes, { data: dataInterestTypes }] = useLazyQuery(INTERESTTYPESQUERY, {
		fetchPolicy: 'cache-and-network',
	});
	const [getTenantWell, { data: dataTenantWell, loading: loadingTenantWell }] = useLazyQuery(TENANTWELL, {
		// must be network-only to trigger state change for field updates
		fetchPolicy: 'network-only',
	});
	const [addWellInterest] = useMutation(ADDWELLINTEREST, {
		onCompleted: () => {
			setLoading(false);
			handleClose();
			refetchTable();
		},
		refetchQueries: [
			'getContactWells',
			'getContactWellCardDetail',
			'getPaginatedContactWellInterests',
			'getContactWellInterestsFilterOptions',
		],
		awaitRefetchQueries: true,
	});
	const [updateWellInterest] = useMutation(UPDATEWELLINTEREST, {
		onCompleted: () => {
			refetchTable();
			setLoading(false);
			handleClose();
		},
		refetchQueries: ['getContactWells', 'getPaginatedContactWellInterests', 'getContactWellInterestsFilterOptions'],
		awaitRefetchQueries: true,
	});

	const [getESSimpleSearch] = useLazyQuery(GET_ES_SIMPLE_SEARCH, {
		fetchPolicy: 'no-cache',
		onCompleted: wellsData => {
			if (wellsData?.getESSimpleSearch?.hits) {
				setFoundWells(wellsData.getESSimpleSearch.hits);
			}
		},
	});

	const refetchTable = () => {
		tableGlobalController.refetch();
	};

	useEffect(() => {
		getInterestOwnerTypes();
		getInterestTypes();
	}, [getInterestOwnerTypes, getInterestTypes]);

	useEffect(() => {
		setInterestOwnerTypes(dataInterestOwnerTypes?.interestOwnerTypes?.res?.map(e => e.Desc));
	}, [dataInterestOwnerTypes]);

	useEffect(() => {
		setInterestTypes(dataInterestTypes?.interestTypes?.res?.map(e => e.Desc));
	}, [dataInterestTypes]);

	useEffect(() => {
		if (!dataTenantWell?.tenantWell) {
			return;
		}

		const leaseToSet = dataTenantWell?.tenantWell?.lease || '';
		const leaseAcresToSet = dataTenantWell?.tenantWell?.leaseAcres;

		setSelectedWell({
			...selectedWell,
			Lease: leaseToSet,
			LeaseAcreage: leaseAcresToSet,
		});

		setFormLeaseName(leaseToSet);
		setFormLeaseAcres(leaseAcresToSet);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dataTenantWell]);

	useEffect(() => {
		if (stateApp.activeWellInterest) {
			setInitializing(true);
			setSelectedWell({
				Id: stateApp.activeWellInterest.wellId || stateApp.activeWellInterest.well._id,
				WellName: stateApp.activeWellInterest.wellName || stateApp.activeWellInterest.well.wellName,
				ApiNumber: stateApp.activeWellInterest.api || stateApp.activeWellInterest.well.apiNumber,
				LeaseId: stateApp.activeWellInterest.leaseId || stateApp.activeWellInterest.well.leaseId,
				Lease: stateApp.activeWellInterest.lease || stateApp.activeWellInterest.well.lease,
				LeaseAcreage: stateApp.activeWellInterest.leaseAcres || stateApp.activeWellInterest.well.leaseAcres,
			});
			setFormLeaseName(stateApp.activeWellInterest.lease || stateApp.activeWellInterest.well.lease);
			setFormLeaseAcres(stateApp.activeWellInterest.leaseAcres || stateApp.activeWellInterest.well.leaseAcres);
			setFormOwnerName(stateApp.activeWellInterest.interestOwner);
			setFormInterestOwnerType(stateApp.activeWellInterest.interestOwnerType);
			setFormInterestType(stateApp.activeWellInterest.type);
			setFormInterestAmount(stateApp.activeWellInterest.amount);
			setFormRoyaltyAcres(stateApp.activeWellInterest.nra);
			setFormTaxValue(stateApp.activeWellInterest.taxValue || stateApp.activeWellInterest.value);
		}
	}, [stateApp.activeWellInterest]);

	useEffect(() => {
		// if launched from grid row set initializing based on selectedWell state
		setInitializing(false);
	}, [selectedWell]);

	const handleClose = () => {
		setFoundWells([]);
		setSelectedWell(null);
		setFormLeaseName('');
		setFormLeaseAcres(null);
		setFormOwnerName('');
		setFormInterestOwnerType('');
		setFormInterestType('');
		setFormInterestAmount(null);
		setFormRoyaltyAcres(null);
		setFormTaxValue(null);
		setStateApp(stateApp => ({
			...stateApp,
			wellInterestDialog: false,
			activeWellInterest: null,
		}));
		setInitializing(false);
		setValid({});
		props.onClose();
	};

	const formatRoyaltyAcres = royaltyAcres => {
		const decimals = royaltyAcres.toString().split('.');
		if (decimals[1] && decimals[1].length > 8) {
			royaltyAcres = royaltyAcres.toFixed(8);
		}
		return Number(royaltyAcres);
	};

	const handleRecalcNRA = (leaseAcres, interest) => {
		if (initializing || leaseAcres == null || interest == null) {
			return;
		}
		setFormRoyaltyAcres(formatRoyaltyAcres(leaseAcres * interest * 8));
	};

	const handleValidate = () => {
		const tempValid = {
			...valid,
			'selectedWell.Id': !selectedWell?.Id,
		};
		setValid(tempValid);

		return !Object.values(tempValid).reduce((acc, cur) => acc + cur);
	};

	const handleSave = () => {
		setLoading(true);
		if (stateApp.activeWellInterest) {
			updateWellInterest({
				variables: {
					wellInterest: {
						id: stateApp.activeWellInterest._id,
						globalWellId: selectedWell.Id,
						// ...(selectedWell?.LeaseId !== formLeaseId) && {leaseId: formLeaseId},
						...(selectedWell?.Lease !== formLeaseName && { lease: formLeaseName }),
						...(selectedWell?.LeaseAcreage !== formLeaseAcres && { leaseAcres: formLeaseAcres }),
						interestOwner: formOwnerName,
						interestOwnerType: formInterestOwnerType,
						type: formInterestType,
						interest: formInterestAmount,
						value: formTaxValue,
						nra: formRoyaltyAcres,
					},
				},
				refetchQueries: [
					'getContactWells',
					'getPaginatedContactWellInterests',
					'getContactWellInterestsFilterOptions',
					'getContactSummary',
				],
				awaitRefetchQueries: true,
			});
		} else {
			addWellInterest({
				variables: {
					wellInterest: {
						globalWellId: selectedWell.Id,
						userId: stateApp.user.mongoId,
						contactId: props.contactId,
						// ...(selectedWell?.LeaseId !== formLeaseId) && {leaseId: formLeaseId},
						...(selectedWell?.Lease !== formLeaseName && { lease: formLeaseName }),
						...(selectedWell?.LeaseAcreage !== formLeaseAcres && { leaseAcres: formLeaseAcres }),
						interestOwner: formOwnerName,
						interestOwnerType: formInterestOwnerType,
						type: formInterestType,
						interest: formInterestAmount,
						value: formTaxValue,
						nra: formRoyaltyAcres,
					},
				},
				refetchQueries: [
					'getContactWells',
					'getContactWellCardDetail',
					'getPaginatedContactWellInterests',
					'getContactWellInterestsFilterOptions',
					'getContactSummary',
				],
				awaitRefetchQueries: true,
			});
		}
	};

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const openConfirmationDialog = () => {
		setDeleteDialogOpen(true);
		handleMenuClose();
	};
	const handleCloseDialog = () => {
		setDeleteDialogOpen(false);
	};

	const deleteFunc = async () => {
		try {
			setLoading(true);
			updateWellInterest({
				variables: {
					wellInterest: {
						id: stateApp.activeWellInterest._id,
						isDeleted: true,
					},
				},
				refetchQueries: ['getContactWells', 'getPaginatedContactWellInterests', 'getContactWellInterestsFilterOptions'],
				awaitRefetchQueries: true,
			});
		} catch {
			setLoading(false);
		}
	};

	const handleMenuClick = event => setAnchorEl(event.currentTarget);

	const handleMenuClose = () => setAnchorEl(null);

	return (
		<>
			{deleteDialogOpen && (
				<Dialog
					className={classes.dialog}
					open={deleteDialogOpen ? true : false}
					onClose={handleCloseDialog}
					fullWidth={false}
					maxWidth="sm"
				>
					<DeleteConfirmationDialogContent
						header={'Delete Well Interest'}
						onClose={handleCloseDialog}
						deleteFunc={deleteFunc}
						m1nSelectedRowsIds={null}
						setM1nSelectedRowsIndexes={() => {}}
					>
						Do you want to delete the selected well interest?
					</DeleteConfirmationDialogContent>
				</Dialog>
			)}
			<RightDialog open={props.open} handleClickDialogClose={handleClose} width={props.width}>
				<div style={{ padding: '30px' }}>
					<Grid item xs={12} style={{ minHeight: '35px' }}>
						<h4
							style={{
								margin: 0,
								float: 'left',
								fontSize: '1.1rem',
							}}
						>
							{stateApp.activeWellInterest ? 'Update Well Interest' : 'Add Well Interest'}
						</h4>
						<div style={{ float: 'right' }}>
							{stateApp.activeWellInterest && (
								<>
									<IconButton disabled={loading} size="small" style={{ margin: '0 8px' }}>
										{loading ? (
											<CircularProgress size={20} color="secondary" />
										) : (
											<MoreHorizIcon size="medium" onClick={handleMenuClick} />
										)}
									</IconButton>
									<Menu
										id="dealMenu"
										anchorEl={anchorEl}
										keepMounted
										open={Boolean(anchorEl)}
										onClose={handleMenuClose}
										className={classes.menu}
										getContentAnchorEl={null}
										anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
										transformOrigin={{ vertical: 'top', horizontal: 'center' }}
									>
										<MenuItem onClick={openConfirmationDialog}>
											<ListItemIcon>
												<DeleteIcon size="medium" />
											</ListItemIcon>
											<ListItemText>Delete</ListItemText>
										</MenuItem>
									</Menu>
								</>
							)}
							<IconButton onClick={handleClose} size="small">
								<KeyboardTabIcon fontSize="large" />
							</IconButton>
						</div>
					</Grid>

					<div style={{ marginTop: '15px' }}>
						<FormControl variant="outlined" fullWidth size="small">
							<Autocomplete
								options={foundWells || []}
								onChange={(e, well) => {
									setSelectedWell(well);
									well &&
										getTenantWell({
											variables: {
												globalWellId: well.Id,
											},
										});
									well &&
										setValid({
											...valid,
											'selectedWell.Id': false,
										});
								}}
								value={selectedWell}
								getOptionLabel={(option, value) => option.WellName}
								filterOptions={x => x}
								renderOption={option => {
									const parts = parse(option.WellName, []);

									return (
										<Grid container spacing={0}>
											<Grid container item xs={11} alignItems="center">
												<Grid item xs>
													{parts.map((part, index) => (
														<span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
															{part.text}
														</span>
													))}

													{option && option.ApiNumber && (
														<Typography variant="body2" color="textSecondary">
															{option.ApiNumber}
														</Typography>
													)}
												</Grid>
											</Grid>
											<Grid container item xs={1} alignItems="center">
												<Grid item style={{ position: 'relative' }}>
													<div
														className={classes.score}
														style={{
															zIndex: '1300',
															backgroundColor: '#12ABE0',
														}}
													/>
													<div
														className={classes.score}
														style={{
															zIndex: '1301',
															backgroundImage:
																'repeating-linear-gradient(135deg, #ffffff , #ffffffb7 4.5%, #ffffff 15%)',
														}}
													/>
												</Grid>
											</Grid>
										</Grid>
									);
								}}
								renderInput={params => (
									<TextField
										margin="dense"
										{...params}
										required
										error={valid['selectedWell.Id']}
										helperText={valid['selectedWell.Id'] ? 'Select a well to get started' : ''}
										variant="outlined"
										label="Search for a well by name or API"
										InputLabelProps={{ shrink: true }}
										onChange={event => {
											getESSimpleSearch({
												variables: {
													index: 'platformData:wells',
													pagination: {
														first: 50,
														after: null,
													},
													search: {
														query: `*${event.target.value}*`,
														fields: [
															'api.keyword',
															'wellName.keyword',
															'state.keyword',
															'county.keyword',
															'wellType.keyword',
															'wellStatus.keyword',
															'operator.keyword',
															'wellBoreProfile.keyword',
														],
														advanceSearch: [],
													},
													filters: [],
												},
											});
										}}
									/>
								)}
							/>
						</FormControl>

						<h4
							style={{
								display: 'inline-block',
							}}
						>
							Selected well and lease information
						</h4>

						{loadingTenantWell && <CircularProgress size={14} style={{ marginLeft: '5px' }} />}

						<TextField
							variant="outlined"
							margin="dense"
							value={selectedWell?.WellName || ''}
							//label={selectedWell?.WellName ? "Well Name" : "Well Name"}
							label={'Well Name'}
							InputLabelProps={{ shrink: true }}
							fullWidth
							disabled
							defaultValue=""
						/>

						<TextField
							variant="outlined"
							margin="dense"
							value={selectedWell?.ApiNumber || ''}
							//label={selectedWell?.ApiNumber ? "API Number" : "API Number"}
							label="API Number"
							InputLabelProps={{ shrink: true }}
							fullWidth
							disabled
							defaultValue=""
						/>

						<TextField
							variant="outlined"
							margin="dense"
							value={formLeaseName}
							onChange={event => setFormLeaseName(event.target.value)}
							label={'Lease Name'}
							fullWidth
							//disabled
							defaultValue=""
						/>

						<TextField
							// type="number"
							variant="outlined"
							margin="dense"
							// error={isNaN(formLeaseAcres)}
							value={formLeaseAcres === 0 || formLeaseAcres ? formLeaseAcres : ''}
							onChange={event => {
								const leaseAcresToSet = parseFloat(event.target.value);
								setFormLeaseAcres(leaseAcresToSet);
								handleRecalcNRA(leaseAcresToSet, formInterestAmount);
							}}
							label={'Lease Acres'}
							// InputLabelProps={{ shrink: true }}
							fullWidth
							//disabled
							defaultValue=""
							InputProps={{
								inputComponent: NumberFormatCustom,
							}}
						/>
					</div>

					<div>
						<h4
							style={
								{
									//margin: "0 0 15px 0",
									//float: "left",
									//fontSize: "1.1rem",
								}
							}
						>
							Enter information for new interest owner
						</h4>

						<TextField
							variant="outlined"
							margin="dense"
							value={formOwnerName}
							onChange={event => setFormOwnerName(event.target.value)}
							label="Interest Owner Name"
							fullWidth
							defaultValue=""
						/>

						<FormControl variant="outlined" fullWidth size="small">
							<Autocomplete
								options={interestOwnerTypes || []}
								onChange={(e, interestOwnerType) => {
									setFormInterestOwnerType(interestOwnerType);
								}}
								value={formInterestOwnerType}
								renderInput={params => (
									<TextField
										margin="dense"
										{...params}
										variant="outlined"
										label="Interest Owner Type"
										InputLabelProps={{ shrink: true }}
									/>
								)}
							/>

							<Autocomplete
								options={interestTypes || []}
								onChange={(e, interestType) => {
									setFormInterestType(interestType);
								}}
								value={formInterestType}
								renderInput={params => (
									<TextField
										margin="dense"
										{...params}
										variant="outlined"
										label="Interest Type"
										InputLabelProps={{ shrink: true }}
									/>
								)}
							/>

							<Grid container spacing={2}>
								<Grid item xs={6}>
									<TextField
										// type="number"
										variant="outlined"
										margin="dense"
										// error={isNaN(formInterestAmount)}
										value={formInterestAmount === 0 || formInterestAmount ? formInterestAmount : ''}
										onChange={event => {
											const interestAmountToSet = parseFloat(event.target.value);
											setFormInterestAmount(interestAmountToSet);
											handleRecalcNRA(formLeaseAcres, interestAmountToSet);
										}}
										//label={formInterestAmount ? "" : "Interest Amount"}
										label="Interest Amount"
										// InputLabelProps={{ shrink: true }}
										fullWidth
										defaultValue=""
										InputProps={{
											inputComponent: NumberFormatCustom,
										}}
									/>
								</Grid>
								<Grid item xs={6}>
									<FormControl fullWidth margin="dense" variant="outlined">
										<InputLabel htmlFor="royality-acres">Net Royalty Acres</InputLabel>
										<OutlinedInput
											id="royality-acres"
											inputComponent={NumberFormatCustom}
											className={
												formRoyaltyAcres !== formatRoyaltyAcres(formInterestAmount * formLeaseAcres * 8)
													? classes.royaltyAcres
													: ''
											}
											value={formRoyaltyAcres === 0 || formRoyaltyAcres ? formRoyaltyAcres : ''}
											onChange={event => setFormRoyaltyAcres(parseFloat(event.target.value))}
											labelWidth={140}
											endAdornment={
												<InputAdornment position="end" style={{ position: 'absolute', right: '-3px' }}>
													{formRoyaltyAcres !== '' &&
														formRoyaltyAcres !== formatRoyaltyAcres(formInterestAmount * formLeaseAcres * 8) && (
															<IconButton
																aria-label="toggle royality-acres"
																onClick={() =>
																	setFormRoyaltyAcres(formatRoyaltyAcres(formInterestAmount * formLeaseAcres * 8))
																}
															>
																<AutorenewIcon />
															</IconButton>
														)}
												</InputAdornment>
											}
										/>
									</FormControl>
								</Grid>
							</Grid>

							<TextField
								variant="outlined"
								margin="dense"
								// error={isNaN(formTaxValue)}
								// value={selectedWell?.acres}
								label="Tax Appraisal Value"
								fullWidth
								InputProps={{
									inputComponent: CurrencyFormatCustom,
								}}
								value={formTaxValue === 0 || formTaxValue ? formTaxValue : ''}
								onChange={event => setFormTaxValue(parseFloat(event.target.value))}
								defaultValue=""
							/>
						</FormControl>
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
							style={{
								margin: '0px 15px 0px 0px',
							}}
						>
							Cancel
						</Button>

						<Button
							variant="contained"
							color="secondary"
							size="medium"
							disableElevation
							onClick={() => {
								handleValidate() && handleSave();
							}}
							className={classes.footerButton}
							disabled={loadingTenantWell || loading || !valid}
						>
							{loading ? <CircularProgress size={14} /> : 'Save'}
						</Button>
					</div>
				</div>
			</RightDialog>
		</>
	);
}

export default AddWellInterestDialog;
