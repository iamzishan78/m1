import React, { useEffect, useState } from 'react';

import { TextField } from '@material-ui/core';

import moment from 'moment';
import PropTypes from 'prop-types';

const DateField = ({
	value,
	defaultValue,
	id,
	field,
	fieldKey,
	index,
	onChange,
	minDate = '1000-01-01', // Default min date set to year 1000
	maxDate = '9999-12-31', // Default max date set to year 9999
	...props
}) => {
	const [fieldValue, setFieldValue] = useState(value || defaultValue || '');

	useEffect(() => {
		setFieldValue(value || defaultValue || '');
	}, [value, defaultValue]);

	const handleChange = e => {
		const val = e.target.value;
		setFieldValue(val);
		onChange?.(e, val);
	};

	const formatDate = date => {
		return date ? moment(date).format('YYYY-MM-DD') : '';
	};

	return (
		<TextField
			id={id || `field-${index}`}
			variant="outlined"
			margin="dense"
			type="date"
			fullWidth
			value={formatDate(fieldValue)}
			InputProps={props.InputProps}
			InputLabelProps={{ shrink: true }}
			inputProps={{
				min: moment(minDate).format('YYYY-MM-DD'), // Set the min date
				max: moment(maxDate).format('YYYY-MM-DD'), // Set the max date
				...props.inputProps,
			}}
			onBlur={() => {
				props?.offClickHandler(fieldKey, fieldValue);
			}}
			onChange={handleChange}
			disabled={field?.disabled}
			{...props.props}
		/>
	);
};

DateField.propTypes = {
	value: PropTypes.string, // The current value of the date field (ISO format).
	defaultValue: PropTypes.string, // The default value for the date field (ISO format).
	id: PropTypes.string, // The unique identifier for the date field.
	field: PropTypes.shape({
		disabled: PropTypes.bool, // Indicates if the field is disabled.
	}), // Optional field object with additional field properties.
	fieldKey: PropTypes.string, // Key to uniquely identify the field.
	index: PropTypes.number, // The index of the field in a list (if applicable).
	onChange: PropTypes.func, // Callback function triggered when the value changes.
	minDate: PropTypes.string, // Minimum allowed date in ISO format.
	maxDate: PropTypes.string, // Maximum allowed date in ISO format.
	InputProps: PropTypes.object, // Props passed to the TextField's InputProps.
	inputProps: PropTypes.object, // Additional props for the input element.
	offClickHandler: PropTypes.func, // Callback for when the field loses focus.
	props: PropTypes.object, // Additional props.
};

export default DateField;
