import PropTypes from 'prop-types';
import React from 'react';
import NumberFormat from 'react-number-format';

export function NumberFormatComma(props) {
	const { inputRef, onChange, name, prefix, ...other } = props;
	return (
		<NumberFormat
			{...other}
			getInputRef={inputRef}
			onValueChange={values => {
				onChange({
					target: {
						name: props.name,
						value: parseFloat(values.value || 0).toFixed(2),
					},
				});
			}}
			thousandSeparator
			// isNumericString
		/>
	);
}

NumberFormatComma.propTypes = {
	inputRef: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};
