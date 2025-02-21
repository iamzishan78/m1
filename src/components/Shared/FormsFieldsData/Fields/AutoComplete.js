import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

import { Grid, TextField, Autocomplete, CircularProgress } from '@mui/material';

import { useApolloClient } from '@apollo/client';
import { debounce } from 'lodash';

function AutoCompleteComponent({ control, item, watch, error }) {
	const {
		name,
		label,
		defaultOptions = [],
		variables,
		query,
		getOptions,
		onChange,
		isESSearch,
		required = false,
		disabled = false,
	} = item;

	const client = useApolloClient();
	const [options, setOptions] = useState(defaultOptions);
	const [loading, setLoading] = useState(false); // state to manage loading

	const watchAutoComplete = watch(name);

	const callQuery = debounce(async value => {
		if (query) {
			setLoading(true);
			setOptions([]);
			try {
				let res;
				if (value && isESSearch) {
					res = await client.query({
						variables: {
							...variables,
							search: {
								...variables?.search,
								query: value,
							},
						},
						query,
					});
				} else {
					res = await client.query({
						variables,
						query,
					});
				}
				let filterData = getOptions(res);

				// Filter out duplicates
				filterData = filterData.filter(d => !defaultOptions.some(option => d.value === option.value));

				// Add default options at the end
				filterData = [...filterData, ...defaultOptions.map(option => option.label)];

				// Normalize data
				filterData = filterData.map(item => {
					if (typeof item === 'string') {
						return { label: item.trim(), value: item.trim() };
					} else {
						return item;
					}
				});

				setOptions(filterData);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
			setLoading(false);
		}
	}, 500);

	useEffect(() => {
		callQuery('');
	}, []);

	return (
		<Grid item xs={12}>
			<h3>{label}</h3>

			<Controller
				control={control}
				name={name}
				render={({ field: { onChange: onInputChange, value, onBlur, ref } }) => (
					<Autocomplete
						options={options}
						getOptionLabel={option => option.label}
						getOptionSelected={(option, value) => option.value == value.value}
						loading={loading}
						disabled={disabled}
						loadingText={
							loading ? (
								<div style={{ textAlign: 'center' }}>
									<CircularProgress />
								</div>
							) : (
								''
							)
						}
						noOptionsText={
							loading ? (
								<div style={{ textAlign: 'center' }}>
									<CircularProgress />
								</div>
							) : (
								'No Record Found'
							)
						}
						value={options.find(option => option.value === value?.toString()) || null}
						onChange={(e, option) => {
							onChange?.(option?.value);
							onInputChange(option ? option.value : null);
						}}
						renderInput={params => (
							<TextField
								{...params}
								size="small"
								multiline
								variant="standard"
								onChange={async event => {
									if (isESSearch) {
										callQuery(event.target.value);
									}
								}}
								onBlur={onBlur}
								inputRef={ref}
								error={required && !watchAutoComplete && error}
								helperText={error?.message}
							/>
						)}
					/>
				)}
			/>
		</Grid>
	);
}

export default AutoCompleteComponent;
