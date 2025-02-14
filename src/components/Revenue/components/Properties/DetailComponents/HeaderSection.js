import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import { Grid, TextField, Select, MenuItem, IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Clear } from '@material-ui/icons';
import { Autocomplete, createFilterOptions } from '@material-ui/lab';

import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { get, debounce } from 'lodash';
import loadashFilter from 'lodash/filter';
import moment from 'moment';

import ContactPaginatedAutocomplete from 'components/Revenue/components/Common/ContactsPaginatedAutocomplete';
import AutoCompleteWithAddNew from 'components/Shared/AutoCompleteWithAddNew';
import AutoCompleteTypeComponent from 'components/Shared/Forms/Fields/AutoCompleteType';
import ContactCardIcon from 'components/Shared/svgIcons/contact_card';
import AssociatedWellsList from 'components/Shared/Wells/AssociatedWells';

import { UPDATE_PROPERTY } from 'graphQL/useMutationUpdateProperty';
import { CONTACT_ENTITY } from 'graphQL/useQueryContactEntity';
import { GET_ES_FILTER_LIST } from 'graphQL/useQueryESFilterList';
import { GET_AUTOCOMPLETE_PROPERTY_LIST } from 'graphQL/useQueryGetProperty';
import { SHAPE_AUTOCOMPLETE_LIST } from 'graphQL/useQueryShapeAutoCompleteList';

import CountyField from './County';
import StateField from './State';

const useStyles = makeStyles(() => ({
	titleText: {
		textTransform: 'uppercase',
		margin: '5px 16px 10px',
		color: '#5a5a5a',
	},
	fieldsSection: {
		margin: '0px 0px',
		'& .MuiOutlinedInput-root': {
			height: '46px !important',
			borderRadius: '6px !important',
		},
	},
	gridStyle: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	label: {
		fontWeight: 'bold',
		fontSize: '13px',
	},
	wellsSelectField: {
		'& .MuiInputBase-root': {
			borderRadius: '8px',
		},
	},
	formControl: {
		width: '100%',
	},
	dateRoot: {
		color: 'grey',
		'& input': {
			marginLeft: '20px',
		},
	},
	infoSection: {
		maxWidth: '70%',
	},
	associatedWell: {
		border: '2px solid #d5d5d5',
		height: '660px',
		display: 'flex',
		flexDirection: 'column',
		borderRadius: '15px',
		maxWidth: '30%',
		width: '30%',
	},
	adornmentAutocomplete: {
		'& .MuiAutocomplete-endAdornment': {
			right: '60px !important',
			'& .MuiAutocomplete-clearIndicator': {
				display: 'none',
			},
		},
	},
	contactCardIcon: {
		position: 'absolute',
		right: '12px !important',
		marginTop: '4px !important',
		cursor: 'pointer',
	},
	textArea: {
		margin: '0px 0px',
		'& .MuiOutlinedInput-root': {
			height: 'auto !important',
			borderRadius: '6px !important',
		},
	},
	datePicker: {
		'& .MuiIconButton-root': {
			padding: '12px 0px',
		},
		'& .MuiFormControl-marginNormal': {
			margin: '0px',
		},
	},
	textField: {
		margin: '0px',
		'& .MuiOutlinedInput-input': {
			padding: '13px',
		},
	},
	field: {
		'& .MuiAutocomplete-clearIndicator': {
			marginRight: '15px',
		},
		'& .MuiFormControl-marginNormal': {
			margin: '0px',
		},
		'& .MuiFormControl-marginDense': {
			margin: '0px',
		},
	},
}));

export default function HeaderSection(props) {
	const classes = useStyles();
	let history = useHistory();
	const { control, setValue, watch, register, reset } = useForm();
	const { propertyDetails, propertyOwnerContact, setEntityToConvert } = props;
	const [entityType, setEntityType] = useState('');
	const [searchOperator, setSearchOperator] = useState('');
	const [searchPurchaser, setSearchPurchaser] = useState('');

	const [getOperatorList, { data: operatorList }] = useLazyQuery(GET_ES_FILTER_LIST, { fetchPolicy: 'no-cache' });
	const [getPurchaserList, { data: purchaserList }] = useLazyQuery(GET_ES_FILTER_LIST, { fetchPolicy: 'no-cache' });
	const [getContactEntity, { data: contactEntityData }] = useLazyQuery(CONTACT_ENTITY);
	const { data: acquisitionOptions } = useQuery(GET_AUTOCOMPLETE_PROPERTY_LIST, {
		variables: { key: 'acquisitionID' },
	});
	const { data: prospectOptions } = useQuery(SHAPE_AUTOCOMPLETE_LIST, {
		variables: { key: 'prospectID' },
	});
	const { data: ownerOptions } = useQuery(GET_AUTOCOMPLETE_PROPERTY_LIST, {
		variables: { key: 'ownerNumber' },
	});

	const [updateProperty] = useMutation(UPDATE_PROPERTY);

	const updatePropertyData = (key, value) => {
		updateProperty({
			variables: {
				property: {
					_id: propertyDetails._id || props.propertyId,
					[key]: value,
				},
			},
			refetchQueries: ['getProperty'],
			awaitRefetchQueries: true,
		});
	};

	useEffect(() => {
		getOperatorList({
			variables: {
				search: searchOperator ? `${searchOperator}*` : '*',
				filterKey: 'operator.name.keyword',
				esIndex: 'properties_flat',
				size: 50,
			},
		});
	}, [getOperatorList, searchOperator]);

	useEffect(() => {
		getPurchaserList({
			variables: {
				search: searchPurchaser ? `${searchPurchaser}*` : '*',
				filterKey: 'purchaser.name.keyword',
				esIndex: 'properties_flat',
				size: 50,
			},
		});
	}, [getPurchaserList, searchPurchaser]);

	useEffect(() => {
		register('state');
		register('county');
	}, [register]);

	useEffect(() => {
		if (propertyDetails) {
			const data = JSON.parse(JSON.stringify(propertyDetails));
			delete data.owner;
			delete data.operator;
			delete data.purchaser;
			let owner = {};
			// let operator = {};
			if (propertyOwnerContact) {
				owner = propertyOwnerContact?.find(owner => owner.entityId === propertyDetails?.owner?._id);
				// operator = propertyOwnerContact?.find((owner) => owner.entityId === propertyDetails?.operator?._id);
			}
			setSearchOperator(propertyDetails?.operator?.name);
			setSearchPurchaser(propertyDetails?.purchaser?.name);
			reset({
				...data,
				owner: { ...owner, number: data.ownerNumber },
				operator: propertyDetails?.operator?.name,
				purchaser: propertyDetails?.purchaser?.name,
			});
		}
	}, [propertyDetails, propertyOwnerContact]);

	useEffect(() => {
		const entity = get(contactEntityData, 'contactEntity.entity');
		if (entity?._id) {
			updatePropertyData(entityType, entity?._id);
		}
	}, [contactEntityData]);

	const selectedState = watch('state', '');

	const contactEntity = (contactId, entityType) => {
		setEntityType(entityType);
		getContactEntity({
			variables: {
				contactId,
			},
		});
	};

	const checkIfContact = entityId => {
		return !!propertyOwnerContact?.find(contact => contact.entityId === entityId);
	};

	const setEntity = entityDetails => {
		if (entityDetails && !checkIfContact(entityDetails?._id)) {
			setEntityToConvert({ ...entityDetails, isEntity: true });
		}
	};

	const handleUpdate = debounce((key, value) => {
		updatePropertyData(key, value);
	}, 500);

	const getMappedOptions = strArray => strArray?.map(option => ({ name: option, value: option })) || [];

	return (
		<Grid container direction="row" justify="space-between">
			<Grid item className={classes.infoSection}>
				<Grid
					container
					direction="row"
					display="flex"
					justify="flex-start"
					alignItems="center"
					spacing={1}
					className={classes.fieldsSection}
				>
					<Grid item xs={5}>
						<Grid container className={classes.gridStyle}>
							<Grid item xs={3}>
								<div className={classes.label}>M1neral System ID</div>
							</Grid>
							<Grid item xs={8}>
								<Controller
									control={control}
									name="systemId"
									render={({ field }) => (
										<TextField
											{...field}
											className={classes.textField}
											variant="outlined"
											margin="dense"
											type="text"
											fullWidth
											disabled
											InputProps={{
												readOnly: true,
											}}
											value={propertyDetails?._id}
										/>
									)}
								/>
							</Grid>
						</Grid>
					</Grid>

					<Grid item xs={7}>
						<Grid container className={classes.gridStyle}>
							<Grid item xs={2}>
								<div className={classes.label}>Property Name</div>
							</Grid>
							<Grid item xs={9}>
								<Controller
									control={control}
									name="name"
									render={({ field }) => (
										<TextField
											{...field}
											className={classes.textField}
											variant="outlined"
											margin="dense"
											type="text"
											fullWidth
											onChange={e => {
												field.onChange(e.target.value);
											}}
											onBlur={e => updatePropertyData('name', e.target.value)}
										/>
									)}
								/>
							</Grid>
						</Grid>
					</Grid>

					<Grid item xs={5}>
						<Grid container className={classes.gridStyle}>
							<Grid item xs={3}>
								<div className={classes.label}>Operator Prop #</div>
							</Grid>
							<Grid item xs={8}>
								<Controller
									control={control}
									name="number"
									render={({ field }) => (
										<TextField
											{...field}
											className={classes.textField}
											variant="outlined"
											margin="dense"
											type="text"
											fullWidth
											onChange={e => {
												field.onChange(e.target.value);
											}}
											onBlur={e => updatePropertyData('number', e.target.value)}
										/>
									)}
								/>
							</Grid>
						</Grid>
					</Grid>

					<Grid item xs={7}>
						<Grid container className={classes.gridStyle}>
							<Grid item xs={2}>
								<div className={classes.label}>Operator</div>
							</Grid>
							<Grid item xs={9}>
								<Controller
									control={control}
									name="operator"
									render={({ field }) => (
										<AutoCompleteWithAddNew
											value={searchOperator}
											variant="outlined"
											onSearch={value => {
												setSearchOperator(value);
											}}
											setValue={value => {
												handleUpdate('operator', { name: value?.name });
												field.onChange(value);
											}}
											options={get(operatorList, 'getESFilterList.hits', [])?.map(campaign => ({
												_id: campaign.key,
												name: campaign.key,
											}))}
										/>
									)}
								/>
							</Grid>
						</Grid>
					</Grid>

					<Grid item xs={5}>
						<Grid container className={classes.gridStyle}>
							<Grid item xs={3}>
								<div className={classes.label}>Payor Prop #</div>
							</Grid>
							<Grid item xs={8}>
								<Controller
									control={control}
									name="purchaserNumber"
									render={({ field }) => (
										<TextField
											{...field}
											className={classes.textField}
											variant="outlined"
											margin="dense"
											type="text"
											fullWidth
											onChange={e => {
												field.onChange(e.target.value);
											}}
											onBlur={e => updatePropertyData('purchaserNumber', e.target.value)}
										/>
									)}
								/>
							</Grid>
						</Grid>
					</Grid>

					<Grid item xs={7}>
						<Grid container className={classes.gridStyle}>
							<Grid item xs={2}>
								<div className={classes.label}>Payor</div>
							</Grid>
							<Grid item xs={9}>
								<Controller
									control={control}
									name="purchaser"
									render={({ field }) => (
										<AutoCompleteWithAddNew
											value={searchPurchaser}
											variant="outlined"
											onSearch={value => {
												setSearchPurchaser(value);
											}}
											setValue={value => {
												handleUpdate('purchaser', { name: value?.name });
												field.onChange(value);
											}}
											options={get(purchaserList, 'getESFilterList.hits', [])?.map(campaign => ({
												_id: campaign.key,
												name: campaign.key,
											}))}
										/>
									)}
								/>
							</Grid>
						</Grid>
					</Grid>

					<Grid item xs={5}>
						<Grid container className={classes.gridStyle}>
							<Grid item xs={3}>
								<div className={classes.label}>Accounting Ref ID</div>
							</Grid>
							<Grid item xs={8}>
								<Controller
									control={control}
									name="internalID"
									render={({ field }) => (
										<TextField
											{...field}
											className={classes.textField}
											variant="outlined"
											margin="dense"
											placeholder=""
											fullWidth
											onChange={e => {
												field.onChange(e.target.value);
											}}
											onBlur={e => updatePropertyData('internalID', e.target.value)}
										/>
									)}
								/>
							</Grid>
						</Grid>
					</Grid>

					<Grid item xs={7}>
						<Grid container className={classes.gridStyle}>
							<Grid item xs={2}>
								<div className={classes.label}>Payor Property Description</div>
							</Grid>
							<Grid item xs={9}>
								<Controller
									control={control}
									name="description"
									render={({ field }) => (
										<TextField
											{...field}
											className={classes.textField}
											variant="outlined"
											margin="dense"
											type="text"
											fullWidth
											onChange={e => {
												field.onChange(e.target.value);
											}}
											onBlur={e => updatePropertyData('description', e.target.value)}
										/>
									)}
								/>
							</Grid>
						</Grid>
					</Grid>

					<Grid item xs={5}>
						<Grid container className={classes.gridStyle}>
							<Grid item xs={3}>
								<div className={classes.label}>Owner #</div>
							</Grid>
							<Grid item xs={8}>
								<Controller
									control={control}
									name="ownerNumber"
									render={({ field }) => (
										<Autocomplete
											className={classes.field}
											value={field.value ? { _id: field.value, name: field.value } : null}
											disableListWrap
											onBlur={e => updatePropertyData('ownerNumber', e.target.value)}
											options={getMappedOptions(ownerOptions?.getAutoCompletePropertyList)}
											getOptionLabel={option => {
												// Value selected with enter, right from the input
												if (typeof option === 'string') {
													return option;
												}
												// Add "xxx" option created dynamically
												if (option.inputValue) {
													return option.name;
												}

												if (option?.name) {
													return option.name;
												} else {
													return '';
												}
											}}
											getOptionSelected={(option, value) => {
												return option?._id === value?._id;
											}}
											renderOption={option => {
												if (option.isNew) {
													return (
														<Typography style={{ color: 'midnightblue' }}>Add &apos;{option.name}&apos;</Typography>
													);
												}

												return (
													<Grid container spacing={0}>
														<Grid container item xs={12} alignItems="center">
															<Grid item xs>
																<span style={{ fontWeight: 400 }}>{option.name}</span>
															</Grid>
														</Grid>
													</Grid>
												);
											}}
											filterOptions={(options, params) => {
												const inputValue = params.inputValue;
												const filtered = createFilterOptions()(options, {
													...params,
													inputValue,
												});
												const isExist = loadashFilter(filtered, filter => {
													return filter._id === inputValue;
												});
												// Suggest the creation of a new value
												if (inputValue !== '' && (!isExist || isExist.length === 0)) {
													filtered.unshift({
														value: inputValue,
														name: inputValue,
														isNew: true,
													});
												}
												return filtered;
											}}
											onChange={(event, newValue) => {
												setValue('ownerNumber', newValue?.value || '');
											}}
											renderInput={props => (
												<TextField
													variant={'outlined'}
													margin="dense"
													{...props}
													InputProps={{
														...props.InputProps,
													}}
													fullWidth
													size="small"
												/>
											)}
										/>
									)}
								/>
							</Grid>
						</Grid>
					</Grid>

					<Grid item xs={7}>
						<Grid container className={classes.gridStyle}>
							<Grid item xs={2}>
								<div className={classes.label}>Owner Name</div>
							</Grid>
							<Grid item xs={9}>
								<Controller
									control={control}
									name="owner"
									render={({ field }) => (
										<ContactPaginatedAutocomplete
											nameAutValue={field.value ? field.value : { _id: '', name: '' }}
											className={classes.field}
											setNameAutValue={value => {
												if (value) {
													contactEntity(value?._id, 'owner');
												} else {
													handleUpdate('owner', null);
												}
											}}
											renderInput={params2 => (
												<TextField
													{...params2}
													margin="dense"
													variant="outlined"
													InputLabelProps={{
														...params2.InputLabelProps,
														shrink: true,
													}}
													InputProps={{
														...params2.InputProps,
														endAdornment: (
															<React.Fragment>
																{params2.InputProps.endAdornment}
																<div
																	className={classes.contactCardIcon}
																	onClick={e => {
																		e.stopPropagation();
																		if (field?.value?._id) {
																			history.push(`/contact/details/${field?.value?._id}`);
																			window.setStateApp(stateApp => ({
																				...stateApp,
																				selectedContact: `${field?.value?._id}`,
																			}));
																		}
																		setEntity(propertyDetails?.owner);
																	}}
																>
																	<ContactCardIcon fill={!propertyDetails?.owner?._id ? 'darkgrey' : undefined} />
																</div>
															</React.Fragment>
														),
													}}
												/>
											)}
										/>
									)}
								/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={5}>
						<Grid container className={classes.gridStyle}>
							<Grid item xs={3}>
								<div className={classes.label}>DO Date</div>
							</Grid>
							<Grid item xs={8} className={classes.datePicker}>
								<Controller
									control={control}
									name="documentDate"
									render={({ field }) => (
										<TextField
											autoOk
											type="date"
											variant="outlined"
											margin="normal"
											fullWidth
											value={moment(field?.value || '').format('yyyy-MM-DD')}
											onChange={e => {
												field.onChange(moment(e.target.value).toISOString());
											}}
											onBlur={e => {
												updatePropertyData('documentDate', moment(e.target.value).toISOString());
											}}
											InputLabelProps={{
												shrink: true,
											}}
											disableToolbar
											KeyboardButtonProps={{ 'aria-label': 'change date' }}
											format="MM/DD/YYYY"
											PopoverProps={{ disablePortal: false }}
											InputProps={{
												endAdornment: (
													<IconButton onClick={() => updatePropertyData('documentDate', null)}>
														<Clear style={{ height: 22, width: 22 }} />
													</IconButton>
												),
												classes: {
													root: classes.dateRoot,
												},
											}}
										/>
									)}
								/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={7}>
						<Grid container className={classes.gridStyle}>
							<Grid item xs={2}>
								<div className={classes.label}>DO Status</div>
							</Grid>
							<Grid item xs={9}>
								<Controller
									control={control}
									name="divOrderStatus"
									render={({ field }) => (
										<Select
											{...field}
											id="divOrderStatus-simple-select-outlined-label"
											variant="outlined"
											value={field.value ? field.value : ''}
											fullWidth
											onChange={e => {
												field.onChange(e.target.value);
												updatePropertyData('divOrderStatus', e.target.value);
											}}
										>
											<MenuItem value="Received">Received</MenuItem>
											<MenuItem value="Not Received">Not Received</MenuItem>
										</Select>
									)}
								/>
							</Grid>
						</Grid>
					</Grid>

					<Grid item xs={5}>
						<Grid container className={classes.gridStyle}>
							<Grid item xs={3}>
								<div className={classes.label}>State</div>
							</Grid>
							<Grid item xs={8}>
								<Controller
									control={control}
									name="state"
									render={({ field }) => (
										<StateField
											value={field.value}
											onStateChange={state => {
												updatePropertyData('state', state.acronym);
												setValue('state', state.acronym);
												updatePropertyData('county', '');
												setValue('county', '');
											}}
										/>
									)}
								/>
							</Grid>
						</Grid>
					</Grid>

					<Grid item xs={7}>
						<Grid container className={classes.gridStyle}>
							<Grid item xs={2}>
								<div className={classes.label}>County</div>
							</Grid>
							<Grid item xs={9}>
								<Controller
									control={control}
									name="county"
									render={({ field }) => (
										<CountyField
											value={field.value}
											state={selectedState}
											onCountyChange={selectedCounty => {
												const county = selectedCounty?.county ?? '';
												updatePropertyData('county', county);
												setValue('county', county);
											}}
										/>
									)}
								/>
							</Grid>
						</Grid>
					</Grid>

					<Grid item xs={5}>
						<Grid container className={classes.gridStyle}>
							<Grid item xs={3}>
								<div className={classes.label}>Pay Status</div>
							</Grid>
							<Grid item xs={8}>
								<Controller
									control={control}
									name="status"
									render={({ field }) => {
										// Normalize the value to match the case and format of the MenuItem values
										const normalizeValue = value => {
											if (value) {
												const formattedValue = value.replace(/\s+/g, '').toLowerCase();
												if (formattedValue === 'inpay') {
													return 'InPay';
												}
												if (formattedValue === 'notinpay') {
													return 'NotInPay';
												}
											}
											return '';
										};
										return (
											<Select
												{...field}
												id="status-simple-select-outlined-label"
												variant="outlined"
												value={field.value ? normalizeValue(field.value) : ''}
												fullWidth
												onChange={e => {
													updatePropertyData('status', e.target.value);
												}}
											>
												<MenuItem value="InPay">In Pay</MenuItem>
												<MenuItem value="NotInPay">Not in Pay</MenuItem>
											</Select>
										);
									}}
								/>
							</Grid>
						</Grid>
					</Grid>

					<Grid item xs={7}>
						<Grid container className={classes.gridStyle}>
							<Grid item xs={2}>
								<div className={classes.label}>Company ID</div>
							</Grid>
							<Grid item xs={9}>
								<Controller
									control={control}
									name="internalCompany"
									render={({ field }) => {
										return (
											<AutoCompleteTypeComponent
												{...field}
												autoFocus={false}
												shapeType={'Unit'}
												typeKey={'internalCompany'}
												variant="outlined"
												onChange={(e, value) => {
													field.onChange(value?.name || '');
												}}
												onBlur={e => {
													updatePropertyData('internalCompany', e.target.value || '');
												}}
											/>
										);
									}}
								/>
							</Grid>
						</Grid>
					</Grid>

					<Grid item xs={5}>
						<Grid container className={classes.gridStyle}>
							<Grid item xs={3}>
								<div className={classes.label}>Prospect ID</div>
							</Grid>
							<Grid item xs={8}>
								<Controller
									control={control}
									name="prospectID"
									render={({ field }) => (
										<Autocomplete
											className={classes.field}
											value={field.value ? { _id: field.value, name: field.value } : null}
											disableListWrap
											onBlur={e => updatePropertyData('prospectID', e.target.value)}
											options={getMappedOptions(prospectOptions?.shapeAutoCompleteList)}
											getOptionLabel={option => {
												// Value selected with enter, right from the input
												if (typeof option === 'string') {
													return option;
												}
												// Add "xxx" option created dynamically
												if (option.inputValue) {
													return option.name;
												}

												if (option?.name) {
													return option.name;
												} else {
													return '';
												}
											}}
											getOptionSelected={(option, value) => {
												return option?._id === value?._id;
											}}
											renderOption={option => {
												if (option.isNew) {
													return (
														<Typography style={{ color: 'midnightblue' }}>Add &apos;{option.name}&apos;</Typography>
													);
												}

												return (
													<Grid container spacing={0}>
														<Grid container item xs={12} alignItems="center">
															<Grid item xs>
																<span style={{ fontWeight: 400 }}>{option.name}</span>
															</Grid>
														</Grid>
													</Grid>
												);
											}}
											filterOptions={(options, params) => {
												const inputValue = params.inputValue;
												const filtered = createFilterOptions()(options, {
													...params,
													inputValue,
												});
												const isExist = loadashFilter(filtered, filter => {
													return filter._id === inputValue;
												});
												// Suggest the creation of a new value
												if (inputValue !== '' && (!isExist || isExist.length === 0)) {
													filtered.unshift({
														value: inputValue,
														name: inputValue,
														isNew: true,
													});
												}
												return filtered;
											}}
											onChange={(event, newValue) => {
												setValue('prospectID', newValue?.value || '');
											}}
											renderInput={props => (
												<TextField
													variant={'outlined'}
													margin="dense"
													{...props}
													InputProps={{
														...props.InputProps,
													}}
													fullWidth
													size="small"
												/>
											)}
										/>
									)}
								/>
							</Grid>
						</Grid>
					</Grid>

					<Grid item xs={7}>
						<Grid container className={classes.gridStyle}>
							<Grid item xs={2}>
								<div className={classes.label}>Acquisition ID</div>
							</Grid>
							<Grid item xs={9}>
								<Controller
									control={control}
									name="acquisitionID"
									render={({ field }) => (
										<Autocomplete
											className={classes.field}
											value={field.value ? { _id: field.value, name: field.value } : null}
											disableListWrap
											onBlur={e => updatePropertyData('acquisitionID', e.target.value)}
											options={getMappedOptions(acquisitionOptions?.getAutoCompletePropertyList)}
											getOptionLabel={option => {
												// Value selected with enter, right from the input
												if (typeof option === 'string') {
													return option;
												}
												// Add "xxx" option created dynamically
												if (option.inputValue) {
													return option.name;
												}

												if (option?.name) {
													return option.name;
												} else {
													return '';
												}
											}}
											getOptionSelected={(option, value) => {
												return option?._id === value?._id;
											}}
											renderOption={option => {
												if (option.isNew) {
													return (
														<Typography style={{ color: 'midnightblue' }}>Add &apos;{option.name}&apos;</Typography>
													);
												}

												return (
													<Grid container spacing={0}>
														<Grid container item xs={12} alignItems="center">
															<Grid item xs>
																<span style={{ fontWeight: 400 }}>{option.name}</span>
															</Grid>
														</Grid>
													</Grid>
												);
											}}
											filterOptions={(options, params) => {
												const inputValue = params.inputValue;
												const filtered = createFilterOptions()(options, {
													...params,
													inputValue,
												});
												const isExist = loadashFilter(filtered, filter => {
													return filter._id === inputValue;
												});
												// Suggest the creation of a new value
												if (inputValue !== '' && (!isExist || isExist.length === 0)) {
													filtered.unshift({
														value: inputValue,
														name: inputValue,
														isNew: true,
													});
												}
												return filtered;
											}}
											onChange={(event, newValue) => {
												setValue('acquisitionID', newValue?.value || '');
											}}
											renderInput={props => (
												<TextField
													variant={'outlined'}
													margin="dense"
													{...props}
													InputProps={{
														...props.InputProps,
													}}
													fullWidth
													size="small"
												/>
											)}
										/>
									)}
								/>
							</Grid>
						</Grid>
					</Grid>

					{/* Field for approval status */}
					<Grid item xs={5}>
						<Grid container className={classes.gridStyle}>
							<Grid item xs={3}>
								<div className={classes.label}>Approval Status</div>
							</Grid>
							<Grid item xs={8}>
								<Controller
									control={control}
									name="approvalStatus"
									render={({ field }) => (
										<TextField
											{...field}
											className={classes.textField}
											variant="outlined"
											margin="dense"
											type="text"
											fullWidth
											onChange={e => {
												field.onChange(e.target.value);
											}}
											onBlur={e => updatePropertyData('approvalStatus', e.target.value)}
										/>
									)}
								/>
							</Grid>
						</Grid>
					</Grid>

					<Grid item xs={12}>
						<Grid container className={`${classes.gridStyle} ${classes.textArea}`}>
							<Grid item style={{ flexBasis: '10.3%' }}>
								<div className={classes.label}>Legal Description</div>
							</Grid>
							<Grid item style={{ flexBasis: '84.8%' }}>
								<Controller
									control={control}
									name="legalDescription"
									render={({ field }) => (
										<TextField
											{...field}
											margin="dense"
											type="text"
											value={field.value}
											variant="outlined"
											fullWidth
											multiline
											rows={5}
											onBlur={() => updatePropertyData('legalDescription', field.value)}
										/>
									)}
								/>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<Grid item className={classes.associatedWell}>
				<AssociatedWellsList
					title="Associated Wells"
					relatedObject={props.propertyId}
					relatedObjectType="Property"
					details={propertyDetails}
				/>
			</Grid>
		</Grid>
	);
}

HeaderSection.defaultProps = {
	propertyDetails: {},
};
