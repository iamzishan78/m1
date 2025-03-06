import React, { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';

import { Grid, TextField, Autocomplete, CircularProgress, Typography, createFilterOptions, Box } from '@mui/material';

import { useApolloClient } from '@apollo/client';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';

function CustomAutoComplete({
	control = null,
	watch = null,
	error = null,
	fieldEvents: { onChange = null } = {},
	fieldConfig: {
		disabled = false,
		required = false,
		size = 'small',
		variant = 'standard',
		margin = '',
		layout = 'vertical',
		titleComponent = 'h3',
	} = {},
	fieldAttributes: {
		name = '',
		title = null,
		label = '',
		value = null,
		defaultValue = null,
		defaultOptions = [],
		query = null,
		variables = {},
		getOptions = options => options,
		isESSearch = false,
	} = {},
	...propsRest
}) {
	const client = useApolloClient();
	const filter = createFilterOptions({ stringify: option => option.value || option });
	const [options, setOptions] = useState(Array.isArray(defaultOptions) ? defaultOptions : []);
	const [loading, setLoading] = useState(false);
	const watchValue = watch ? watch(name) : '';

	const fetchOptions = debounce(async value => {
		if (!query) {return;}
		setLoading(true);
		setOptions([]);
		try {
			const res = await client.query({
				variables: isESSearch ? { ...variables, search: { ...variables.search, query: value } } : variables,
				query,
			});
			if (res) {setOptions(getOptions(res));}
			else {setOptions([]);}
		} catch (err) {
			console.error('Error fetching options:', err);
		}
		setLoading(false);
	}, 500);

	useEffect(() => {
		fetchOptions('');
	}, []);

	const getOptionLabel = option => {
		if (!option) {return '';}
		if (typeof option === 'string') {return option;}
		return option.label || option.value || option.name || '';
	};

	const getOptionSelected = (option, value) => {
		if (option?._id && value._id) {return option._id === value._id;}
		else {return option.value == value.value;}
	};

	const autoCompleteChnage = (option, fieldOnChange) => {
		const val = onChange?.(option?.value || option);
		fieldOnChange?.(option ? (val ?? option.value) : null);
	};

	const filterOptions = (options, params) => {
		let filtered = filter(options, params);
		const inputValue = params.inputValue || '';
		const isExisting =
			Array.isArray(filtered) &&
			filtered.some(option => (option.value ? option.value === inputValue : option === inputValue));
		if (inputValue !== '' && !isExisting) {
			filtered = [...filtered, { id: 'newEntity', value: inputValue }];
		}

		return filtered;
	};

	const renderOption = (props, option) => {
		if (option?.id === 'newEntity') {
			return (
				<Typography
					style={{ color: 'midnightblue', paddingLeft: '12px' }}
				>{`Add '${option.value || option}'`}</Typography>
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
				options={options}
				loading={loading}
				disabled={disabled}
				defaultValue={defaultValue}
				filterOptions={filterOptions}
				renderOption={renderOption}
				getOptionLabel={getOptionLabel}
				getOptionSelected={getOptionSelected}
				noOptionsText={loading ? <CircularProgress size={20} /> : 'No options'}
				value={(field?.value && options.find(opt => opt.value === field?.value)) || value || null} //ternary ???
				onChange={(_, newValue) => autoCompleteChnage(newValue, field?.onChange)}
				renderInput={params => (
					<TextField
						{...params}
						size={size}
						label={label}
						margin={margin}
						variant={variant}
						onBlur={field?.onBlur}
						helperText={error?.message}
						error={required && !watchValue && error}
						onChange={event => isESSearch && fetchOptions(event.target.value)}
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
	}),
	fieldConfig: PropTypes.shape({
		disabled: PropTypes.bool,
		required: PropTypes.bool,
		size: PropTypes.string,
		variant: PropTypes.string,
		margin: PropTypes.string,
		layout: PropTypes.string,
		titleComponent: PropTypes.string,
	}),
	fieldAttributes: PropTypes.shape({
		name: PropTypes.string,
		title: PropTypes.string,
		label: PropTypes.string,
		value: PropTypes.any,
		defaultValue: PropTypes.any,
		defaultOptions: PropTypes.array,
		query: PropTypes.object,
		variables: PropTypes.object,
		getOptions: PropTypes.func,
		isESSearch: PropTypes.bool,
	}),
	propsRest: PropTypes.object,
};

export default CustomAutoComplete;
