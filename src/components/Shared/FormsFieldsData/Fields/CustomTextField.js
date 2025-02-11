import React, { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';

import { Autorenew } from '@mui/icons-material';
import { Grid, TextField } from '@mui/material';

import PropTypes from 'prop-types';
import validator from 'validator';

import UrlTooltip from './UrlTooltip';

const classes = {
	maxWidth: {
		width: '100%',
		'& .MuiInputLabel-root.Mui-focused': {
			color: 'grey',
		},
	},
	baseValueChanged: {
		width: '100%',
		'& .MuiInputBase-input': {
			color: 'dodgerblue',
			fontWeight: 'bold',
		},
		'& .MuiInputLabel-root.Mui-focused': {
			color: 'grey',
		},
	},
};

function CustomTextField({
	watch = null,
	error = null,
	control = null,
	fieldEvents: { onBlur = null, onKeyUp = null, onChange = null, onKeyDown = null, onFocus = null } = {},
	fieldConfig: {
		margin = '',
		type = 'text',
		size = 'medium',
		disabled = false,
		required = false,
		fullWidth = true,
		multiline = false,
		autoFocus = false,
		variant = 'standard',
		customStyleClass = '',
		labelAsHeading = true,
	} = {},
	fieldAttributes: {
		name = '',
		value: _value = '',
		label = '',
		inputRef = null,
		placeholder = '',
		InputProps = {},
		InputLabelProps = {},
		defaultValue = null,
		isValueOverridden = () => false,
		resetOveriddenValue,
	} = {},
	...propsRest
}) {
	const [value, setValue] = useState(_value);
	const [baseValueChanged, setBaseValueChanged] = useState(false);
	const [showUrlTooltip, setShowUrlTooltip] = useState(false);
	const watchTextFieldValue = watch ? watch(name) : '';

	useEffect(() => {
		if (!value) {
			setValue(defaultValue);
		}
	}, [defaultValue]);

	// Sync internal value with external props
	useEffect(() => {
		setValue(_value);
	}, [_value]);

	// Unified logic to check if value is overridden
	useEffect(() => {
		if (watchTextFieldValue && isValueOverridden) {
			setBaseValueChanged(isValueOverridden(watchTextFieldValue));
		}
	}, [watchTextFieldValue, isValueOverridden]);

	// URL Tooltip handling
	const handleTooltipOpen = value => {
		setShowUrlTooltip(value?.split(' ')?.some(subString => validator.isURL(subString, { require_protocol: false })));
	};

	// Render function for TextField
	const renderTextField = props => {
		const textFieldValue = props ? props.value : value;
		return (
			<div style={{ position: 'relative' }}>
				<TextField
					type={type}
					size={size}
					label={label}
					value={textFieldValue}
					margin={margin}
					autoFocus={autoFocus}
					onFocus={() => {
						onFocus?.();
						handleTooltipOpen(textFieldValue);
					}}
					fullWidth={fullWidth}
					multiline={multiline}
					placeholder={placeholder}
					disabled={disabled}
					defaultValue={defaultValue}
					variant={variant || 'filled'}
					data-testid={`${name}-field`}
					className={customStyleClass}
					inputRef={inputRef || props?.ref || null}
					onKeyUp={onKeyUp || (() => {})}
					onKeyDown={onKeyDown || (() => {})}
					onMouseEnter={() => handleTooltipOpen(textFieldValue)}
					onMouseLeave={() => setShowUrlTooltip(false)}
					sx={baseValueChanged ? classes.baseValueChanged : classes.maxWidth}
					InputProps={{
						...InputProps,
						endAdornment: baseValueChanged ? (
							<Autorenew
								htmlColor="#757575"
								onClick={() => {
									const newValue = resetOveriddenValue?.();

									handleTooltipOpen(newValue);
									onChange?.(newValue);
									props?.onChange?.(newValue);
									if (!onChange && !props?.onChange) {
										setValue(newValue);
									}
								}}
							/>
						) : (
							InputProps.endAdornment
						),
					}}
					InputLabelProps={InputLabelProps}
					error={required && !watchTextFieldValue && error}
					onChange={e => {
						const newValue = e.target.value;
						handleTooltipOpen(newValue);
						onChange?.(newValue);
						props?.onChange?.(e);
						if (!onChange && !props?.onChange) {
							setValue(newValue);
						}
					}}
					onBlur={e => {
						let newValue = e.target.value || '';
						if (onBlur) {
							newValue = onBlur(newValue);
							if (newValue != null) {
								onChange?.(newValue);
								props?.onChange?.(newValue);
							}
						}
					}}
					{...propsRest}
				/>

				{showUrlTooltip && (
					<UrlTooltip
						value={textFieldValue}
						handleMouseEnter={() => setShowUrlTooltip(true)}
						handleMouseLeave={() => setShowUrlTooltip(false)}
						containerStyles={{ top: margin === 'dense' ? '8px' : margin === 'normal' ? '16px' : '0' }}
					/>
				)}
			</div>
		);
	};

	return (
		<Grid item xs={12}>
			{label && labelAsHeading && <h3>{label}</h3>}
			{control ? (
				<Controller control={control} name={name} render={props => renderTextField(props)} />
			) : (
				renderTextField()
			)}
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
		margin: PropTypes.string,
		type: PropTypes.string,
		size: PropTypes.oneOf(['small', 'medium', 'large']),
		disabled: PropTypes.bool,
		required: PropTypes.bool,
		fullWidth: PropTypes.bool,
		multiline: PropTypes.bool,
		autoFocus: PropTypes.bool,
		variant: PropTypes.oneOf(['standard', 'outlined', 'filled']),
		customStyleClass: PropTypes.string,
	}),
	fieldAttributes: PropTypes.shape({
		name: PropTypes.string,
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
		label: PropTypes.string,
		inputRef: PropTypes.any,
		placeholder: PropTypes.string,
		InputProps: PropTypes.object,
		InputLabelProps: PropTypes.object,
		defaultValue: PropTypes.any,
		isValueOverridden: PropTypes.func,
	}),
	ref: PropTypes.object,
	onChange: PropTypes.func,
	onBlur: PropTypes.func,
	value: PropTypes.string,
};

export default CustomTextField;
