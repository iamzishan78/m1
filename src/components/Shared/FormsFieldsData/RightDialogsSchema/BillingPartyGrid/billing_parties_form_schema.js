import { InputAdornment } from '@material-ui/core';
import { GET_ES_SIMPLE_SEARCH } from 'graphQL/useQueryESSimpleSearch';

const billingPartiesForm = ({ setValue }) => {
	const formFields = [
		{
			label: 'Billing Party Name',
			name: 'name',
			renderField: 'autoComplete',
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
			onChange: contact => {
				setValue('name', contact);
				setValue('address', contact?.primaryAddress || contact?.address1 || contact?.address2 || '');
			},
		},
		{
			label: 'Billing Party Address',
			name: 'address',
			onChange: value => {
				setValue('address', value);
			},
		},
		{
			label: 'Billing Party Allocation',
			name: 'allocation',
			onChange: value => {
				setValue('allocation', value);
			},
			type: 'number',
			InputProps: {
				endAdornment: <InputAdornment position="end">%</InputAdornment>,
			},
		},
		{
			label: 'Billing Party Amount',
			name: 'amount',
			onChange: value => {
				setValue('amount', value);
			},
			type: 'number',
			InputProps: {
				endAdornment: <InputAdornment position="end">$</InputAdornment>,
			},
		},

		// drop down menu with default option
		{
			label: 'Status',
			name: 'status',
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

export default billingPartiesForm;
