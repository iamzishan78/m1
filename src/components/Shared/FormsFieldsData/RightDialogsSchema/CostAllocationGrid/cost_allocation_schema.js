import React from 'react';

import { InputAdornment } from '@material-ui/core';

import { calculatePercentage } from 'components/Shared/valueformatters/vf_currency';

import { GET_DB_DATA } from 'graphQL/useQueryDbQuery';

import { tableGlobalController } from 'stateManagement/tableController';

const costAllocationForm = ({ setValue }) => {
	const { paymentAmount } = tableGlobalController.getValue('paymentMultiGrid');

	const formFields = [
		{
			label: 'Cost Center',
			name: 'costCenter',
			renderField: 'autoComplete',
			required: true,
			query: GET_DB_DATA,
			isESSearch: true,
			variables: {
				index: 'properties_flat',
				pagination: {
					first: 50,
					keep_alive: '1micros',
				},
				search: {
					query: '*',
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
				const filterData = apiRes?.data?.getDbData?.hits.map(hit => ({
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
			required: true,
			onChange: value => {
				setValue('allocation', value);
				setValue('amount', calculatePercentage(value, paymentAmount));
			},
			type: 'number',
			InputProps: {
				endAdornment: <InputAdornment position="end">%</InputAdornment>,
			},
		},
		{
			label: 'Cost Allocation Amount',
			name: 'amount',
			disabled: true,
			type: 'number',
			InputProps: {
				endAdornment: <InputAdornment position="end">$</InputAdornment>,
			},
		},
	];

	return formFields;
};

export default costAllocationForm;
