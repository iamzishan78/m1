import { InputAdornment } from '@material-ui/core';
import { GET_ES_SIMPLE_SEARCH } from 'graphQL/useQueryESSimpleSearch';
import { GETMONGOUSERS } from 'graphQL/useQueryGetUsers';

const paymentForm = ({ setValue }) => {
	const formFields = [
		{
			label: 'Payment Type',
			name: 'paymentType',
			renderField: 'autoCompleteNewOption',
			query: GET_ES_SIMPLE_SEARCH,
			isESSearch: true,
			variables: {
				index: 'contacts_flat',
				pagination: {
					first: 50,
					keep_alive: '1micros',
				},
				search: {
					query: `*`,
					fields: ['name.keyword'],
				},
				filters: [],
			},
			getOptions: apiRes => {
				// Transform API response into options for autocomplete
				const filterData = apiRes?.data?.getESSimpleSearch?.hits.map(hit => ({
					label: hit?.name,
					value: hit,
				}));
				return filterData;
			},
			onChange: selectedOption => {
				setValue('paymentType', selectedOption);
			},
		},
		{
			label: 'Start Date',
			renderField: 'datePicker',
			name: 'startDate',
			onChange: value => {
				setValue('startDate', value);
			},
		},
		{
			label: 'End Date',
			name: 'endDate',
			renderField: 'datePicker',
			onChange: value => {
				setValue('endDate', value);
			},
		},

		{
			label: 'Frequency',
			name: 'frequency',
			renderField: 'autoComplete',
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
			query: GET_ES_SIMPLE_SEARCH,
			isESSearch: true,
			variables: {
				index: 'contacts_flat',
				pagination: {
					first: 50,
					keep_alive: '1micros',
				},
				search: {
					query: `*`,
					fields: ['name.keyword'],
				},
				filters: [],
			},
			getOptions: apiRes => {
				// Transform API response into options for autocomplete
				const filterData = apiRes?.data?.getESSimpleSearch?.hits.map(hit => ({
					label: hit?.name,
					value: hit,
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
