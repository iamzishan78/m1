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
	fieldEvents: { onChange = null, onBlur = () => {}, onInputSearchChange = null } = {},
	fieldConfig: {
		margin = '',
		size = 'small',
		chipStyles = {},
		required = false,
		disabled = false,
		multiple = false,
		layout = 'vertical',
		inputClassName = '',
		variant = 'standard',
		titleComponent = 'h3',
		allowNewOptions = false,
		textFieldInputProps = {},
		renderOptionComp = null,
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
		defaultOptions = null,
		inputSearchText = null,
		getOptions = options => options,
	} = {},
	...propsRest
}) {
	const client = useApolloClient();
	const filter = createFilterOptions();
	const [options, setOptions] = useState(Array.isArray(defaultOptions) ? defaultOptions : []);
	const [loading, setLoading] = useState(false);
	const watchValue = watch ? watch(name) : '';

	useEffect(() => {
		setOptions(defaultOptions);
	}, [defaultOptions]);

	const fetchOptions = debounce(async value => {
		if (!query) {
			return;
		}
		setLoading(true);
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
		setLoading(false);
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
		return option.label || option.value || option.name || '';
	};

	const getOptionSelected = (option, value) => {
		if (option?._id && value._id) {
			return option._id === value._id;
		} else {
			return option.value === value.value || option.name === value.name;
		}
	};

	const autoCompleteChnage = (newOpt, oldOpt, fieldOnChange) => {
		const value = newOpt ? newOpt.value || newOpt : null;
		onChange?.(value, oldOpt);
		fieldOnChange?.(value);
	};

	const textFieldChange = event => {
		const value = event.target.value;
		isESSearch && fetchOptions(value);
		onInputSearchChange?.(value);
	};

	const getValue = fieldValue => {
		if (multiple) {
			return typeof fieldValue === 'string' ? [fieldValue] : fieldValue || [];
		}

		return (fieldValue && options.find(opt => opt.value === fieldValue || opt === fieldValue)) || value || null;
	};

	const getOptionsArray = value => {
		if (!multiple) {
			return options;
		}
		const optArray = options.filter(opt => !value?.some(selected => getOptionLabel(selected) === getOptionLabel(opt)));
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

		if (renderOptionComp)
			return (
				<Grid container spacing={0} {...props}>
					{renderOptionComp(option)}
				</Grid>
			);

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
				loading={loading}
				disabled={disabled}
				defaultValue={defaultValue}
				renderOption={renderOption}
				multiple={multiple ?? false}
				filterOptions={filterOptions}
				getOptionLabel={getOptionLabel}
				getOptionSelected={getOptionSelected}
				value={getValue(field?.value ?? null)}
				options={getOptionsArray(field?.value)}
				noOptionsText={loading ? <CircularProgress size={20} /> : 'No options'}
				onChange={(_, newValue) => autoCompleteChnage(newValue, field?.value, field?.onChange)}
				onBlur={event => {
					onBlur?.(event);
					field?.onBlur?.(event);
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
					/>
				)}
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
		onInputSearchChange: PropTypes.func,
	}),
	fieldConfig: PropTypes.shape({
		margin: PropTypes.string,
		size: PropTypes.string,
		chipStyles: PropTypes.object,
		required: PropTypes.bool,
		disabled: PropTypes.bool,
		multiple: PropTypes.bool,
		layout: PropTypes.string,
		inputClassName: PropTypes.string,
		variant: PropTypes.string,
		titleComponent: PropTypes.string,
		allowNewOptions: PropTypes.bool,
	}),
	fieldAttributes: PropTypes.shape({
		name: PropTypes.string,
		label: PropTypes.string,
		title: PropTypes.string,
		value: PropTypes.any,
		query: PropTypes.object,
		variables: PropTypes.object,
		isESSearch: PropTypes.bool,
		defaultValue: PropTypes.any,
		defaultOptions: PropTypes.array,
		inputSearchText: PropTypes.string,
		getOptions: PropTypes.func,
	}),
	propsRest: PropTypes.object,
};

export default CustomAutoComplete;
