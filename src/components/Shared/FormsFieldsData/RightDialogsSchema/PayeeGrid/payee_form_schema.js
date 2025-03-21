import React from 'react';

import { InputAdornment } from '@material-ui/core';

import { calculatePercentage } from 'components/Shared/valueformatters/vf_currency';

import { GET_DB_DATA } from 'graphQL/useQueryDbQuery';

import { tableGlobalController } from 'stateManagement/tableController';

const payeeForm = ({ setValue }) => {
	const { paymentAmount } = tableGlobalController.getValue('paymentMultiGrid');

	const formFields = [
		{
			label: 'Payee Name',
			name: 'payeeName',
			renderField: 'autoComplete',
			required: true,
			query: GET_DB_DATA,
			isESSearch: true,
			variables: {
				index: 'contacts_flat',
				pagination: {
					first: 50,
					keep_alive: '1micros',
				},
				search: {
					query: '*',
					fields: ['name.keyword'],
				},
				filters: [],
			},
			getOptions: apiRes => {
				// Transform API response into options for autocomplete
				const filterData = apiRes?.data?.getDbData?.hits.map(hit => ({
					label: hit?.name,
					value: hit,
				}));
				return filterData;
			},
			onChange: contact => {
				setValue('payeeName', contact);
				setValue('payeeAddress', contact?.primaryAddress || contact?.address1 || contact?.address2 || '');
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
			required: true,
			onChange: value => {
				setValue('paymentAllocation', value);
				setValue('paymentAmount', calculatePercentage(value, paymentAmount));
			},
			type: 'number',
			InputProps: {
				endAdornment: <InputAdornment position="end">%</InputAdornment>,
			},
		},
		{
			label: 'Payment Amount',
			name: 'paymentAmount',
			disabled: true,
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

export default payeeForm;
