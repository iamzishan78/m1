import React, { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';

import { AddIcCall, Autorenew, EmailOutlined, Textsms, Voicemail } from '@mui/icons-material';
import { CircularProgress, Grid, IconButton, InputAdornment, TextField, Tooltip, Box } from '@mui/material';

import PropTypes from 'prop-types';
import validator from 'validator';

import DailpadIcon from 'components/Shared/components/svgIcons/DailpadIcon';

import UrlTooltip from './UrlTooltip';

const sx = {
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
	adornmentIcon: {
		cursor: 'pointer',
		padding: '8px',
	},
	inputFieldContainer: {
		position: 'relative',
		'#adornment-icon': {
			visibility: 'hidden',
			opacity: 0,
			transition: 'visibility 0.3s, opacity 0.3s ease-in-out',
		},
		'&:hover #adornment-icon': {
			visibility: 'visible',
			opacity: 1,
		},
	},
};

// Define a configuration object for adornments
const adornmentConfig = {
	email: {
		icons: [
			{
				showIcon: () => true,
				icon: <EmailOutlined htmlColor="#757575" />,
				tooltip: 'Email',
				action: value => `mailto: ${value}`,
			},
			{
				showIcon: (dialpadIds, dialpadFeature) => dialpadIds?.length > 0 && dialpadFeature,
				icon: <DailpadIcon htmlColor="#757575" />,
				tooltip: 'Dialpad',
			},
		],
	},
	phoneNumber: {
		icons: [
			{
				showIcon: () => true,
				icon: <Voicemail htmlColor="#757575" />,
				tooltip: 'Voice Mail',
				action: (value, handleAction) => handleAction({ phoneNumber: value, type: 'call' }),
			},
			{
				showIcon: () => true,
				icon: <Textsms htmlColor="#757575" />,
				tooltip: 'Text SMS',
				action: (value, handleAction) => handleAction({ phoneNumber: value, type: 'text_message' }),
			},
			{
				showIcon: (dialpadIds, dialpadFeature) => dialpadIds?.length > 0 && dialpadFeature,
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
			{
				showIcon: (dialpadIds, dialpadFeature) => dialpadIds?.length > 0 && dialpadFeature,
				icon: <DailpadIcon htmlColor="#757575" />,
				tooltip: 'Dialpad',
			},
		],
	},
	loading: {
		component: <CircularProgress size={22} color="primary" />,
	},
};

// Function to render adornments
function renderAdornment({ value, type, handleAction, dialpadFeature, dialpadIds }) {
	const config = adornmentConfig[type];
	if (!config) {
		return null;
	}

	if (config.component) {
		return config.component;
	}

	if (config.icons) {
		return config.icons.map(
			iconConfig =>
				iconConfig.showIcon(dialpadIds, dialpadFeature) && (
					<InputAdornment position="end" key={iconConfig.tooltip}>
						<Tooltip title={iconConfig.tooltip} placement="top">
							<IconButton
								id={'adornment-icon'}
								style={sx.adornmentIcon}
								href={iconConfig.href?.(value, dialpadFeature, dialpadIds)}
								onClick={() => iconConfig.action?.(value, handleAction, dialpadFeature, dialpadIds)}
							>
								{iconConfig.icon}
							</IconButton>
						</Tooltip>
					</InputAdornment>
				)
		);
	}

	return (
		<InputAdornment position="end">
			<Tooltip title={config.tooltip} placement="top">
				<IconButton id="adornment-icon" className={sx.adornmentIcon} href={config.action(value)}>
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
		customGridSpacing = 2,
	} = {},
	fieldAttributes: {
		name = '',
		value: _value = '',
		label = null,
		title = null,
		titleComponent = 'h3',
		inputRef = null,
		helperText = '',
		placeholder = '',
		InputProps = {},
		InputLabelProps = {},
		defaultValue = null,
		isValueOverridden = () => false,
		resetOveriddenValue,
		endAdornmentProps,
		layout = 'vertical',
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
	}, [watchTextFieldValue]);

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
			<Box sx={sx.inputFieldContainer}>
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
					sx={{ ...propsRest.sx, ...(baseValueChanged ? sx.baseValueChanged : sx.maxWidth) }}
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
							<InputAdornment position="end">
								{renderAdornment({ value: textFieldValue, ...endAdornmentProps })}
							</InputAdornment>
						) : (
							InputProps.endAdornment
						),
					}}
					InputLabelProps={InputLabelProps}
					error={required && !watchTextFieldValue && error}
					helperText={error?.message ?? helperText}
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
						field?.onBlur?.(e);
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
			</Box>
		);
	};

	const titleXs = layout === 'horizontal' ? 3 : 12;
	const fieldXs = layout === 'horizontal' ? 9 : 12;

	return (
		<Grid container spacing={customGridSpacing}>
			{title && (
				<Grid item xs={titleXs} sx={{ display: 'flex', alignItems: 'center' }}>
					<Box component={titleComponent}>{title}</Box>
				</Grid>
			)}
			<Grid item xs={fieldXs}>
				{control ? (
					<Controller control={control} name={name} render={props => renderTextField(props)} />
				) : (
					renderTextField()
				)}
			</Grid>
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
