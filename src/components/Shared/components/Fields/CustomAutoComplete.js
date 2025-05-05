import React, { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';

import CloseIcon from '@mui/icons-material/Close';
import {
	Grid,
	TextField,
	Autocomplete,
	CircularProgress,
	Typography,
	createFilterOptions,
	Box,
	Chip,
} from '@mui/material';

import { useApolloClient } from '@apollo/client';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';

function CustomAutoComplete({
	control = null,
	watch = null,
	error = null,
	fieldEvents: { onChange = null, onBlur = () => {}, onTextFieldChange = null } = {},
	fieldConfig: {
		margin = '',
		size = 'small',
		chipStyles = {},
		loading = false,
		required = false,
		disabled = false,
		multiple = false,
		layout = 'vertical',
		inputClassName = '',
		variant = 'standard',
		titleComponent = 'h3',
		allowNewOptions = false,
		renderOptionComp = null,
		textfieldRestProps = {},
		textFieldInputProps = {},
		getCustomOptionLabel = null,
	} = {},
	fieldAttributes: {
		name = '',
		label = '',
		title = null,
		value = null,
		query = null,
		variables = {},
		placeholder = '',
		isESSearch = false,
		defaultValue = null,
		optionArray = null,
		inputSearchText = null,
		getOptions = options => options,
	} = {},
	...propsRest
}) {
	const client = useApolloClient();
	const filter = createFilterOptions();
	const [options, setOptions] = useState([]);
	const [fieldValue, setFieldValue] = useState(null);
	const [isLoading, setIsLoading] = useState(loading);
	const watchValue = watch ? watch(name) : '';

	useEffect(() => {
		setOptions(Array.isArray(optionArray) ? optionArray : []);
	}, [optionArray]);

	useEffect(() => {
		if (value) {setFieldValue(value ?? null);}
		else {setFieldValue(defaultValue ?? null);}
	}, [value, defaultValue]);

	useEffect(() => {
		setIsLoading(loading);
	}, [loading]);

	const fetchOptions = debounce(async value => {
		if (!query) {
			return;
		}
		setIsLoading(true);
		setOptions([]);
		try {
			const res = await client.query({
				variables: isESSearch ? { ...variables, search: { ...variables.search, query: value } } : variables,
				query,
			});
			if (res) {
				setOptions(getOptions(res));
			} else {
				setOptions([]);
			}
		} catch (err) {
			console.error('Error fetching options:', err);
		}
		setIsLoading(false);
	}, 500);

	useEffect(() => {
		fetchOptions('');
	}, []);

	const getOptionLabel = option => {
		if (!option) {
			return '';
		}
		if (typeof option === 'string') {
			return option;
		}
		if (getCustomOptionLabel) {
			return getCustomOptionLabel(option);
		} else {
			return option.label || option.value || option.name || '';
		}
	};

	const getOptionSelected = (option, value) => {
		if (option?._id && value._id) {
			return option._id === value._id;
		} else {
			return option.value === value.value || option.name === value.name;
		}
	};

	const autoCompleteChnage = ({ reason, newValue, oldValue, fieldOnChange }) => {
		const value = newValue ? (newValue.value ?? newValue) : null;
		onChange?.({ value, oldValue, reason });
		fieldOnChange ? fieldOnChange(value) : setFieldValue(value);
	};

	const textFieldChange = event => {
		const value = event.target.value;
		setFieldValue(value);
		query && fetchOptions(value);
		onTextFieldChange?.(value);
	};

	const getValue = fieldValue => {
		if (multiple) {
			return typeof fieldValue === 'string' ? [fieldValue] : fieldValue || [];
		}

		const fallbackValue = value || defaultValue || null;

		if (!fieldValue) {
			return fallbackValue;
		}

		if (typeof fieldValue === 'string') {
			return options?.find(opt => opt.value === fieldValue || opt === fieldValue) || fieldValue;
		}

		return options?.find(opt => getOptionLabel(opt) === getOptionLabel(fieldValue)) || fieldValue;
	};

	const getOptionsArray = value => {
		if (!multiple) {
			return options;
		}
		const optArray = options?.filter(opt => !value?.some(selected => getOptionLabel(selected) === getOptionLabel(opt)));
		return optArray;
	};

	const filterOptions = (options, params) => {
		let filtered = filter(options, params);
		const inputValue = params.inputValue || '';

		const isExisting =
			Array.isArray(filtered) &&
			filtered.some(option => (option.value ? option.value === inputValue : option === inputValue));

		if (inputValue !== '' && !isExisting && allowNewOptions) {
			filtered = [...filtered, { id: 'newEntity', value: inputValue }];
		}

		return filtered;
	};

	const renderOption = (props, option) => {
		if (option?.id === 'newEntity') {
			return (
				<Typography
					{...props}
					style={{ color: 'midnightblue', paddingLeft: '12px' }}
				>{`Add '${option.value || option}'`}</Typography>
			);
		}

		if (renderOptionComp) {
			return (
				<Grid container spacing={0} {...props}>
					{renderOptionComp({ props, option })}
				</Grid>
			);
		}

		return (
			<Grid container spacing={0} {...props}>
				<Grid container item xs={12} alignItems="center">
					<Grid item xs>
						<Typography variant="body2">{getOptionLabel(option)}</Typography>
					</Grid>
				</Grid>
			</Grid>
		);
	};

	const renderAutoComplete = ({ field } = {}) => {
		return (
			<Autocomplete
				loading={isLoading}
				disabled={disabled}
				defaultValue={defaultValue}
				renderOption={renderOption}
				multiple={multiple ?? false}
				filterOptions={filterOptions}
				getOptionLabel={getOptionLabel}
				getOptionSelected={getOptionSelected}
				value={getValue(field?.value ?? fieldValue)}
				options={getOptionsArray(field?.value)}
				noOptionsText={isLoading ? <CircularProgress size={20} /> : 'No options'}
				onBlur={event => {
					onBlur?.(event);
					field?.onBlur?.(event);
				}}
				onChange={(_, value, reason) =>
					autoCompleteChnage({
						reason,
						newValue: value,
						oldValue: field?.value,
						fieldOnChange: field?.onChange,
					})
				}
				renderTags={(value, getTagProps) => {
					return value?.map((option, index) => (
						<Chip
							key={option}
							style={chipStyles}
							{...getTagProps({ index })}
							label={getOptionLabel(option)}
							deleteIcon={<CloseIcon style={{ color: 'white' }} />}
						/>
					));
				}}
				renderInput={params => (
					<TextField
						{...params}
						size={size}
						label={label}
						margin={margin}
						variant={variant}
						onBlur={field?.onBlur}
						placeholder={placeholder}
						onChange={textFieldChange}
						className={inputClassName}
						helperText={error?.message}
						error={required && !watchValue && error}
						value={(inputSearchText ?? params?.inputProps?.value) || ''}
						InputProps={{
							...params.InputProps,
							...textFieldInputProps,
						}}
						{...textfieldRestProps}
					/>
				)}
				{...propsRest}
			/>
		);
	};

	const titleXs = layout === 'horizontal' ? 3 : 12;
	const fieldXs = layout === 'horizontal' ? 9 : 12;

	return (
		<Grid container spacing={1}>
			{title && (
				<Grid item xs={titleXs} sx={{ display: 'flex', alignItems: 'center' }}>
					<Box component={titleComponent}>{title}</Box>
				</Grid>
			)}
			<Grid item xs={fieldXs}>
				{control ? (
					<Controller control={control} name={name} render={props => renderAutoComplete(props)} />
				) : (
					renderAutoComplete()
				)}
			</Grid>
		</Grid>
	);
}

CustomAutoComplete.propTypes = {
	control: PropTypes.object,
	watch: PropTypes.func,
	error: PropTypes.object,
	fieldEvents: PropTypes.shape({
		onChange: PropTypes.func,
		onBlur: PropTypes.func,
		onTextFieldChange: PropTypes.func,
	}),
	fieldConfig: PropTypes.shape({
		margin: PropTypes.string,
		size: PropTypes.string,
		chipStyles: PropTypes.object,
		loading: PropTypes.bool,
		required: PropTypes.bool,
		disabled: PropTypes.bool,
		multiple: PropTypes.bool,
		layout: PropTypes.string,
		inputClassName: PropTypes.string,
		variant: PropTypes.string,
		titleComponent: PropTypes.string,
		allowNewOptions: PropTypes.bool,
		renderOptionComp: PropTypes.func,
		textfieldRestProps: PropTypes.object,
		textFieldInputProps: PropTypes.object,
		getCustomOptionLabel: PropTypes.func,
	}),
	fieldAttributes: PropTypes.shape({
		name: PropTypes.string,
		label: PropTypes.string,
		title: PropTypes.node,
		value: PropTypes.any,
		query: PropTypes.object,
		variables: PropTypes.object,
		placeholder: PropTypes.string,
		isESSearch: PropTypes.bool,
		defaultValue: PropTypes.any,
		optionArray: PropTypes.array,
		inputSearchText: PropTypes.string,
		getOptions: PropTypes.func,
	}),
	propsRest: PropTypes.object,
};

export default CustomAutoComplete;
