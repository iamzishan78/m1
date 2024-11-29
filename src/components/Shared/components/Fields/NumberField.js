import React, { useEffect, useState } from 'react';
import { TextField } from '@material-ui/core';

const NumberField = ({ value, defaultValue, id, field, fieldKey, index, onChange, ...props }) => {
	const [fieldValue, setFieldValue] = useState(value || defaultValue || '');

	useEffect(() => {
		setFieldValue(value || defaultValue || '');
	}, [value, defaultValue]);

	const handleChange = e => {
		const val = Number(e.target.value.trim());
		if (!isNaN(val)) {
			setFieldValue(val);
			onChange?.(e, val);
		}
	};

	return (
		<TextField
			id={id || `field-${index}`}
			variant="outlined"
			margin="dense"
			type="number"
			fullWidth
			value={fieldValue}
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

export default NumberField;
