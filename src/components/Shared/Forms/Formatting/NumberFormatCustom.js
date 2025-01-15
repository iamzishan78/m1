import React from 'react';
import NumberFormat from 'react-number-format';

import PropTypes from 'prop-types';

export function NumberFormatCustom(props) {
	const { inputRef, onChange, name, ...other } = props;
	return (
		<NumberFormat
			{...other}
			getInputRef={inputRef}
			onValueChange={values => {
				onChange({
					target: {
						name: props.name,
						value: values.value,
					},
				});
			}}
			// thousandSeparator
			// isNumericString
			// prefix="$"
		/>
	);
}

NumberFormatCustom.propTypes = {
	inputRef: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};

export function CurrencyFormatCustom(props) {
	const { inputRef, onChange, ...other } = props;

	return (
		<NumberFormat
			{...other}
			getInputRef={inputRef}
			onValueChange={values => {
				onChange({
					target: {
						name: props.name,
						value: values.value,
					},
				});
			}}
			thousandSeparator
			isNumericString
			prefix="$"
		/>
	);
}

CurrencyFormatCustom.propTypes = {
	inputRef: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};
