import { InputAdornment } from '@material-ui/core';
import { GET_ES_SIMPLE_SEARCH } from 'graphQL/useQueryESSimpleSearch';

const costAllocationForm = ({ setValue }) => {
	const formFields = [
		{
			label: 'Cost Center',
			name: 'costCenter',
			renderField: 'autoComplete',
			query: GET_ES_SIMPLE_SEARCH,
			isESSearch: true,
			variables: {
				index: 'properties_flat',
				pagination: {
					first: 50,
					keep_alive: '1micros',
				},
				search: {
					query: `*`,
					fields: ['number.keyword', 'name.keyword'],
				},
				filters: [],
				sort: {
					field: 'lastUpdateAt',
					order: 'desc',
					unmapped_type: 'date',
				},
			},
			getOptions: apiRes => {
				// Transform API response into options for autocomplete
				const filterData = apiRes?.data?.getESSimpleSearch?.hits.map(hit => ({
					label: hit?.name,
					value: hit,
				}));
				return filterData;
			},
			onChange: property => {
				setValue('costCenter', property);
			},
		},
		{
			label: 'Cost Allocation',
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
			label: 'Cost Allocation Amount',
			name: 'amount',
			onChange: value => {
				setValue('amount', value);
			},
			type: 'number',
			InputProps: {
				endAdornment: <InputAdornment position="end">$</InputAdornment>,
			},
		},
	];

	return formFields;
};

export default costAllocationForm;
