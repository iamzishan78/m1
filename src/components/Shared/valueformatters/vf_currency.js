import React from 'react';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import { toNumber } from 'lodash';

import vf_number from './vf_number';

export default function vf_currency(value) {
	var formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumSignificantDigits: 21,
	});

	const valueFormatter = v => {
		if (v) {
			return formatter.format(parseInt(v));
		}
		return v;
	};

	return valueFormatter(value);
}

export function vf_currency_to_fixed(value, toFixed) {
	if (value === 0) {
		return `$${value}`;
	}

	if (!value) {
		return null;
	}

	const numericValue = parseFloat(value);

	if (isNaN(numericValue)) {
		console.error(`Invalid value provided: ${value}`);
		return null;
	}

	const fixedValue = numericValue.toFixed(toFixed);

	var formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: toFixed, // Ensures at least 'toFixed' decimal places are displayed
		maximumFractionDigits: toFixed, // Ensures at most 'toFixed' decimal places are displayed
	});

	const valueFormatter = v => {
		if (v) {
			return formatter.format(parseFloat(v).toFixed(toFixed));
		}
		return v;
	};

	return valueFormatter(fixedValue);
}

export function vf_currency_dollar(value, toFixed) {
	return (
		<div style={{ display: 'flex', alignItems: 'center' }}>
			{value < 0 && '-'}
			{<AttachMoneyIcon style={{ fontSize: '2.5rem', margin: '0  -0.6rem' }} />}
			{value ? vf_number(Math.abs(value?.toFixed(toFixed))) : '0.00'}
		</div>
	);
}

export function calculatePercentage(percentage, total, toFixed = 2) {
	const totalAmount = toNumber(total);
	if (totalAmount) {
		return ((percentage / 100) * toNumber(totalAmount)).toFixed(toFixed);
	} else {
		return 0;
	}
}
