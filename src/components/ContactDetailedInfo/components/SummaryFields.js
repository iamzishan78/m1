import React, { useEffect, useState, Fragment, useRef, useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { Grid, TextField, InputAdornment, CircularProgress, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { Autorenew as AutorenewIcon } from '@material-ui/icons';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';

import AddIcCallIcon from '@mui/icons-material/AddIcCall';

import { useMutation } from '@apollo/client';
import { get, set, isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import AutoCompleteWithAddNew from 'components/ContactDetailCard/components/AutoCompleteWithAddNew';
import { SUMMARY_FIELDS, featureFlagChanges, contactStatusOptions } from 'components/ContactDetailedInfo/helper';
import { FEATURES } from 'components/Shared/FeatureFlag/common';
import { CurrencyFormatCustom } from 'components/Shared/Forms/Formatting/CurrencyFormatCustom';
import { NumberFormatComma } from 'components/Shared/Forms/Formatting/NumberFormatComma';
import TextSmsIcon from 'components/Shared/svgIcons/textsms';
import VoiceMailIcon from 'components/Shared/svgIcons/voicemail';
import vf_number from 'components/Shared/valueformatters/vf_number';

import { UPDATECONTACT } from 'graphQL/useMutationUpdateContact';
import { showErrorMessage } from 'actions';
import { AppContext } from 'AppContext';
import { phonenumber } from 'components/Shared/FormsFieldsData/RightDialogsSchema/ContactGrid/contact_form_schema';
import DailpadIcon from 'components/Shared/components/svgIcons/DailpadIcon';
import { globalStateController } from 'stateManagement/globalStateController';

const useStyles = makeStyles(() => ({
	container: {
		height: '100%',
		padding: '10px 30px 15px 5px',
	},
	gridStyle: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	fieldLabel: {
		fontWeight: 'bold',
		fontSize: '15px',
	},
	field: {
		'& .MuiAutocomplete-clearIndicator': {
			marginRight: '10px',
		},
		'& .MuiFormControl-marginNormal': {
			margin: '0px',
		},
		'& .MuiFormControl-marginDense': {
			margin: '0px',
		},
		'& .MuiInputBase-root': {
			borderRadius: '7px',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',

			// Show the dialpad icon by default
			'& #dialpad-icon': {
				visibility: 'visible',
				opacity: 1,
				transition: 'visibility 0.3s, opacity 0.3s ease-in-out',
			},
			// Hide the quick actions
			'& #voicemail-icon, & #textsms-icon, & #call-icon, & #mail-icon': {
				visibility: 'hidden',
				opacity: 0,
				transition: 'visibility 0.3s, opacity 0.3s ease-in-out',
			},
			// On hover: Hide dialpad icon completely and show other quick action icons
			'&:hover #dialpad-icon': {
				display: 'none', // Completely removes it from layout
			},
			// Show the quick actions on hover
			'&:hover #voicemail-icon, &:hover #textsms-icon, &:hover #call-icon, &:hover #mail-icon': {
				visibility: 'visible',
				opacity: 1,
			},
		},
	},
	emailAdornment: {
		cursor: 'pointer',
		padding: '0px', // Remove extra padding
		margin: '0 2px', // Adjust spacing between icons
	},
	baseValueChanged: {
		width: '100%',
		'& .MuiInputBase-input': {
			color: 'dodgerblue',
			fontWeight: 'bold',
		},
	},
}));

export default function SummaryFields({ contactData, handleQuickActionActivity }) {
	const classes = useStyles();
	const { control, reset } = useForm();
	const [activeLoadingField, setLoading] = useState();
	const [isFormSet, setFormState] = useState(false);
	const [stateApp] = useContext(AppContext);
	const dispatch = useDispatch();

	const { user } = useSelector(state => state.app);

	const globalState = globalStateController.useState(['dialpadContact'], 'globalStateValues');
	const { basicInfo: basicPhoneKeys = [] } = globalState?.globalStateValues?.dialpadContact?.phoneKeys ?? {}; // Default to an empty object
	const { basicInfo: basicEmailKeys = [] } = globalState?.globalStateValues?.dialpadContact?.emailKeys ?? {}; // Default to an empty object

	const [updateContact] = useMutation(UPDATECONTACT, {
		onCompleted: data => {
			if (data?.updateContact && !data.updateContact?.success) {
				dispatch(showErrorMessage(data?.updateContact?.message));
			}
		},
	});

	const showGenericPhones = React.useMemo(() => {
		return user.features?.find(f => f.name === 'showGenericPhones');
	}, [user]);
	const dialpadFeature = React.useMemo(() => {
		return user?.features?.find(feature => feature.name === FEATURES.DIALPAD_INTEGRATION);
	}, [user]);

	const [contactInterest, setContactInterest] = useState();

	const getCommaValue = value => {
		if (value && !value.includes('.')) {
			return vf_number(Number(value.replace(/,/g, '')));
		} else {
			return value;
		}
	};

	useEffect(() => {
		if (!isEmpty(contactData)) {
			let _contact = { ...contactData };
			if (get(_contact, 'contactInterests.offerPriceSum')) {
				_contact = {
					..._contact,
					contactInterests: {
						nraSum: getCommaValue(_contact.contactInterests.nraSum),
						offerPriceSum: getCommaValue(_contact.contactInterests.offerPriceSum),
						maxOfferPriceSum: getCommaValue(_contact.contactInterests.maxOfferPriceSum),
						currentOfferPriceSum: getCommaValue(_contact.contactInterests.currentOfferPriceSum),
						closedPriceSum: getCommaValue(_contact.contactInterests.closedPriceSum), // Add thousand comma seprator to closedPriceSum
					},
				};
			}
			reset(_contact);
			setFormState(true);
		}
	}, [contactData, reset, isFormSet]);

	const updateFieldData = (key, value) => {
		if (contactData[key] === value) {
			return;
		}

		let contact = { _id: contactData._id, lastUpdateBy: user._id };
		const _key = key.replace('evaluatedContactInterests', 'contactInterests');
		set(contact, _key, value);
		if (contact.contactInterests) {
			contact = {
				...contact,
				contactInterests: {
					...contactData.contactInterests,
					...contactInterest,
					...contact.contactInterests,
				},
			};

			setContactInterest(contact.contactInterests);
		}
		setLoading(_key);
		updateContact({
			variables: {
				contact,
				ignoreResponse: true,
				isDialpadEnabled: stateApp.user?.features?.some(feature => feature.name === FEATURES.DIALPAD_INTEGRATION),
			},
			refetchQueries: ['getContact', 'getDailpadContact'],
			awaitRefetchQueries: false,
		})
			.then(() => {
				setLoading(null);
			})
			.catch(() => {
				setLoading(null);
			});
	};

	const isChanged = (key, value) => {
		const _value = value ? (typeof value === 'string' ? Number(value.replace(/,/g, '')) : value) : 0;
		if (key.includes('nraSum')) {
			return get(contactData, 'evaluatedContactInterests.nraSum')?.toFixed(2) !== _value?.toFixed(2);
		} else if (key.includes('offerPriceSum')) {
			return get(contactData, 'evaluatedContactInterests.offerPriceSum')?.toFixed(2) !== _value?.toFixed(2);
		} else if (key.includes('maxOfferPriceSum')) {
			return get(contactData, 'evaluatedContactInterests.maxOfferPriceSum')?.toFixed(2) !== _value?.toFixed(2);
		} else if (key.includes('closedPriceSum')) {
			return get(contactData, 'evaluatedContactInterests.closedPriceSum')?.toFixed(2) !== _value?.toFixed(2); // allow user to override closedPriceSum value
		}
		return false;
	};

	return (
		<Grid
			container
			alignItems="center"
			justify="space-between"
			display="flex"
			direction="column"
			className={classes.container}
		>
			{SUMMARY_FIELDS(contactData).map((field, key) => (
				<Grid
					item
					key={field.key}
					style={{ position: 'relative', width: '100%', marginRight: '30px', maxWidth: '44%', flexBasis: '7%' }}
				>
					<Grid container className={classes.gridStyle}>
						<Grid item xs={4} style={{ display: 'flex', textAlign: 'left' }}>
							<div id={field.label} className={classes.fieldLabel}>
								{featureFlagChanges(showGenericPhones, field.label)}
							</div>
						</Grid>
						<Grid item xs={8}>
							<Controller
								control={control}
								name={field.key}
								render={params => {
									const isValueOveridden = isChanged(field.key, params.value);

									const initialized = useRef(false);

									useEffect(() => {
										if (initialized.current) {
											return;
										}

										if (
											field.key.includes('offerPriceSum') ||
											field.key.includes('nraSum') ||
											field.key.includes('maxOfferPriceSum') ||
											field.key.includes('currentOfferPriceSum') ||
											field.key.includes('closedPriceSum')
										) {
											// allow user to override closedPrimeSum
											let value = field.value ?? params.value;
											if (value) {
												initialized.current = true;
												if (value.toString().includes(',')) {
													value = parseFloat(value.toString().replace(/[^\d.-]/g, ''));
												}
												params.onChange(parseFloat(value).toFixed(2));
											}
										} else {
											initialized.current = true;
										}
									}, [field.value, params.value]);

									return (
										<Fragment>
											{field.type !== 'autocomplete' ? (
												<TextField
													{...params}
													id={`field-${key}`}
													variant="outlined"
													margin="dense"
													type="text"
													fullWidth
													InputLabelProps={{
														shrink: true,
													}}
													onBlur={event => {
														let currValue = event.target.value;

														if (field.key.includes('offerPriceSum') || field.key.includes('nraSum')) {
															// params.onChange(parseFloat(event.target.value).toFixed(2));
														}

														if (
															field.key.includes('offerPriceSum') ||
															field.key.includes('nraSum') ||
															field.key.includes('maxOfferPriceSum') ||
															field.key.includes('currentOfferPriceSum') ||
															field.key.includes('closedPriceSum')
														) {
															currValue = parseFloat(currValue.replace(/[^\d.-]/g, ''));
														}

														const prevValue = get(contactData, field.key) || '';

														if (currValue !== prevValue) updateFieldData(field.key, currValue);
													}}
													onChange={({ target: { value } }) => {
														let currValue = value;
														if (field.isPhoneNumber) {
															currValue = !dialpadFeature || phonenumber(value) ? value : '';
														}
														params.onChange(currValue);
													}}
													onKeyUp={e => {
														if (e.key === 'Enter') {
															e.target.blur();
														}
													}}
													disabled={field.disabled}
													className={`${classes.field} ${isValueOveridden ? classes.baseValueChanged : null}`}
													value={field.value ?? params.value}
													// If field type = "email", show mail icon adornment
													// If field info is updating, show loading as adornment
													// If field is one of 'homePhone', 'mobilePhone', 'AltPhone', show phone icon adornment
													// else show nothing
													InputProps={{
														inputComponent:
															field.type === 'currency' || field.type === 'currencySimple'
																? CurrencyFormatCustom
																: field.key.includes('nraSum')
																	? NumberFormatComma
																	: undefined,
														endAdornment:
															field.type === 'email' && contactData[field.key] ? (
																<>
																	<InputAdornment position="end">
																		{/* Email quick actions icons */}
																		<Tooltip title={'Email'} placement="top">
																			<IconButton
																				id="mail-icon"
																				href={`mailto: ${contactData.primaryEmail}`}
																				className={classes.emailAdornment}
																			>
																				<EmailOutlinedIcon htmlColor="#757575" />
																			</IconButton>
																		</Tooltip>
																	</InputAdornment>

																	{basicEmailKeys.includes(field.key) && (
																		<InputAdornment id="dialpad-icon" position="end">
																			<DailpadIcon htmlColor="#757575" />
																		</InputAdornment>
																	)}
																</>
															) : field.isPhoneNumber && contactData[field.key] ? (
																<>
																	{/* Phone quick actions icons */}
																	<InputAdornment position="end">
																		<Tooltip title={'Voice Mail'} placement="top">
																			<IconButton
																				id="voicemail-icon"
																				className={classes.emailAdornment}
																				onClick={() =>
																					handleQuickActionActivity({
																						phoneNumber: contactData[field.key],
																						type: 'call',
																					})
																				}
																			>
																				<VoiceMailIcon htmlColor="#757575" />
																			</IconButton>
																		</Tooltip>
																	</InputAdornment>

																	<InputAdornment position="end">
																		<Tooltip title={'Text SMS'} placement="top">
																			<IconButton
																				id="textsms-icon"
																				className={classes.emailAdornment}
																				onClick={() =>
																					handleQuickActionActivity({
																						phoneNumber: contactData[field.key],
																						type: 'text_message',
																					})
																				}
																			>
																				<TextSmsIcon htmlColor="#757575" />
																			</IconButton>
																		</Tooltip>
																	</InputAdornment>

																	{basicPhoneKeys.includes(field.key) && (
																		<>
																			<InputAdornment position="end">
																				<Tooltip title={'Call'} placement="top">
																					<IconButton
																						id="call-icon"
																						href={
																							contactData?.dialpadIds?.length && dialpadFeature
																								? ''
																								: `tel: ${contactData[field.key]}`
																						}
																						className={classes.emailAdornment}
																						onClick={() => {
																							contactData?.dialpadIds?.length &&
																								dialpadFeature &&
																								handleQuickActionActivity({
																									phoneNumber: contactData[field.key],
																									type: 'dialpad',
																								});
																						}}
																					>
																						<AddIcCallIcon htmlColor="#757575" />
																					</IconButton>
																				</Tooltip>
																			</InputAdornment>

																			<InputAdornment id="dialpad-icon" position="end">
																				<DailpadIcon htmlColor="#757575" />
																			</InputAdornment>
																		</>
																	)}
																</>
															) : activeLoadingField === field.key ? (
																<CircularProgress className={classes.loader} size={22} color="secondary" />
															) : activeLoadingField === field.key ? (
																<CircularProgress className={classes.loader} size={22} color="secondary" />
															) : (
																<>
																	{isValueOveridden && field.type !== 'currencySimple' && (
																		<AutorenewIcon
																			htmlColor="#757575"
																			onClick={() => {
																				const key = `evaluatedContactInterests.${field.key.split('.')[1]}`;

																				let value = get(contactData, key);
																				if (
																					field.key.includes('offerPriceSum') ||
																					field.key.includes('nraSum') ||
																					field.key.includes('maxOfferPriceSum') ||
																					field.key.includes('currentOfferPriceSum') ||
																					field.key.includes('closedPriceSum')
																				) {
																					value = parseFloat(value).toFixed(2);
																				}

																				updateFieldData(field.key, value);
																				params.onChange(value);
																			}}
																		/>
																	)}
																</>
															),
													}}
												/>
											) : (
												<AutoCompleteWithAddNew
													className={classes.maxWidth}
													setValue={value => {
														updateFieldData(field.key, value.name);
													}}
													fieldKey={field.key}
													defaultOptions={field.key === 'status' ? contactStatusOptions : []}
													value={contactData[field.key] ?? ''}
													variant="outlined"
												/>
											)}
										</Fragment>
									);
								}}
							/>
						</Grid>
					</Grid>
				</Grid>
			))}
		</Grid>
	);
}

SummaryFields.propTypes = {
	contactData: PropTypes.object.isRequired,
	handleQuickActionActivity: PropTypes.func.isRequired,
};
