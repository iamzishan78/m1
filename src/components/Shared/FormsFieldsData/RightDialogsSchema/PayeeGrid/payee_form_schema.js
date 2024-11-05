import { GET_ES_SIMPLE_SEARCH } from 'graphQL/useQueryESSimpleSearch';

const payeeForm = ({ setValue }) => {
	const formFields = [
		{
			label: 'Payee Name',
			name: 'payeeName',
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
				setValue('payeeName', contact);
			},
		},
		{
			label: 'Payee Address',
			name: 'payeeAddress',
			onChange: value => {
				setValue('payeeAddress', value);
			},
		},
		{
			label: 'Payment Allocation',
			name: 'paymentAllocation',
			onChange: value => {
				setValue('paymentAllocation', value);
			},
			type: 'number',
		},
		{
			label: 'Payment Amount',
			name: 'paymentAmount',
			onChange: value => {
				setValue('paymentAmount', value);
			},
			type: 'number',
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

export default payeeForm;
