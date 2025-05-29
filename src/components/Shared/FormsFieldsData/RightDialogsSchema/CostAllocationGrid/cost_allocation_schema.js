import React from 'react';

import { InputAdornment } from '@material-ui/core';

import { CurrencyFormatCustom } from 'components/Shared/Forms/Formatting/NumberFormatCustom';
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
				startAdornment: <InputAdornment position="start">%</InputAdornment>,
			},
		},
		{
			label: 'Cost Allocation Amount',
			name: 'amount',
			disabled: true,
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
	];

	return formFields;
};

export default costAllocationForm;
