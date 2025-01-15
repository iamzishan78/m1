import commaNumber from 'comma-number';

export default function vf_number(value, toFixed) {
	const numberValue = typeof value === 'number' ? value : parseFloat(value);

	const formattedValue = commaNumber(typeof toFixed === 'number' ? numberValue.toFixed(toFixed) : numberValue);

	return formattedValue === 'NaN' ? '0' : formattedValue;
}

export function vf_number_to_precision(value, precision) {
	const numberValue = typeof value === 'number' ? value : parseFloat(value);

	const fixed = 2;
	const isPositive = numberValue.toString().includes('+') || numberValue > 0;

	let precisionValue = isPositive ? numberValue.toFixed(fixed) : numberValue.toPrecision(precision);
	let formattedValue = isPositive ? Number(precisionValue) : Number(precisionValue.replace(/e[-]?\d+/i, ''));

	return formattedValue === 'NaN' ? '0' : commaNumber(formattedValue);
}
