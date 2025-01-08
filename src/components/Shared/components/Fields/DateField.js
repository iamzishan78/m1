import React, { useEffect, useState } from 'react';

import { TextField } from '@material-ui/core';

import moment from 'moment';

const DateField = ({ value, defaultValue, id, field, fieldKey, index, onChange, ...props }) => {
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
			onBlur={() => {
				props?.offClickHandler(fieldKey, fieldValue);
			}}
			onChange={handleChange}
			disabled={field?.disabled}
			{...props.props}
		/>
	);
};

export default DateField;
