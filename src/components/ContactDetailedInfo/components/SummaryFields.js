import React, { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { useMutation } from '@apollo/client';
import { get, set, isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import { SUMMARY_FIELDS, featureFlagChanges, contactStatusOptions } from 'components/ContactDetailedInfo/helper';
import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';
import CustomTextField from 'components/Shared/components/Fields/CustomTextField';
import { FEATURES } from 'components/Shared/FeatureFlag/common';
import { CurrencyFormatCustom } from 'components/Shared/Forms/Formatting/CurrencyFormatCustom';
import { NumberFormatComma } from 'components/Shared/Forms/Formatting/NumberFormatComma';
import vf_number from 'components/Shared/valueformatters/vf_number';

import { UPDATECONTACT } from 'graphQL/useMutationUpdateContact';
import { GET_ES_FILTER_LIST } from 'graphQL/useQueryESFilterList';

import { showErrorMessage } from 'actions';
import { AppContext } from 'AppContext';

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
	const { control, reset, watch } = useForm();
	const [activeLoadingField, setLoading] = useState();
	const [isFormSet, setFormState] = useState(false);
	const [stateApp] = useContext(AppContext);
	const dispatch = useDispatch();

	const { user } = useSelector(state => state.app);

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
			{SUMMARY_FIELDS(contactData).map(field => (
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
							{field.type !== 'autocomplete' ? (
								<CustomTextField
									control={control}
									watch={watch}
									fieldConfig={{
										size: 'small',
										type: 'text',
										fullWidth: true,
										variant: 'outlined',
										margin: 'dense',
										disabled: field.disabled,
										customStyleClass: classes.field,
									}}
									fieldAttributes={{
										name: field.key,
										defaultValue: field.value,
										inputRef: field.inputRef,
										InputLabelProps: { shrink: true },
										endAdornmentProps: {
											type:
												activeLoadingField === field.key
													? 'loading'
													: field.isPhoneNumber
														? 'phoneNumber'
														: field.type === 'email'
															? 'email'
															: null,
											handleAction: handleQuickActionActivity,
											dialpadFeature,
											dialpadIds: contactData?.dialpadIds,
										},
										InputProps: {
											inputComponent:
												field.type === 'currency' || field.type === 'currencySimple'
													? CurrencyFormatCustom
													: field.key.includes('nraSum')
														? NumberFormatComma
														: undefined,
										},
										isValueOverridden: value => isChanged(field.key, value),
										resetOveriddenValue: () => {
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

											return value;
										},
									}}
									fieldEvents={{
										onKeyUp: event => event.key === 'Enter' && event.target.blur(),
										onBlur: value => {
											let currValue = value;

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

											if (currValue !== prevValue) {
												updateFieldData(field.key, currValue);
											}

											if (field.key.includes('offerPriceSum') || field.key.includes('nraSum')) {
												return currValue.toFixed(2);
											}

											return null;
										},
									}}
								/>
							) : (
								<CustomAutoComplete
									fieldAttributes={{
										value: contactData[field.key] ?? '',
										optionArray: field.key === 'status' ? contactStatusOptions : [],
										query: GET_ES_FILTER_LIST,
										variables: {
											esIndex: 'contacts_flat',
											filterKey: field.key + '.keyword',
											size: 50,
										},
										getOptions: res => res?.data?.getESFilterList?.hits?.map(hit => hit.key).filter(option => option),
									}}
									fieldConfig={{
										size: 'small',
										margin: 'dense',
										variant: 'outlined',
									}}
									fieldEvents={{
										onChange: ({ value }) => updateFieldData(field.key, value ?? ''),
									}}
								/>
							)}
						</Grid>
					</Grid>
				</Grid>
			))}
		</Grid>
	);
}

SummaryFields.propTypes = {
	fields: PropTypes.arrayOf(
		PropTypes.shape({
			key: PropTypes.string.isRequired,
			type: PropTypes.string,
			value: PropTypes.any,
			disabled: PropTypes.bool,
			isPhoneNumber: PropTypes.bool,
			inputRef: PropTypes.object,
		})
	).isRequired,
	contactData: PropTypes.object.isRequired,
	activeLoadingField: PropTypes.string,
	updateFieldData: PropTypes.func.isRequired,
	handleQuickActionActivity: PropTypes.func.isRequired,
};
