import React from 'react';
import TextField from '@material-ui/core/TextField';

function TextFieldComponent(props) {
	const { inputRef, onChange, name, options, label, value, defaultValue, variant, disabled, ref, ...other } = props;

	return (
		<TextField
			variant={variant || 'outlined'}
			margin="dense"
			inputRef={ref}
			value={value}
			label={label}
			InputLabelProps={{ shrink: true }}
			fullWidth
			disabled={!!disabled}
			defaultValue=""
		/>
	);
}

export default TextFieldComponent;
