import React, { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';

import { Grid, TextField } from '@mui/material';

import PropTypes from 'prop-types';

const classes = {
	maxWidth: {
		width: '100%',
	},
	baseValueChanged: {
		width: '100%',
		'& .MuiInputBase-input': {
			color: 'dodgerblue',
			fontWeight: 'bold',
		},
	},
};

function CustomTextField({
	watch = null,
	error = null,
	control = null,
	fieldEvents: { onBlur = null, onKeyUp = null, onChange = null, onKeyDown = null } = {},
	fieldConfig: {
		autoFocus = false,
		type = 'text',
		size = 'medium',
		fullWidth = true,
		multiline = false,
		variant = 'standard',
		disabled = false,
		required = false,
		margin = '',
	} = {},
	fieldAttributes: {
		name = '',
		value = '',
		inputRef = null,
		label = '',
		placeholder = '',
		InputProps = {},
		InputLabelProps = {},
		defaultValue = null,
		isValueOverridden = () => false,
	} = {},
}) {
	const [baseValueChanged, setbaseValueChanged] = useState(false);
	const watchTextFieldValue = watch ? watch(name) : '';

	useEffect(() => {
		if (watchTextFieldValue && isValueOverridden) {
			setbaseValueChanged(isValueOverridden(watchTextFieldValue));
		}
	}, [watchTextFieldValue]);

	const renderTextField = (props = {}) => {
		return (
			<TextField
				type={type}
				size={size}
				value={props?.value || value}
				margin={margin}
				autoFocus={autoFocus}
				fullWidth={fullWidth}
				multiline={multiline}
				placeholder={placeholder}
				disabled={disabled ?? false}
				defaultValue={defaultValue}
				variant={variant || 'filled'}
				data-testid={`${name}-field`}
				inputRef={inputRef || props?.ref || null}
				onKeyUp={onKeyUp ? onKeyUp : () => {}}
				onKeyDown={onKeyDown ? onKeyDown : () => {}}
				sx={baseValueChanged ? classes.baseValueChanged : classes.maxWidth}
				InputProps={InputProps}
				InputLabelProps={InputLabelProps}
				error={required && !watchTextFieldValue && error}
				onChange={e => {
					onChange ? onChange(e.target.value) : props?.onChange(e.target.value);
				}}
				onBlur={e => {
					let value = e.target.value || '';
					if (onBlur) {
						value = onBlur(value);
					}
					props?.onChange && props?.onChange(value);
				}}
			/>
		);
	};

	if (control) {
		return (
			<Grid item xs={12}>
				{label && <h3>{label}</h3>}
				<Controller control={control} name={name} render={props => renderTextField(props)} />
			</Grid>
		);
	}

	return (
		<Grid item xs={12}>
			{label && <h3>{label}</h3>}
			{renderTextField()}
		</Grid>
	);
}
CustomTextField.propTypes = {
	watch: PropTypes.func,
	error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
	control: PropTypes.object,
	fieldEvents: PropTypes.shape({
		onBlur: PropTypes.func,
		onKeyUp: PropTypes.func,
		onChange: PropTypes.func,
		onKeyDown: PropTypes.func,
	}),
	fieldConfig: PropTypes.shape({
		autoFocus: PropTypes.bool,
		type: PropTypes.string,
		size: PropTypes.oneOf(['small', 'medium', 'large']),
		fullWidth: PropTypes.bool,
		multiline: PropTypes.bool,
		variant: PropTypes.oneOf(['standard', 'outlined', 'filled']),
		disabled: PropTypes.bool,
		required: PropTypes.bool,
		margin: PropTypes.string,
	}),
	fieldAttributes: PropTypes.shape({
		name: PropTypes.string,
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
		inputRef: PropTypes.object,
		label: PropTypes.string,
		placeholder: PropTypes.string,
		InputProps: PropTypes.object,
		InputLabelProps: PropTypes.object,
		isValueOverridden: PropTypes.func,
	}),
	ref: PropTypes.object,
	onChange: PropTypes.func,
	onBlur: PropTypes.func,
	value: PropTypes.string,
};

export default CustomTextField;
