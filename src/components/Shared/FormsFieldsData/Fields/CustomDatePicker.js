import React, { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';

import { Grid, Box } from '@mui/material';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';

import dayjs from 'dayjs';
import PropTypes from 'prop-types';

function CustomDatePicker({
	watch = null,
	error = null,
	control = null,
	fieldEvents: { onChange = null } = {},
	fieldConfig: {
		margin = '',
		size = 'medium',
		disabled = false,
		required = false,
		fullWidth = true,
		autoFocus = false,
		variant = 'outlined',
		hasTime = false,
	} = {},
	fieldAttributes: {
		name = '',
		value: _value = null,
		label = null,
		title = null,
		titleComponent = 'h3',
		inputRef = null,
		helperText = '',
		placeholder = '',
		InputProps = {},
		InputLabelProps = {},
		layout = 'vertical',
		spacing = 2,
	} = {},
	...propsRest
}) {
	const [value, setValue] = useState(_value);

	const watchDateValue = watch ? watch(name) : '';

	useEffect(() => {
		setValue(_value);
	}, [_value]);

	const renderDatePicker = ({ field } = {}) => {
		const PickerComponent = hasTime ? DateTimePicker : DatePicker;

		const fieldValue = field?.value || value;

		return (
			<PickerComponent
				label={label}
				value={fieldValue ? dayjs(fieldValue) : null}
				onChange={newValue => {
					setValue(newValue);
					onChange?.(newValue);
					field?.onChange?.(newValue);
				}}
				disabled={disabled}
				slotProps={{
					textField: {
						variant,
						size,
						fullWidth,
						margin,
						autoFocus,
						placeholder,
						inputRef: inputRef || field?.ref || null,
						InputProps: {
							...InputProps,
						},
						InputLabelProps,
						error: required && !watchDateValue && error,
						helperText: error?.message ?? helperText,
					},
				}}
				{...propsRest}
			/>
		);
	};

	const titleXs = layout === 'horizontal' ? 3 : 12;
	const fieldXs = layout === 'horizontal' ? 9 : 12;

	return (
		<Grid container spacing={spacing}>
			{title && (
				<Grid item xs={titleXs} sx={{ display: 'flex', alignItems: 'center' }}>
					<Box component={titleComponent}>{title}</Box>
				</Grid>
			)}
			<Grid item xs={fieldXs}>
				{control ? (
					<Controller control={control} name={name} render={props => renderDatePicker(props)} />
				) : (
					renderDatePicker()
				)}
			</Grid>
		</Grid>
	);
}

CustomDatePicker.propTypes = {
	watch: PropTypes.func,
	error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
	control: PropTypes.object,
	fieldEvents: PropTypes.shape({
		onChange: PropTypes.func,
	}),
	fieldConfig: PropTypes.shape({
		margin: PropTypes.string,
		size: PropTypes.oneOf(['small', 'medium', 'large']),
		disabled: PropTypes.bool,
		required: PropTypes.bool,
		fullWidth: PropTypes.bool,
		autoFocus: PropTypes.bool,
		variant: PropTypes.oneOf(['standard', 'outlined', 'filled']),
		hasTime: PropTypes.bool,
	}),
	fieldAttributes: PropTypes.shape({
		name: PropTypes.string,
		value: PropTypes.string,
		label: PropTypes.string,
		inputRef: PropTypes.any,
		placeholder: PropTypes.string,
		InputProps: PropTypes.object,
		InputLabelProps: PropTypes.object,
	}),
	onChange: PropTypes.func,
	value: PropTypes.string,
};

export default CustomDatePicker;
