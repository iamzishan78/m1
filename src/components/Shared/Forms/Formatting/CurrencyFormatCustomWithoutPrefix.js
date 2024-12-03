import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';

export function CurrencyFormatCustomWithoutPrefix(props) {
	const { inputRef, onChange, name, prefix, ...other } = props;
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
			// isNumericString
			// prefix={typeof prefix !== 'undefined' ? prefix : '$'}
		/>
	);
}

CurrencyFormatCustomWithoutPrefix.propTypes = {
	inputRef: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};
