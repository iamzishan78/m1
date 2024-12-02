import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
// QUERIES
import { AppContext } from 'AppContext';
import { useLazyQuery } from '@apollo/client';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { capitalizeFirstLetter, customStartCaseString } from 'components/Shared/functions';

export const SimpleAutoCompleteFilter = React.memo(function SimpleAutoCompleteFilter({
	filterList,
	onChange,
	index,
	column,
	query,
	extendSearchQuery,
	searchFields,
	esIndex,
	filters,
	custom,
	setFilters,
	multiple,
	...others
}) {
	const filterValue = multiple ? filterList[index].map(key => ({ key })) : { key: filterList[index][0] };
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(filterValue);
	const [search, setSearch] = useState(filterList[index][0]);
	const { label, filterKey, type } = column;
	useEffect(() => {
		setSearch(filterList[index][0]);
		if (!filterList[index][0]) {
			setValue(filterValue);
		}
	}, [filterList[index][0]]);

	useEffect(() => {
		if (!custom?.filterOptions) {
		} else {
			setOptions(custom?.filterOptions);
		}
	}, [filters]);

	const handleChange = search => {
		setSearch(search);
	};

	return (
		<Autocomplete
			multiple={multiple}
			id={`filter-autocomplete-${custom?.filterLabel || label}`}
			open={open}
			onOpen={() => {
				setOpen(true);
			}}
			onClose={() => {
				setOpen(false);
			}}
			disabled={others.disabled || false}
			value={multiple && !value ? [] : value}
			inputValue={customStartCaseString(search?.toString())}
			getOptionSelected={(option, value) => option.value === value.value}
			getOptionLabel={option =>
				customStartCaseString(capitalizeFirstLetter(option?.label?.toString().replace(/^\,|\,$/gm, '')))
			}
			onChange={(e, value2, reason) => {
				if (reason === 'clear' || (multiple && value2.length === 0) || (!multiple && !value2?.key)) {
					filterList[index].pop();
					setSearch('');
					setValue(multiple ? [] : {});
				} else {
					if (multiple) {
						filterList[index].length = 0;
						value2.forEach(v => {
							const val = typeof v.key === 'string' ? v.key.replace(/^\,|\,$/gm, '') : v.key;
							filterList[index].push(val);
						});
						setSearch(value2[value2.length - 1]?.key);
					} else {
						filterList[index][0] = value2.key;
						setSearch(value2.key);
					}

					setValue(value2);
					if (value2?.esKey) column.activeFilterKey = value2?.esKey;
				}
				if (setFilters) setFilters(filterList);

				column.filterList = filterList[index];
				onChange(filterList[index], index, column, value2?.esKey || '');
			}}
			options={[
				{ label: 'Completed', value: true },
				{ label: 'Not Completed', value: false },
			]}
			renderInput={params => (
				<TextField
					{...params}
					variant={others?.variant ? others?.variant : 'standard'}
					style={{ background: 'white' }}
					label={custom?.filterLabel || label}
					onChange={e => {
						handleChange(e.target.value);
					}}
					InputProps={{
						...params.InputProps,
						endAdornment: <React.Fragment>{params.InputProps.endAdornment}</React.Fragment>,
					}}
				/>
			)}
		/>
	);
});
