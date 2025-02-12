import React, { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';

import { AddIcCall, Autorenew, EmailOutlined, Textsms, Voicemail } from '@mui/icons-material';
import { CircularProgress, Grid, IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';

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
	emailAdornment: {
		cursor: 'pointer',
		padding: '0px', // Remove extra padding
		margin: '0 2px', // Adjust spacing between icons
	},
};

// Define a configuration object for adornments
const adornmentConfig = {
	email: {
		icon: <EmailOutlined htmlColor="#757575" />,
		tooltip: 'Email',
		action: value => `mailto: ${value}`,
	},
	phoneNumber: {
		icons: [
			{
				icon: <Voicemail htmlColor="#757575" />,
				tooltip: 'Voice Mail',
				action: (value, handleAction) => handleAction({ phoneNumber: value, type: 'call' }),
			},
			{
				icon: <Textsms htmlColor="#757575" />,
				tooltip: 'Text SMS',
				action: (value, handleAction) => handleAction({ phoneNumber: value, type: 'text_message' }),
			},
			{
				icon: <AddIcCall htmlColor="#757575" />,
				tooltip: 'Call',
				action: (value, handleAction, dialpadFeature, dialpadIds) => {
					if (dialpadIds?.length && dialpadFeature) {
						handleAction({ phoneNumber: value, type: 'dialpad' });
					}
				},
				href: (value, dialpadFeature, dialpadIds) => {
					if (dialpadIds?.length && dialpadFeature) {
						return '';
					}
					return `tel: ${value}`;
				},
			},
		],
	},
	loading: {
		component: <CircularProgress size={22} color="secondary" />,
	},
};

// Function to render adornments
function renderAdornment(type, value, handleAction, dialpadFeature, dialpadIds) {
	const config = adornmentConfig[type];
	if (!config) {
		return null;
	}

	if (config.component) {
		return config.component;
	}

	if (config.icons) {
		return config.icons.map(iconConfig => (
			<InputAdornment position="end" key={iconConfig.tooltip}>
				<Tooltip title={iconConfig.tooltip} placement="top">
					<IconButton
						className={classes.emailAdornment}
						href={iconConfig.href?.(value, dialpadFeature, dialpadIds)}
						onClick={() => iconConfig.action(value, handleAction, dialpadFeature, dialpadIds)}
					>
						{iconConfig.icon}
					</IconButton>
				</Tooltip>
			</InputAdornment>
		));
	}

	return (
		<InputAdornment position="end">
			<Tooltip title={config.tooltip} placement="top">
				<IconButton className={classes.emailAdornment} href={config.action(value)}>
					{config.icon}
				</IconButton>
			</Tooltip>
		</InputAdornment>
	);
}

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
		endAdornmentProps,
	} = {},
	...propsRest
}) {
	const [value, setValue] = useState(_value);
	const [baseValueChanged, setBaseValueChanged] = useState(false);
	const [showUrlTooltip, setShowUrlTooltip] = useState(false);
	const watchTextFieldValue = watch ? watch(name) : '';

	// Sync internal value with external props
	useEffect(() => {
		setValue(_value);
	}, [_value]);

	useEffect(() => {
		if (!value) {
			setValue(defaultValue);
		}
	}, [defaultValue]);

	// Unified logic to check if value is overridden
	useEffect(() => {
		if (watchTextFieldValue && isValueOverridden) {
			setBaseValueChanged(isValueOverridden(watchTextFieldValue));
		}
	}, [watchTextFieldValue, isValueOverridden]);

	// URL Tooltip handling
	const handleTooltipOpen = textFieldValue => {
		const value = textFieldValue ?? defaultValue;
		if (value && typeof value === 'string') {
			setShowUrlTooltip(value?.split(' ')?.some(subString => validator.isURL(subString, { require_protocol: false })));
		} else {
			setShowUrlTooltip(false);
		}
	};

	// Render function for TextField
	const renderTextField = ({ field } = {}) => {
		const textFieldValue = field ? field.value : value;
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
					inputRef={inputRef || field?.ref || null}
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
									field?.onChange?.(newValue);
									if (!onChange && !field?.onChange) {
										setValue(newValue);
									}
								}}
							/>
						) : endAdornmentProps?.type ? (
							<InputAdornment position="end">{renderAdornment(textFieldValue, endAdornmentProps)}</InputAdornment>
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
						field?.onChange?.(e);
						if (!onChange && !field?.onChange) {
							setValue(newValue);
						}
					}}
					onBlur={e => {
						let newValue = e.target.value || '';
						if (onBlur) {
							newValue = onBlur(newValue);
							if (newValue != null) {
								onChange?.(newValue);
								field?.onChange?.(newValue);
							}
						}
					}}
					{...propsRest}
				/>

				{showUrlTooltip && (
					<UrlTooltip
						value={textFieldValue || defaultValue}
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
