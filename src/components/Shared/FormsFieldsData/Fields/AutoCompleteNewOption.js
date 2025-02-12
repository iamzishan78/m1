import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

import { Typography } from '@material-ui/core';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';

import { Grid, TextField, CircularProgress } from '@mui/material';

import { useApolloClient } from '@apollo/client';
import { debounce } from 'lodash';
import loadashFilter from 'lodash/filter';

function AutoCompleteNewOption({ control, item }) {
	const { name, label, defaultOptions = [], variables, query, getOptions, onChange, isESSearch } = item;

	const client = useApolloClient();
	const [options, setOptions] = useState(defaultOptions);
	const [loading, setLoading] = useState(false); // state to manage loading

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
						getOptionSelected={(option, value) => option.value === value.value}
						loading={loading}
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
						value={options.find(option => option.value === value) || null}
						onChange={(e, option) => {
							if (option && option._id === 'newEntity') {
								const newOption = { label: option.label, value: option.value };
								setOptions(prev => [...prev, newOption]);
							}
							onChange ? onChange(option?.value) : onInputChange(option ? option.value : null);
						}}
						filterOptions={(options, params) => {
							const inputValue = params.inputValue;
							const filtered = createFilterOptions()(options, { ...params, inputValue });
							const isExist = loadashFilter(filtered, filter => {
								return filter._id === inputValue;
							});
							// Suggest the creation of a new value
							if (inputValue !== '' && (!isExist || isExist.length === 0)) {
								filtered.unshift({
									label: inputValue,
									value: inputValue,
									_id: 'newEntity',
								});
							}
							return filtered;
						}}
						renderOption={option => {
							if (option?._id === 'newEntity') {
								return <Typography style={{ color: 'midnightblue' }}>Add &apos;{option.label}&apos;</Typography>;
							}

							return (
								<Grid container spacing={0}>
									<Grid container item xs={12} alignItems="center">
										<Grid item xs>
											<span style={{ fontWeight: 400 }}>{option.label}</span>
										</Grid>
									</Grid>
								</Grid>
							);
						}}
						renderInput={params => (
							<TextField
								{...params}
								size="small"
								variant="standard"
								onChange={async event => {
									if (isESSearch) {
										callQuery(event.target.value);
									}
								}}
								onBlur={onBlur}
								inputRef={ref}
							/>
						)}
					/>
				)}
			/>
		</Grid>
	);
}

export default AutoCompleteNewOption;
