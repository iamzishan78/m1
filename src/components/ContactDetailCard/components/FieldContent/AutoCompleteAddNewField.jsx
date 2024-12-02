import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { get, uniq } from 'lodash';
import { TextField, Typography, Grid } from '@material-ui/core';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { GET_ES_FILTER_LIST } from 'graphQL/useQueryESFilterList';
import loadashFilter from 'lodash/filter';

const filter = createFilterOptions();

// @param {Object} queryParams
// @param {String} queryParams.esIndex
// @param {String} queryParams.filterKey
// @param {Number} queryParams.size
// @param {function} onChange
// @param {any} value
// @param {function} onKeyDown
// @param {function} onBlur
// @param {[String]} defaultOptions
// @param {Object} inputProps

const AutoCompleteAddNewField = forwardRef(
	({ queryParams, onChange, value, onKeyDown, onBlur, defaultOptions, inputProps, ...other }, ref) => {
		const [search, setSearch] = useState(value);
		const [getFilters, { data: esFilter, loading }] = useLazyQuery(GET_ES_FILTER_LIST, {
			fetchPolicy: 'no-cache',
		});

		useEffect(() => {
			getFilters({
				variables: queryParams,
			});
		}, []);

		useImperativeHandle(ref, () => ({
			updateDefaultValue: value => {
				setSearch(value);
			},
		}));

		const onInputChange = (event, value) => {
			setSearch(value);
		};

		const options = uniq([...defaultOptions, ...get(esFilter, 'getESFilterList.hits', []).map(doc => doc.key)]);

		return (
			<Autocomplete
				value={search ? { _id: search, name: search } : {}}
				getOptionSelected={(option, value) => option.name === value.name}
				onInputChange={onInputChange}
				getOptionLabel={option => {
					if (option?.name) return option.name;
					else return '';
				}}
				renderOption={option => {
					if (option?._id === 'newEntity')
						return <Typography style={{ color: 'midnightblue' }}>Add '{option.name}'</Typography>;

					return (
						<Grid container spacing={0}>
							<Grid container item xs={12} alignItems="center">
								<Grid item xs>
									<span style={{ fontWeight: 400 }}>{option.name}</span>
								</Grid>
							</Grid>
						</Grid>
					);
				}}
				filterOptions={(options, params) => {
					let inputValue = JSON.parse(JSON.stringify(search || ''));
					if (inputValue.name) {
						inputValue = inputValue.name;
					}
					const filtered = filter(options, { ...params, inputValue });
					const isExist = loadashFilter(filtered, filter => {
						return filter._id === inputValue;
					});
					// Suggest the creation of a new value
					if (inputValue !== '' && (!isExist || isExist.length === 0)) {
						filtered.unshift({
							name: inputValue,
							_id: 'newEntity',
						});
					}
					return filtered;
				}}
				onChange={(event, newValue) => {
					if (newValue && newValue._id) {
						if (newValue._id !== 'newEntity') onChange(newValue);
						else onChange({ _id: 'newEntity', name: newValue.name });
					} else setSearch('');
				}}
				options={options.map(op => ({ name: op, _id: op }))}
				loading={loading}
				onKeyDown={onKeyDown}
				onBlur={onBlur}
				renderInput={params => (
					<TextField
						{...params}
						InputProps={{
							...params.InputProps,
						}}
						size="small"
						{...inputProps}
					/>
				)}
				{...other}
			/>
		);
	}
);

export default AutoCompleteAddNewField;
