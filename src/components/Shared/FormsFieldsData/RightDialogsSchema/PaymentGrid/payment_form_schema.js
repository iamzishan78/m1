import { InputAdornment } from '@material-ui/core';
import { GET_PAYMENT_AUTOCOMPLETE_LIST } from 'graphQL/useQueryGetPaymentAutoCompleteList';
import { GETMONGOUSERS } from 'graphQL/useQueryGetUsers';

const calculateNextPayment = (value, totalAmount, startDate, endDate) => {
	if(!value || !totalAmount || !startDate || !endDate) return 0
	

	const start = new Date(startDate);
	const end = new Date(endDate);
	const timeDiff = end - start;
	const daysDiff = timeDiff / (1000 * 60 * 60 * 24); // Convert to days

	if (end <= start) {
		return 0; // Return 0 or another value indicating invalid input
	}


	switch(value){
		case 'Annual': {
			const yearInDays = 365;
			if (daysDiff < yearInDays) {
				// Prorate the annual payment if period is less than a year
				return 0;
			}
			const years = daysDiff / yearInDays;
			return totalAmount / Math.floor(years+1);
		}
		case 'Monthly': {
			const monthInDays = 30.44;
			if (daysDiff < monthInDays) {
				// Prorate the monthly payment if period is less than a month
				return  0;
			}
			const months = daysDiff / monthInDays;
			return totalAmount / Math.floor(months+1);
		}
		case 'Quarterly': {
			const quarterInDays = 30.44 * 3;
			if (daysDiff < quarterInDays) {
				// Prorate the quarterly payment if period is less than a quarter
				return 0;
			}
			const quarters = daysDiff / quarterInDays;
			return totalAmount / Math.floor(quarters+1);
		}
		case 'Weekly': {
			const weekInDays = 7;
			if (daysDiff < weekInDays) {
				// Prorate the weekly payment if period is less than a week
				return 0;
			}
			const weeks = daysDiff / weekInDays;
			return totalAmount / Math.floor(weeks+1);
		}
		default: {
			return 0;
		}
	}
};

const paymentForm = ({ setValue, getValues }) => {
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
				 setValue('paymentType', selectedOption?.name || selectedOption || "");
			},
		},
		{
			renderField: 'startEndDate',
			onStartDateChange: value => {
				setValue('startDate', value);
				const {endDate, frequency, amount} = getValues()
				setValue('nextPayment', calculateNextPayment(frequency,amount,value,endDate));
			},
			onEndDateChange: value => {
				setValue('endDate', value);
				const {startDate, frequency, amount} = getValues()
				setValue('nextPayment', calculateNextPayment(frequency,amount,startDate,value));
			},
		},
		{
			label: 'Frequency',
			name: 'frequency',
			renderField: 'autoComplete',
			onChange: value => {
				setValue('frequency', value);
				const {startDate, endDate, amount} = getValues()
				setValue('nextPayment', calculateNextPayment(value,amount,startDate,endDate));
			},
			defaultOptions: [
				{ label: 'Annual', value: 'Annual' },
				{ label: 'Monthly', value: 'Monthly' },
				{ label: 'Quarterly', value: 'Quarterly' },
				{ label: 'Weekly', value: 'Weekly' },
			],
		},

		{
			label: 'Amount',
			name: 'amount',
			onChange: value => {
				setValue('amount', value);
				const {startDate, endDate, frequency} = getValues()
				setValue('nextPayment', calculateNextPayment(frequency,value,startDate,endDate));
			},
			type: 'number',
			InputProps: {
				endAdornment: <InputAdornment position="end">$</InputAdornment>,
			},
		},
		{
			label: 'Next Payment',
			name: 'nextPayment',
			disabled: true,
			type: 'number',
			InputProps: {
				endAdornment: <InputAdornment position="end">$</InputAdornment>,
			},
		},
		{
			label: 'Company Share',
			name: 'companyShare',
			onChange: value => {
				setValue('companyShare', value);
			},
			type: 'number',
			InputProps: {
				endAdornment: <InputAdornment position="end">$</InputAdornment>,
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
				if(selectedOption._id === 'newEntity') setValue('responsibleParty', selectedOption.name);
				else setValue('responsibleParty', selectedOption);
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
