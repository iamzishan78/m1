import React from 'react';
import NumberFormat from 'react-number-format';

import PropTypes from 'prop-types';

export function NumberFormatPrecision(props) {
	const {
		inputRef,
		onChange,
		name,
		decimalScale = 8, // default to 8 if not passed
		...other
	} = props;

	return (
		<NumberFormat
			{...other}
			getInputRef={inputRef}
			onValueChange={values => {
				const formattedValue = values.value
					? parseFloat(values.value).toLocaleString('en', {
							useGrouping: false,
							minimumFractionDigits: decimalScale,
							maximumFractionDigits: 20,
						})
					: '';

				onChange({
					target: {
						name,
						value: formattedValue,
					},
				});
			}}
			isNumericString
			decimalScale={decimalScale}
			fixedDecimalScale
		/>
	);
}

NumberFormatPrecision.propTypes = {
	inputRef: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	decimalScale: PropTypes.number, // optional prop to control decimal places
};
