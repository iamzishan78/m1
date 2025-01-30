import React, { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';

import { Grid, TextField } from '@mui/material';

import PropTypes from 'prop-types';

import ReadOnlyField from './ReadOnlyField';


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

function TextFieldComponent({
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
		valueType = null,
		inputRef = null,
		label = '',
		placeholder = '',
		InputProps = {},
		InputLabelProps = {},
		isValueOverridden = () => false,
		allowEdit = false,
	} = {},
}) {
	const [baseValueChanged, setbaseValueChanged] = useState(false);
	const watchTextFieldValue = watch ? watch(name) : '';

	useEffect(() => {
		if (watchTextFieldValue && isValueOverridden) {
			setbaseValueChanged(isValueOverridden(watchTextFieldValue));
		}
	}, [watchTextFieldValue, isValueOverridden]);

	if (!allowEdit) {
		return <ReadOnlyField value={value} type={valueType} />;
	}

	const renderTextField = (props = {}) => {
		return (
			<TextField
				type={type}
				size={size}
				value={value}
				margin={margin}
				autoFocus={autoFocus}
				fullWidth={fullWidth}
				multiline={multiline}
				placeholder={placeholder}
				disabled={disabled ?? false}
				variant={variant || 'filled'}
				data-testid={`${name}-field`}
				inputRef={inputRef || props?.ref || null}
				onKeyUp={allowEdit && onKeyUp ? onKeyUp : () => {}}
				onKeyDown={allowEdit && onKeyDown ? onKeyDown : () => {}}
				sx={baseValueChanged ? classes.baseValueChanged : classes.maxWidth}
				InputProps={InputProps}
				InputLabelProps={InputLabelProps}
				error={required && !watchTextFieldValue && error}
				onChange={e => {
					const value = e.target.value;
					if (allowEdit) {
						onChange && onChange(value);
						props?.onChange && props?.onChange(value);
					}
				}}
				onBlur={e => {
					let value = e.target.value || '';
					if (allowEdit) {
						onBlur && onBlur(value);
						props?.onBlur && props.onBlur(value);
					}
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
TextFieldComponent.propTypes = {
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
		valueType: PropTypes.string,
		inputRef: PropTypes.object,
		label: PropTypes.string,
		placeholder: PropTypes.string,
		InputProps: PropTypes.object,
		InputLabelProps: PropTypes.object,
		isValueOverridden: PropTypes.func,
		allowEdit: PropTypes.bool,
	}),
	ref: PropTypes.object,
	onChange: PropTypes.func,
	onBlur: PropTypes.func,
};

TextFieldComponent.defaultProps = {
	watch: null,
	error: false,
	control: null,
	fieldEvents: {},
	fieldConfig: {
		autoFocus: false,
		type: 'text',
		size: 'medium',
		fullWidth: true,
		multiline: false,
		variant: 'standard',
		disabled: false,
		required: false,
		margin: '',
	},
	fieldAttributes: {
		name: '',
		value: '',
		valueType: null,
		inputRef: null,
		label: '',
		placeholder: '',
		InputProps: {},
		InputLabelProps: {},
		isValueOverridden: () => false,
		allowEdit: false,
	},
	ref: null,
	onChange: null,
	onBlur: null,
};

export default TextFieldComponent;
