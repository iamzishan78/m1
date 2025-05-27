import { InputAdornment } from '@material-ui/core';

import moment from 'moment';

import { CurrencyFormatCustom } from 'components/Shared/Forms/Formatting/NumberFormatCustom';

import { GET_PAYMENT_AUTOCOMPLETE_LIST } from 'graphQL/useQueryGetPaymentAutoCompleteList';
import { GETMONGOUSERS } from 'graphQL/useQueryGetUsers';

const getNextPaymentDate = (value, startDate, endDate) => {
	if (!value || !startDate || !endDate) {
		return startDate;
	}

	const start = new Date(startDate);
	const end = new Date(endDate);
	const current = new Date();

	// Check if startDate is greater than current date
	if (start > current) {
		return startDate; // Return startDate if it's in the future
	}

	if (end <= start) {
		return startDate; // Return startDate if endDate is less than or equal to startDate
	}

	let nextPaymentDate;

	switch (value) {
		case 'Annual': {
			const oneYear = 365 * 24 * 60 * 60 * 1000; // 365 days in milliseconds
			nextPaymentDate = new Date(start.getTime() + oneYear);

			// Check if the next payment date is beyond the end date
			if (nextPaymentDate > end) {
				return startDate; // Return startDate if the frequency does not align
			}
			break;
		}
		case 'Monthly': {
			nextPaymentDate = new Date(start);
			nextPaymentDate.setMonth(start.getMonth() + 1);

			if (nextPaymentDate > end) {
				return startDate;
			}
			break;
		}
		case 'Quarterly': {
			nextPaymentDate = new Date(start);
			nextPaymentDate.setMonth(start.getMonth() + 3);

			if (nextPaymentDate > end) {
				return startDate;
			}
			break;
		}
		case 'Weekly': {
			const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
			nextPaymentDate = new Date(start.getTime() + oneWeek);

			if (nextPaymentDate > end) {
				return startDate;
			}
			break;
		}
		default: {
			return startDate; // Return startDate if frequency is invalid
		}
	}

	return moment(nextPaymentDate); // Return date in YYYY-MM-DD format
};

const paymentForm = ({ setValue, getValues, isUpdate }) => {
	const formFields = [
		{
			label: 'Payment Type',
			name: 'paymentType',
			renderField: 'autoCompleteNewOption',
			query: GET_PAYMENT_AUTOCOMPLETE_LIST,
			variables: {
				key: 'paymentType',
			},
			getOptions: apiRes => {
				// Transform API response into options for autocomplete
				const filterData = apiRes?.data?.paymentAutoCompleteList.map(option => ({
					label: option,
					value: option,
				}));
				return filterData;
			},
			onChange: selectedOption => {
				setValue('paymentType', selectedOption || '');
			},
		},
		{
			label: 'Start Date',
			name: 'startDate',
			disabled: isUpdate,
			type: 'date',
			required: true,
			onChange: value => {
				setValue('startDate', value);
				const { endDate, frequency } = getValues();
				setValue('nextPayment', getNextPaymentDate(frequency, value, endDate));
			},
		},
		{
			label: 'End Date',
			name: 'endDate',
			disabled: isUpdate,
			type: 'date',
			required: true,
			onChange: value => {
				setValue('endDate', value);
				const { startDate, frequency } = getValues();
				setValue('nextPayment', getNextPaymentDate(frequency, startDate, value));
			},
			onBlur: value => {
				const { startDate, frequency } = getValues();
				const start = new Date(startDate);
				const end = new Date(value);
				if (end < start) {
					setValue('endDate', startDate);
					setValue('nextPayment', getNextPaymentDate(frequency, startDate, startDate));
					return startDate;
				} else {
					setValue('endDate', value);
					setValue('nextPayment', getNextPaymentDate(frequency, startDate, value));
					return value;
				}
			},
		},
		{
			label: 'Frequency',
			name: 'frequency',
			disabled: isUpdate,
			renderField: 'autoComplete',
			required: true,
			onChange: value => {
				setValue('frequency', value);
				const { startDate, endDate } = getValues();
				setValue('nextPayment', getNextPaymentDate(value, startDate, endDate));
			},
			defaultOptions: [
				{ label: 'Annual', value: 'Annual' },
				{ label: 'Monthly', value: 'Monthly' },
				{ label: 'Quarterly', value: 'Quarterly' },
				{ label: 'Weekly', value: 'Weekly' },
			],
		},
		{
			label: 'Next Payment',
			name: 'nextPayment',
			disabled: true,
			type: 'date',
		},
		{
			label: 'Amount',
			name: 'amount',
			required: true,
			disabled: isUpdate,
			onChange: value => {
				setValue('amount', value);
			},
			InputProps: {
				inputComponent: CurrencyFormatCustom,
			},
			onBlur: value => {
				const cleanedValue = value.replace(/[$,]/g, '');
				const numericValue = parseFloat(cleanedValue);
				const formattedValue = numericValue.toFixed(2);
				return formattedValue;
			},
		},
		{
			label: 'Company Share',
			name: 'companyShare',
			onChange: value => {
				setValue('companyShare', value);
			},
			InputProps: {
				inputComponent: CurrencyFormatCustom,
			},
			onBlur: value => {
				const cleanedValue = value.replace(/[$,]/g, '');
				const numericValue = parseFloat(cleanedValue);
				const formattedValue = numericValue.toFixed(2);
				return formattedValue;
			},
		},
		{
			label: 'Responsible Party',
			name: 'responsibleParty',
			renderField: 'autoCompleteNewOption',
			query: GET_PAYMENT_AUTOCOMPLETE_LIST,
			variables: {
				key: 'responsibleParty',
			},
			getOptions: apiRes => {
				// Transform API response into options for autocomplete
				const filterData = apiRes?.data?.paymentAutoCompleteList.map(option => ({
					label: option,
					value: option,
				}));
				return filterData;
			},
			onChange: selectedOption => {
				setValue('responsibleParty', selectedOption);
			},
		},

		{
			label: 'Assigned To',
			name: 'assignedTo',
			renderField: 'autoComplete',
			query: GETMONGOUSERS,
			variables: {
				esIndex: 'contacts_flat',
				filterKey: 'contactOwner.keyword',
				size: 10000,
			},
			getOptions: apiRes => {
				const filterData = apiRes.data.allMongoUsers.map(user => ({
					value: user._id,
					label: user.name,
				}));
				return filterData;
			},
			onChange: selectedOption => {
				setValue('assignedTo', selectedOption);
			},
		},

		// drop down menu with default option
		{
			label: 'Payment Status',
			name: 'paymentStatus',
			renderField: 'autoComplete',
			defaultOptions: [
				{ label: 'On Hold', value: 'On Hold' },
				{ label: 'Approved', value: 'Approved' },
				{ label: 'Unapproved', value: 'Unapproved' },
			],
		},
	];

	return formFields;
};

export default paymentForm;
