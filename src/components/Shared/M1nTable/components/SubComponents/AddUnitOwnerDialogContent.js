import React, { useContext, useState, useEffect } from 'react';
import { get } from 'lodash';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import {
	CircularProgress,
	Grid,
	Dialog,
	InputAdornment,
	Menu,
	MenuItem,
	ListItemIcon,
	ListItemText,
} from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import DeleteIcon from '@material-ui/icons/Delete';
import { UPDATECONTACT } from 'graphQL/useMutationUpdateContact';

import { AppContext } from 'AppContext';
import { useLazyQuery, useMutation } from '@apollo/client';
import { ADD_OWNER_TOA_SHAPE } from 'graphQL/useMutationAddOwnerToAShape';
import { UPDATE_SHAPE_OWNERS } from 'graphQL/useMutationUpdateShapeOwners';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { showErrorMessage, showSuccessMessage } from 'actions';
import RightDialog from 'components/ContactDetailCard/components/RightDialog';
import { addTrailingZeros } from 'components/Shared/functions';
import { Controller, useForm } from 'react-hook-form';
import AutocompEntityNamesList from 'components/Shared/Forms/Fields/AutocompEntityNamesList';
import { CurrencyFormatCustom } from 'components/Shared/Forms/Formatting/CurrencyFormatCustom';
import ContactStatus from 'components/ContactDetailCard/components/AutoCompleteWithAddNew';
import EntityType from 'components/ContactDetailCard/components/FieldContent/EntityType';
import { contactStatusOptions } from 'components/ContactDetailedInfo/helper';
import CampaignNameField from 'components/ContactDetailCard/components/FieldContent/CampaignNameField';
import AssociatedDealField from 'components/ContactDetailCard/components/FieldContent/AssociatedDealField';
import DeleteConfirmationDialogContent from './DeleteConfirmationDialogContent';
import KeyboardTabBlackIcon from 'components/Shared/svgIcons/KeyboardTabBlackIcon';
import AutoCompleteWithAddNew from 'components/Shared/AutoCompleteWithAddNew';
import { Status } from 'components/ContactDetailCard/components/FieldContent';
import { GET_ES_FILTER_LIST } from 'graphQL/useQueryESFilterList';
import { tableGlobalController } from 'hookstate/tableController';
import { calculateStandardNraForUnit } from 'utils/calculatedNraHelper';

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
}));

export default function AddUnitOwnerDialogContent({
	selectedRow,
	setSelectedRow,
	uAcres,
	uUnitPricing,
	uMaxUnitPricing,
	...props
}) {
	const dispatch = useDispatch();
	const workspaceSettings = useSelector(({ app }) => app.workspaceSettings);
	const [stateApp, setStateApp] = useContext(AppContext);
	const { control, reset, setValue, getValues, watch } = useForm();
	const [isNraOverridden, setIsNRAOverridden] = useState(false);
	const [isOfferPriceOverridden, setIsOfferPriceOverridden] = useState(false);
	const [isTargetPriceOverridden, setIsTargetPriceOverridden] = useState(false);
	const [isMaxPriceOverridden, setIsMaxPriceOverridden] = useState(false);
	const [isMaxOfferPriceOverridden, setIsMaxOfferPriceOverridden] = useState(false);
	const [showAddNewContactFields, setShowAddNewContactFields] = useState(false);
	const [statusOptions, setStatusOptions] = useState([]);
	const [nameAutValue, setNameAutValue] = useState({ name: '', _id: null });
	const [contact, setContact] = useState();
	const [anchorEl, setAnchorEl] = useState();
	const [loading, setLoading] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const watchedNra = watch('nra');
	const [newContact, setNewContact] = useState({
		firstName: '',
		middleName: '',
		lastName: '',
		mobilePhone: '',
		homePhone: '',
		primaryEmail: '',
		address1: '',
		address2: '',
		city: '',
		state: '',
		zip: '',
	});

	const [getCampaignPriorityList, { data: priorityList }] = useLazyQuery(GET_ES_FILTER_LIST, {
		fetchPolicy: 'no-cache',
	});

	// Common function o calculate offer price
	const calculateOfferPrice = (value, nra) => {
		return parseFloat((parseFloat(nra || 0) * parseFloat(value || 0)).toFixed(2));
	};

	useEffect(() => {
		getCampaignPriorityList({
			variables: {
				esIndex: 'shapeowners_flat',
				filterKey: 'campaignPriority.keyword',
				size: 50,
			},
		});
	}, [getCampaignPriorityList]);

	const [getFilters, { data: filtersData }] = useLazyQuery(GET_ES_FILTER_LIST, { fetchPolicy: 'no-cache' });

	useEffect(() => {
		getFilters({
			variables: {
				esIndex: 'contacts_flat',
				filterKey: 'status.keyword',
				size: 50,
			},
		});
	}, []);

	useEffect(() => {
		if (selectedRow) {
			const {
				working_interest,
				royalty_interest,
				orri,
				nri,
				nra,
				seller_asking_price,
				competitor_offer_price,
				offer_price,
				uUnitPricingInterest,
				uMaxUnitPricingInterest,
				max_offer_price,
				customLayer,
				name,
				ownerEntity,
				contactStatus,
				status,
				ownerType,
				campaignPriority,
				contact,
				campaignName,
				deals,
				unitTractId,
				tractAcres,
				dataSource,
				net_acres,
			} = selectedRow;
			setNameAutValue({ name, _id: ownerEntity });
			const owner = {
				working_interest: working_interest ? parseFloat(working_interest).toFixed(8) : null,
				royalty_interest: royalty_interest ? parseFloat(royalty_interest).toFixed(8) : null,
				orri: orri ? parseFloat(orri).toFixed(8) : null,
				nri: nri ? parseFloat(nri).toFixed(8) : null,
				nra: nra || null,
				seller_asking_price: seller_asking_price || null,
				competitor_offer_price: competitor_offer_price || null,
				offer_price: parseFloat(parseFloat(offer_price).toFixed(2)) || null,
				uUnitPricingInterest: parseFloat(parseFloat(uUnitPricingInterest).toFixed(2)) || null,
				uMaxUnitPricingInterest: parseFloat(parseFloat(uMaxUnitPricingInterest).toFixed(2)) || null,
				max_offer_price: parseFloat(parseFloat(max_offer_price).toFixed(2)) || null,
				contactStatus: contactStatus || contact.contactStatus,
				status: status || contact.status,
				ownerType,
				campaignPriority,
				customLayer,
				campaignName,
				deals,
				unitTractId,
				tractAcres,
				dataSource,
				net_acres,
			};
			let calculatedNRA = calculateStandardNraForUnit({
				uAcres,
				working_interest,
				royalty_interest,
				orri,
				nri,
				workspaceSettings,
			});
			let calculatedOfferPrice = calculateOfferPrice(uUnitPricing, nra);
			let calculatedMaxOfferPrice = calculateOfferPrice(uMaxUnitPricing, nra);

			// Checking initial overriden values
			if (!isNaN(parseFloat(calculatedNRA)))
				setIsNRAOverridden(parseFloat(calculatedNRA) !== parseFloat(nra) && !isNaN(parseFloat(nra)));

			if (!isNaN(parseFloat(calculatedOfferPrice)))
				setIsOfferPriceOverridden(calculatedOfferPrice !== owner.offer_price && !isNaN(parseFloat(offer_price)));
			if (!isNaN(parseFloat(calculatedMaxOfferPrice)))
				setIsMaxOfferPriceOverridden(
					calculatedMaxOfferPrice !== owner.max_offer_price && !isNaN(parseFloat(max_offer_price))
				);

			if (!isNaN(parseFloat(uUnitPricingInterest)))
				setIsTargetPriceOverridden(
					parseFloat(uUnitPricing) !== parseFloat(uUnitPricingInterest) && !isNaN(parseFloat(uUnitPricingInterest))
				);

			if (!isNaN(parseFloat(uMaxUnitPricingInterest)))
				setIsMaxPriceOverridden(
					parseFloat(uMaxUnitPricing) !== parseFloat(uMaxUnitPricingInterest) &&
						!isNaN(parseFloat(uMaxUnitPricingInterest))
				);

			reset(owner);
		}
	}, [selectedRow]);

	useEffect(() => {
		if (filtersData?.getESFilterList?.hits) {
			const allFiltersData = filtersData.getESFilterList.hits.map(hit => hit.key);
			let filterData = filtersData.getESFilterList.hits.map(hit => hit.key);
			for (let i = 0; i < contactStatusOptions.length; i++) {
				filterData = filterData.filter(d => d !== contactStatusOptions[i].value && d !== contactStatusOptions[i].label);
			}
			for (let i = 0; i < contactStatusOptions.length; i++) {
				if (
					(contactStatusOptions[i].notInclude && allFiltersData.find(d => d === contactStatusOptions[i].value)) ||
					!contactStatusOptions[i].notInclude
				) {
					filterData.push(contactStatusOptions[i].label);
				}
			}
			setStatusOptions(filterData);
		}
	}, [filtersData]);

	// CONTACT

	const [addOwnerToAShape, { data: mutationData }] = useMutation(ADD_OWNER_TOA_SHAPE);

	const [updateShapeOwners, { data: updateData }] = useMutation(UPDATE_SHAPE_OWNERS);

	const [updateContact] = useMutation(UPDATECONTACT);

	useEffect(() => {
		let type = null;
		if (mutationData && mutationData.addOwnerToAShape) {
			type = { name: 'add', success: mutationData.addOwnerToAShape.success };
		} else if (updateData && updateData.updateShapeOwners) {
			type = { name: 'update', success: updateData.updateShapeOwners.success };
		}

		if (type) {
			if (type.success) {
				dispatch(
					showSuccessMessage(
						nameAutValue && nameAutValue.name
							? `${nameAutValue.name} was successfully ${type.name}ed`
							: `The owner was successfully ${type.name}ed`
					)
				);

				handleClickDialogClose();
			} else {
				dispatch(showErrorMessage('Error occurred'));
			}

			setStateApp(state => ({
				...state,
				universalCircularLoaderAct: false,
			}));
			tableGlobalController.refetch();
		}
	}, [mutationData, updateData]);

	useEffect(() => {
		if (nameAutValue) {
			if (nameAutValue.contactStatus) {
				setValue('contactStatus', nameAutValue.contactStatus);
			}
		}
	}, [nameAutValue]);

	useEffect(() => {
		// Will change  values based on NRA
		if (!isOfferPriceOverridden && getValues().nra)
			setValue('offer_price', calculateOfferPrice(uUnitPricing, getValues().nra));
		if (!isMaxOfferPriceOverridden && getValues().nra)
			setValue('max_offer_price', calculateOfferPrice(uMaxUnitPricing, getValues().nra));
	}, [watchedNra]);

	const emptyStates = () => {
		setNameAutValue(null);
		// setSelectedRow(null);
	};

	const handleClickDialogClose = () => {
		props.onClose();
		emptyStates();
	};

	const handleAddUpdate = ownerToAdd => {
		if (ownerToAdd.nra) {
			ownerToAdd.nra = addTrailingZeros(parseFloat(ownerToAdd.nra).toFixed(8));
		}

		Object.entries(ownerToAdd).forEach(([key, value]) => {
			value === '' && delete ownerToAdd[key];
		});

		if (selectedRow) {
			ownerToAdd._id = selectedRow._id;
			updateShapeOwners({
				variables: {
					shapeType: props.shapeType,
					shapeOwners: [
						{
							shapeId: props.shapeId ?? get(selectedRow, 'customLayer._id'),
							relatedObject: ownerToAdd.ownerEntity._id || ownerToAdd.ownerEntity,
							...ownerToAdd,
							createBy: stateApp.user.mongoId,
							lastUpdateBy: stateApp.user.mongoId,
						},
					],
					userId: stateApp.user.mongoId,
				},
				refetchQueries: ['getESPaginatedList', 'getESSimpleSearch', 'getESFilterList', 'getCustomLayer'],
				awaitRefetchQueries: true,
			});
		} else {
			const relatedObject = showAddNewContactFields
				? {
						...ownerToAdd,
						...newContact,
					}
				: ownerToAdd?.ownerEntity._id || ownerToAdd?.ownerEntity;
			addOwnerToAShape({
				variables: {
					shapeType: props.shapeType,
					shapeOwner: {
						newOwner: showAddNewContactFields,
						shapeId: props.shapeId ?? get(selectedRow, 'customLayer._id'),
						relatedObject,
						...ownerToAdd,
						createBy: stateApp.user.mongoId,
						lastUpdateBy: stateApp.user.mongoId,
					},
				},
				refetchQueries: ['getESPaginatedList', 'getESSimpleSearch', 'getESFilterList', 'getCustomLayer'],
				awaitRefetchQueries: true,
			});
		}

		setStateApp(state => ({ ...state, universalCircularLoaderAct: true }));
	};

	const handleClickAdd = e => {
		e.preventDefault();
		if (nameAutValue) {
			const ownerToAdd = { ...getValues() };
			// if (nameAutValue._id === "newEntity") ownerToAdd.name = nameAutValue.name;
			// else ownerToAdd.ownerEntity = nameAutValue._id;

			Object.keys(ownerToAdd).forEach(key => {
				if (['working_interest', 'royalty_interest', 'orri', 'nri', 'nra'].includes(key))
					ownerToAdd[key] = addTrailingZeros(ownerToAdd[key]);
			});
			if (nameAutValue._id && nameAutValue.name) {
				// now that we are using descriptors we ONLY want the contact _id
				ownerToAdd.ownerEntity = nameAutValue._id;
				ownerToAdd.name = nameAutValue.name;
			} else {
				if (showAddNewContactFields) {
					handleAddUpdate(ownerToAdd);
					return;
				}
			}

			if (
				((ownerToAdd.contactStatus || selectedRow?.contactStatus) &&
					selectedRow?.contactStatus !== ownerToAdd.contactStatus) ||
				((ownerToAdd.status || selectedRow?.status) && selectedRow?.status !== ownerToAdd.status) ||
				((ownerToAdd.ownerType || selectedRow?.ownerType) && selectedRow?.ownerType !== ownerToAdd.ownerType) ||
				((ownerToAdd.campaignPriority || selectedRow?.campaignPriority) &&
					selectedRow?.campaignPriority !== ownerToAdd.campaignPriority) ||
				((ownerToAdd.campaignName || selectedRow?.campaignName) &&
					selectedRow?.campaignName !== ownerToAdd.campaignName) ||
				ownerToAdd.campaignName ||
				selectedRow?.campaignName !== ownerToAdd.campaignName
			) {
				updateContact({
					variables: {
						contact: {
							_id: ownerToAdd.ownerEntity._id || ownerToAdd.ownerEntity,
							contactStatus: ownerToAdd.contactStatus,
							status: ownerToAdd.status,
							lastUpdateBy: stateApp.user.mongoId,
							ownerType: ownerToAdd.ownerType,
							campaignPriority: ownerToAdd.campaignPriority,
						},
					},
				});
			}

			if (!ownerToAdd.campaignName || ownerToAdd.campaignName === '') ownerToAdd.campaignName = [];

			handleAddUpdate(ownerToAdd);
		}
	};

	const openConfirmationDialog = () => {
		setDeleteDialogOpen(true);
		handleMenuClose();
	};
	const handleCloseDialog = () => {
		setDeleteDialogOpen(false);
	};
	const handleMenuClick = event => setAnchorEl(event.currentTarget);
	const handleMenuClose = () => setAnchorEl(null);

	const deleteFunc = () => {
		setLoading(true);
		updateShapeOwners({
			variables: {
				shapeType: props.shapeType,
				shapeOwners: { _id: selectedRow?._id, isDeleted: true },
			},
			refetchQueries: ['getESSimpleSearch', 'getCustomLayer'],
			awaitRefetchQueries: true,
		}).finally(() => {
			setLoading(false);
		});
	};
	const classes = useStyles();

	return (
		<div className={classes.move}>
			{deleteDialogOpen && (
				<Dialog
					className={classes.dialog}
					open={deleteDialogOpen ? true : false}
					onClose={handleCloseDialog}
					fullWidth={false}
					maxWidth="sm"
				>
					<DeleteConfirmationDialogContent
						header={`Delete Interest Owner`}
						onClose={handleCloseDialog}
						deleteFunc={deleteFunc}
						m1nSelectedRowsIds={null}
						setM1nSelectedRowsIndexes={() => {}}
					>
						Do you want to delete the selected interest owner?
					</DeleteConfirmationDialogContent>
				</Dialog>
			)}
			<React.Fragment>
				<RightDialog open={true} handleClickDialogClose={props.onClose} width={'450px'}>
					<Grid container display="flex" direction="row" justifyContent="space-between" alignItems="center">
						<Grid item md={10} xs={10}>
							<DialogTitle id="customized-dialog-title" style={{ fontWeight: 'bold' }}>
								{selectedRow ? 'Update' : 'Add'} Unit Ownership
							</DialogTitle>
						</Grid>
						<Grid item md={1} xs={1} style={{ marginLeft: '20px' }}>
							<div style={{ float: 'right', display: 'flex', marginRight: '10px' }}>
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
								<IconButton
									size="small"
									component="span"
									style={{
										background: 'transparent',
										align: 'center',
										float: 'right',
									}}
									onClick={props.onClose}
								>
									<KeyboardTabBlackIcon />
								</IconButton>
							</div>
						</Grid>
					</Grid>
					<DialogContent className={classes.dialogContent}>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<h3 style={{ float: 'left' }}>Name</h3>
								{!selectedRow && (
									<div
										className={showAddNewContactFields ? classes.addContactButtonSelected : classes.addContactButton}
										onClick={() => setShowAddNewContactFields(!showAddNewContactFields)}
									>
										<PersonAddOutlinedIcon className={showAddNewContactFields ? classes.personAddIcon : null} />
										<p>&nbsp;Add new</p>
									</div>
								)}
								<AutocompEntityNamesList
									userId={stateApp.user.mongoId}
									setContact={setContact}
									nameAutValue={nameAutValue}
									setNameAutValue={setNameAutValue}
									disabled={showAddNewContactFields}
									placeholder={'Search existing contact'}
								/>
							</Grid>

							{!showAddNewContactFields && (
								<Grid item xs={12}>
									<h3>Entity Type</h3>
									<Controller
										control={control}
										name="ownerType"
										render={props => (
											<EntityType
												className={classes.maxWidth}
												setDocumentType={value => {
													let val = value.name;
													const data = contactStatusOptions.find(s => s.label === val);
													if (data) {
														val = data.value;
													}
													setValue('ownerType', val);
												}}
												value={contact?.ownerType ?? ''}
											/>
										)}
									/>
								</Grid>
							)}
							{showAddNewContactFields && (
								<>
									<Grid item xs={12}>
										<h3>First Name</h3>
										<TextField
											id="firstName"
											size="small"
											className={classes.maxWidth}
											multiline
											value={newContact.firstName}
											onChange={e => {
												setNewContact({
													...newContact,
													firstName: e.target.value,
												});
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<h3>Middle Name</h3>
										<TextField
											id="middleName"
											size="small"
											className={classes.maxWidth}
											multiline
											value={newContact.middleName}
											onChange={e => {
												setNewContact({
													...newContact,
													middleName: e.target.value,
												});
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<h3>Last Name</h3>
										<TextField
											id="lastName"
											size="small"
											className={classes.maxWidth}
											multiline
											value={newContact.lastName}
											onChange={e => {
												setNewContact({
													...newContact,
													lastName: e.target.value,
												});
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<h3>Entity Type</h3>
										<EntityType
											className={classes.maxWidth}
											setDocumentType={value => {
												let val = value.name;
												const data = contactStatusOptions.find(s => s.label === val);
												if (data) {
													val = data.value;
												}
												setNewContact({
													...newContact,
													ownerType: val,
												});
											}}
											value={newContact.ownerType ?? ''}
										/>
									</Grid>
									<Grid item xs={6}>
										<h3>Home phone</h3>
										<TextField
											id="homePhone"
											size="small"
											className={classes.maxWidth}
											multiline
											value={newContact.homePhone}
											onChange={e => {
												setNewContact({
													...newContact,
													homePhone: e.target.value,
												});
											}}
										/>
									</Grid>
									<Grid item xs={6}>
										<h3>Mobile Phone</h3>
										<TextField
											id="mobilePhone"
											size="small"
											// placeholder="E.g. xxx-xxx-xxxx"
											className={classes.maxWidth}
											multiline
											value={newContact.mobilePhone}
											onChange={e => {
												setNewContact({
													...newContact,
													mobilePhone: e.target.value,
												});
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<h3>Email</h3>
										<TextField
											id="email"
											size="small"
											// placeholder="E.g. jacob@m1neral.com"
											className={classes.maxWidth}
											multiline
											value={newContact.primaryEmail}
											onChange={e => {
												setNewContact({
													...newContact,
													primaryEmail: e.target.value,
												});
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<h3>Address #1</h3>
										<TextField
											id="address1"
											size="small"
											className={classes.maxWidth}
											multiline
											autoComplete="nope"
											value={newContact.address1}
											onChange={e => {
												setNewContact({
													...newContact,
													address1: e.target.value,
												});
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<h3>Address #2</h3>
										<TextField
											id="address2"
											size="small"
											className={classes.maxWidth}
											multiline
											autoComplete="nope"
											value={newContact.address2}
											onChange={e => {
												setNewContact({
													...newContact,
													address2: e.target.value,
												});
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<h3>City</h3>
										<TextField
											id="city"
											size="small"
											className={classes.maxWidth}
											multiline
											value={newContact.city}
											onChange={e => {
												setNewContact({
													...newContact,
													city: e.target.value,
												});
											}}
										/>
									</Grid>
									<Grid item xs={6}>
										<h3>State</h3>
										<TextField
											id="state"
											size="small"
											className={classes.maxWidth}
											multiline
											value={newContact.state}
											onChange={e => {
												setNewContact({
													...newContact,
													state: e.target.value,
												});
											}}
										/>
									</Grid>
									<Grid item xs={6}>
										<h3>Zip Code</h3>
										<TextField
											id="zipCode"
											size="small"
											className={classes.maxWidth}
											multiline
											value={newContact.zip}
											onChange={e => {
												setNewContact({
													...newContact,
													zip: e.target.value,
												});
											}}
										/>
									</Grid>
								</>
							)}

							<Grid item xs={12}>
								<h3>Working Interest</h3>

								<Controller
									control={control}
									name="working_interest"
									render={props => (
										<TextField
											size="small"
											type="number"
											value={props.value}
											inputRef={props.ref}
											onWheel={e => e.target.blur()}
											onChange={e => {
												props.onChange(e.target.value);
												if (!isNraOverridden)
													setValue(
														'nra',
														calculateStandardNraForUnit({
															uAcres,
															working_interest: e.target.value,
															royalty_interest: getValues().royalty_interest,
															orri: getValues().orri,
															nri: getValues().nri,
															workspaceSettings,
														})
													);
											}}
											onBlur={e => {
												const v = props.value || 0;
												props.onChange(parseFloat(v).toFixed(8));
											}}
											fullWidth
											defaultValue=""
										/>
									)}
								/>
							</Grid>
							<Grid item xs={12}>
								<h3>Royalty Interest</h3>
								<Controller
									control={control}
									name="royalty_interest"
									render={props => (
										<TextField
											size="small"
											type="number"
											value={props.value}
											inputRef={props.ref}
											onWheel={e => e.target.blur()}
											onChange={e => {
												props.onChange(e.target.value);
												if (!isNraOverridden)
													setValue(
														'nra',
														calculateStandardNraForUnit({
															uAcres,
															working_interest: getValues().working_interest,
															royalty_interest: e.target.value,
															orri: getValues().orri,
															nri: getValues().nri,
															workspaceSettings,
														})
													);
											}}
											onBlur={e => {
												const v = props.value || 0;
												props.onChange(parseFloat(v).toFixed(8));
											}}
											fullWidth
											defaultValue=""
										/>
									)}
								/>
							</Grid>
							<Grid item xs={12}>
								<h3>Overriding Royalty Interest (ORRI)</h3>
								<Controller
									control={control}
									name="orri"
									render={props => (
										<TextField
											size="small"
											type="number"
											value={props.value}
											inputRef={props.ref}
											onWheel={e => e.target.blur()}
											onChange={e => {
												props.onChange(e.target.value);
												if (!isNraOverridden) {
													setValue(
														'nra',
														calculateStandardNraForUnit({
															uAcres,
															working_interest: getValues().working_interest,
															royalty_interest: getValues().royalty_interest,
															orri: e.target.value,
															nri: getValues().nri,
															workspaceSettings,
														})
													);
												}
											}}
											onBlur={e => {
												const v = props.value || 0;
												props.onChange(parseFloat(v).toFixed(8));
											}}
											fullWidth
											defaultValue=""
										/>
									)}
								/>
							</Grid>
							<Grid item xs={12}>
								<h3>Net Revenue Interest (NRI)</h3>

								<Controller
									control={control}
									name="nri"
									render={props => (
										<TextField
											size="small"
											type="number"
											value={props.value}
											inputRef={props.ref}
											onWheel={e => e.target.blur()}
											onChange={e => {
												props.onChange(e.target.value);
												if (!isNraOverridden) {
													setValue(
														'nra',
														calculateStandardNraForUnit({
															uAcres,
															working_interest: getValues().working_interest,
															royalty_interest: getValues().royalty_interest,
															orri: getValues().orri,
															nri: e.target.value,
															workspaceSettings,
														})
													);
												}
											}}
											onBlur={e => {
												const v = props.value || 0;
												props.onChange(parseFloat(v).toFixed(8));
											}}
											fullWidth
											defaultValue=""
										/>
									)}
								/>
							</Grid>
							<Grid item xs={12}>
								<h3>Net Acres</h3>

								<Controller
									control={control}
									name="net_acres"
									render={props => (
										<TextField
											size="small"
											type="number"
											value={props.value}
											inputRef={props.ref}
											onWheel={e => e.target.blur()}
											onChange={e => props.onChange(e.target.value)}
											fullWidth
											defaultValue=""
										/>
									)}
								/>
							</Grid>
							<Grid item xs={12}>
								<h3>Net Royalty Acres (NRA)</h3>
								<Controller
									control={control}
									name="nra"
									render={params => (
										<TextField
											size="small"
											type="number"
											value={params.value}
											inputRef={params.ref}
											onWheel={e => e.target.blur()}
											onChange={e => {
												const value = addTrailingZeros(e.target.value);

												if (!isNraOverridden) {
													const nra = calculateStandardNraForUnit({
														uAcres,
														working_interest: getValues().working_interest,
														royalty_interest: getValues().royalty_interest,
														orri: getValues().orri,
														nri: getValues().nri,
														workspaceSettings,
													});
													setIsNRAOverridden(parseFloat(value) !== parseFloat(nra));
												}

												params.onChange(e.target.value);
											}}
											className={isOfferPriceOverridden ? `overridden ${classes.baseValueChanged}` : classes.maxWidth}
											data-testid="nra-field"
											InputProps={{
												endAdornment: (
													<InputAdornment position="end">
														{isNraOverridden && (
															<IconButton
																aria-label="toggle royality-acres"
																onClick={() => {
																	setIsNRAOverridden(false);
																	setValue(
																		'nra',
																		calculateStandardNraForUnit({
																			uAcres,
																			working_interest: getValues().working_interest,
																			royalty_interest: getValues().royalty_interest,
																			orri: getValues().orri,
																			nri: getValues().nri,
																			workspaceSettings,
																		})
																	);
																}}
															>
																<AutorenewIcon />
															</IconButton>
														)}
													</InputAdornment>
												),
											}}
											fullWidth
											defaultValue=""
										/>
									)}
								/>
							</Grid>
							<Grid item xs={12}>
								<h3>Unit Tract ID</h3>

								<Controller
									control={control}
									name="unitTractId"
									render={props => (
										<TextField
											size="small"
											type="text"
											value={props.value}
											inputRef={props.ref}
											onWheel={e => e.target.blur()}
											onChange={e => props.onChange(e.target.value)}
											fullWidth
											defaultValue=""
										/>
									)}
								/>
							</Grid>
							<Grid item xs={12}>
								<h3>Unit Tract Acres</h3>

								<Controller
									control={control}
									name="tractAcres"
									render={props => (
										<TextField
											size="small"
											type="number"
											value={props.value}
											inputRef={props.ref}
											onWheel={e => e.target.blur()}
											onChange={e => props.onChange(e.target.value)}
											fullWidth
											defaultValue=""
										/>
									)}
								/>
							</Grid>
							<Grid item xs={12}>
								<h3>Seller Asking Price</h3>

								<Controller
									control={control}
									name="seller_asking_price"
									render={props => (
										<TextField
											size="small"
											value={props.value}
											inputRef={props.ref}
											onWheel={e => e.target.blur()}
											onChange={e => {
												props.onChange(e.target.value);
											}}
											InputProps={{
												inputComponent: CurrencyFormatCustom,
											}}
											fullWidth
											defaultValue=""
										/>
									)}
								/>
							</Grid>

							<Grid item xs={12}>
								<h3>Competitor Offer Price</h3>
								<Controller
									control={control}
									name="competitor_offer_price"
									render={props => (
										<TextField
											size="small"
											value={props.value}
											inputRef={props.ref}
											onWheel={e => e.target.blur()}
											onChange={e => {
												props.onChange(e.target.value);
											}}
											InputProps={{
												inputComponent: CurrencyFormatCustom,
											}}
											fullWidth
											defaultValue=""
										/>
									)}
								/>
							</Grid>

							<Grid item xs={12}>
								<h3>Target Price/NRA</h3>

								<Controller
									control={control}
									name="uUnitPricingInterest"
									render={props => (
										<TextField
											size="small"
											value={props.value}
											inputRef={props.ref}
											onWheel={e => e.target.blur()}
											onChange={e => {
												const value = parseFloat(e.target.value).toFixed(2);
												setIsTargetPriceOverridden(value !== parseFloat(uUnitPricing).toFixed(2));
												setValue('offer_price', calculateOfferPrice(value, getValues().nra));
												props.onChange(value);
											}}
											className={isTargetPriceOverridden ? `overridden ${classes.baseValueChanged}` : classes.maxWidth}
											data-testid="uUnitPricingInterest-field"
											InputProps={{
												inputComponent: CurrencyFormatCustom,
												endAdornment: (
													<InputAdornment position="end">
														{isTargetPriceOverridden && (
															<IconButton
																aria-label="toggle uUnitPricingInterest"
																onClick={() => {
																	setIsTargetPriceOverridden(false);
																	setValue('uUnitPricingInterest', uUnitPricing);
																}}
															>
																<AutorenewIcon />
															</IconButton>
														)}
													</InputAdornment>
												),
											}}
											fullWidth
											defaultValue={uUnitPricing}
										/>
									)}
								/>
							</Grid>
							<Grid item xs={12}>
								<h3>Target Offer Price</h3>

								<Controller
									control={control}
									name="offer_price"
									render={props => (
										<TextField
											size="small"
											value={props.value}
											inputRef={props.ref}
											onWheel={e => e.target.blur()}
											onChange={e => {
												const value = parseFloat(e.target.value).toFixed(2);
												const calculatedOfferPrice = calculateOfferPrice(uUnitPricing, getValues().nra);
												setIsOfferPriceOverridden(parseFloat(value) !== parseFloat(calculatedOfferPrice));
												props.onChange(value);
											}}
											className={isOfferPriceOverridden ? `overridden ${classes.baseValueChanged}` : classes.maxWidth}
											data-testid="target-offer-price-field"
											InputProps={{
												inputComponent: CurrencyFormatCustom,
												endAdornment: (
													<InputAdornment position="end">
														{isOfferPriceOverridden && (
															<IconButton
																aria-label="toggle offer_price"
																onClick={() => {
																	setIsOfferPriceOverridden(false);
																	setValue('offer_price', calculateOfferPrice(uUnitPricing, getValues().nra));
																}}
															>
																<AutorenewIcon />
															</IconButton>
														)}
													</InputAdornment>
												),
											}}
											fullWidth
											defaultValue=""
										/>
									)}
								/>
							</Grid>

							<Grid item xs={12}>
								<h3>Max Price/NRA</h3>

								<Controller
									control={control}
									name="uMaxUnitPricingInterest"
									render={props => (
										<TextField
											size="small"
											value={props.value}
											inputRef={props.ref}
											onWheel={e => e.target.blur()}
											onChange={e => {
												const value = parseFloat(e.target.value).toFixed(2);
												setIsMaxPriceOverridden(value !== parseFloat(uMaxUnitPricing).toFixed(2));
												setValue('max_offer_price', calculateOfferPrice(value, getValues().nra));
												props.onChange(value);
											}}
											className={isMaxPriceOverridden ? `overridden ${classes.baseValueChanged}` : classes.maxWidth}
											data-testid="uMaxUnitPricingInterest-field"
											InputProps={{
												inputComponent: CurrencyFormatCustom,
												endAdornment: (
													<InputAdornment position="end">
														{isMaxPriceOverridden && (
															<IconButton
																aria-label="toggle uMaxUnitPricingInterest"
																onClick={() => {
																	setIsMaxPriceOverridden(false);
																	setValue('uMaxUnitPricingInterest', uMaxUnitPricing);
																}}
															>
																<AutorenewIcon />
															</IconButton>
														)}
													</InputAdornment>
												),
											}}
											fullWidth
											defaultValue={uUnitPricing}
										/>
									)}
								/>
							</Grid>

							<Grid item xs={12}>
								<h3>Max Offer Price</h3>

								<Controller
									control={control}
									name="max_offer_price"
									render={props => (
										<TextField
											size="small"
											value={props.value}
											inputRef={props.ref}
											onWheel={e => e.target.blur()}
											onChange={e => {
												const value = parseFloat(e.target.value).toFixed(2);
												const calculatedOfferPrice = calculateOfferPrice(uMaxUnitPricing, getValues().nra);
												setIsMaxOfferPriceOverridden(parseFloat(value) !== parseFloat(calculatedOfferPrice));
												props.onChange(value);
											}}
											className={
												isMaxOfferPriceOverridden ? `overridden ${classes.baseValueChanged}` : classes.maxWidth
											}
											data-testid="max-offer-price-field"
											InputProps={{
												inputComponent: CurrencyFormatCustom,
												endAdornment: (
													<InputAdornment position="end">
														{isMaxOfferPriceOverridden && (
															<IconButton
																aria-label="toggle max_offer_price"
																onClick={() => {
																	setIsMaxOfferPriceOverridden(false);
																	setValue('max_offer_price', calculateOfferPrice(uMaxUnitPricing, getValues().nra));
																}}
															>
																<AutorenewIcon />
															</IconButton>
														)}
													</InputAdornment>
												),
											}}
											fullWidth
											defaultValue=""
										/>
									)}
								/>
							</Grid>

							<Grid item xs={12}>
								<h3>Contact Status</h3>

								<Controller
									control={control}
									defaultValue={''}
									name="contactStatus"
									render={props => (
										<ContactStatus
											className={classes.maxWidth}
											setValue={value => {
												let val = value.name;
												props.onChange(val);
											}}
											value={props.value ? props.value : ''}
											fieldKey="contactStatus"
										/>
									)}
								/>
							</Grid>
							<Grid item xs={12}>
								<h3>Contact Stage</h3>

								<Controller
									control={control}
									defaultValue={''}
									name="status"
									render={props => (
										<Status
											className={classes.maxWidth}
											options={statusOptions}
											value={props.value}
											setDocumentType={value => {
												let val = value.name;
												const data = contactStatusOptions.find(s => s.label === val);
												if (data) {
													val = data.value;
												}
												props.onChange(val);
											}}
										/>
									)}
								/>
							</Grid>
							<Grid item xs={12}>
								<h3>Campaign Names</h3>

								<Controller
									control={control}
									defaultValue={''}
									name="campaignName"
									render={params => (
										<CampaignNameField
											{...params}
											className={classes.maxWidth}
											onChange={(values, id) => {
												params.onChange(values);
											}}
											fullWidth
											targetLabel="Contact"
											simpleChips
										/>
									)}
								/>
							</Grid>

							<Grid item xs={12}>
								<h3>Campaign Priority</h3>
								<Controller
									control={control}
									name="campaignPriority"
									render={params => (
										<AutoCompleteWithAddNew
											{...params}
											value={get(params, 'value', '')}
											// variant="outlined"
											setValue={value => {
												if (value?._id) params.onChange({ _id: value._id, name: value.name });
												else params.onChange({});
												if (value?._id === 'newEntity') delete value._id;
												setValue('campaignPriority', value?.name);
											}}
											options={get(priorityList, 'getESFilterList.hits', [])?.map(payor => ({
												_id: get(payor, `original.hits.hits.${0}._id`),
												name: payor.key,
											}))}
										/>
									)}
								/>
							</Grid>

							<Grid item xs={12}>
								<h3>Associated Deals</h3>

								<Controller
									control={control}
									name="deals"
									render={params => (
										<AssociatedDealField
											{...params}
											className={classes.maxWidth}
											onChange={(values, id) => {
												params.onChange(values);
											}}
											fullWidth
											targetLabel="Contact"
											simpleChips
										/>
									)}
								/>
							</Grid>
							<Grid item xs={12}>
								<h3>Data Source</h3>

								<Controller
									control={control}
									name="dataSource"
									render={props => (
										<TextField
											size="small"
											type="text"
											value={props.value}
											inputRef={props.ref}
											onWheel={e => e.target.blur()}
											onChange={e => props.onChange(e.target.value)}
											fullWidth
											defaultValue=""
										/>
									)}
								/>
							</Grid>
							<Grid item xs={12}>
								<h3>Tax Year</h3>

								<Controller
									control={control}
									name="taxYear"
									render={props => (
										<TextField
											size="small"
											type="number"
											value={selectedRow?.taxYear}
											inputRef={props.ref}
											disabled
											fullWidth
											defaultValue=""
										/>
									)}
								/>
							</Grid>
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
							className={classes.secondary}
							disabled={
								(!nameAutValue || !nameAutValue.name || nameAutValue.name === '') && !showAddNewContactFields
									? true
									: false
							}
							onClick={handleClickAdd}
							color="secondary"
							style={{ marginBottom: '40px', marginRight: '20px' }}
							data-testid="action-button"
						>
							{selectedRow ? 'Update' : 'Add'}
						</Button>
					</DialogActions>
				</RightDialog>
			</React.Fragment>
		</div>
	);
}
