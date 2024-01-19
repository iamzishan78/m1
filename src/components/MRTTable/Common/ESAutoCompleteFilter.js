import React, { useEffect, useRef, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useLazyQuery } from '@apollo/client';
import _ from 'lodash';

import { tableController } from 'hookstate/tableController';
import { GET_ES_SIMPLE_FILTER } from 'graphQL/useQueryESSimpleFilter';
import { formatDate, setStateIfDeepEqual } from 'components/Shared/functions';

function ESAutoCompleteFilter({
	tableKey,
	esIndex,
	column: { field, label, type, custom, setFilterValue, filterValue, filterSelectOptions, isComposite },
	extendSearchQuery,
	multiple,
}) {
	if (isComposite) field = field.split(',')

	const [getFilters, { data: filtersData, loading }] = useLazyQuery(GET_ES_SIMPLE_FILTER, { fetchPolicy: 'no-cache' });

	const [options, setOptions] = useState([]);
	const filtersRef = useRef(null);

	const { searchFields, filters, defaultFilters } = tableController(tableKey).getValues([
		'searchFields',
		'filters',
		'defaultFilters',
	]);

	const getFiltersAction = search => {
		if (filtersData && multiple && filterValue?.length !== 0) return;

		if (search) search = type === 'number' ? search : `*${search}*`;

		const filtersArray = [...filters, ...defaultFilters];
		if (!_.isEqual(filtersArray, filtersRef.current)) {
			filtersRef.current = filtersArray;
			getFilters({
				variables: {
					esIndex,
					index: esIndex,
					filters: typeof field === 'string' ? filtersArray.filter(
						filter => filter?.field !== field?.replace('.keyword', '')
					) : filtersArray,
					filterKeys: typeof field !== 'string' ? field : undefined,
					filterKey: typeof field === 'string' ? field : undefined,
					search: { query: extendSearchQuery, fields: searchFields },
					extendSearchQuery,
					size: 10,
					key_as_string: custom?.key_as_string,
					multi_filter_keys: custom?.multi_filter_keys,
					filterAggs: {
						query: '',
						field: typeof field === 'string' ? field : undefined,
						fields: typeof field !== 'string' ? field : undefined,
						size: 100000,
					},
				},
			});
		}
	};

	useEffect(() => {
		const hits = filtersData?.getESSimpleFilter?.hits;

		if (!hits) return;

		let options = hits.map(({ key }) => ({
			label: Array.isArray(key) ? key.join(' ') : key,
			value: key
		}));

		if (type === 'date') {
			options = hits.map(({ key_as_string }) => ({
				label: formatDate(key_as_string),
				value: key_as_string,
			}));

			options = _.uniqWith(options, (a, b) => a.label === b.label);
		}

		options = options.filter(op => op.value);

		setStateIfDeepEqual(setOptions, filterSelectOptions || options);
	}, [filtersData, filterValue]);

	// If we have orFilter then filterValue is null due to id mismatch
	if (isComposite) {
		const key = field[0].replace('.keyword', '')
		const _field = filters.find((f) => f?.field === key)
		if (Array.isArray(_field?.value)) {
			filterValue = _field.value.join(' ')
		}
	}

	if (!filterValue || filterValue?.length === 0) {
		const filter = filters.find(filter => filter?.field.includes(field));
		if (filter) filterValue = filter?.value;
	}

	// Handle Filter Value is changed from Single Select to Multi Select and vice versa
	if (multiple && (typeof filterValue === 'string')) {
		filterValue = [];
	} else if (!multiple && Array.isArray(filterValue)) {
		filterValue = '';
	} else if (multiple && !Array.isArray(filterValue)) {
		filterValue = []
		tableController(tableKey).clearFilter(field.replace('.keyword', ''))
	} else if (type === 'date' && (typeof filterValue === 'string' ? filterValue : filterValue.length)) {
		if (typeof filterValue === 'string') {
			filterValue = formatDate(filterValue);
		} else if (typeof filterValue === 'object' && !Array.isArray(filterValue)) {
			const formattedGte = formatDate(filterValue?.gte);
			const formattedLte = formatDate(filterValue?.lte);
			filterValue = `${formattedGte} to ${formattedLte}`;
		} else if (Array.isArray(filterValue)) {
			filterValue = filterValue.map(val => formatDate(val));
		}
	}
	const id = Array.isArray(field) ? field.join(' ') : field
	return (
		<Autocomplete
			multiple={multiple}
			id={`${id}-filter-autocomplete`}
			options={multiple ? options?.filter(item => !filterValue.includes(item.value)) : options}
			loading={loading}
			value={filterValue}
			renderInput={params => (
				<TextField
					{...params}
					inputProps={{
						...params.inputProps,
						value: filterSelectOptions
							? filterSelectOptions.find(op => op.value === params.inputProps.value)?.label || ''
							: params?.inputProps?.value,
					}}
					placeholder={`Filter by ${label}`}
					variant="standard"
					onChange={e => getFiltersAction(e.target.value)}
					onFocus={e => getFiltersAction(e.target.value)}
				/>
			)}
			onChange={(e, option) => {
				if (!option || option.length === 0) {
					setFilterValue(null);
					if (Array.isArray(field)) {
						field.forEach(singleField => {
							tableController(tableKey).clearFilter(singleField.replace('.keyword', ''));
						});
					} else {
						tableController(tableKey).clearFilter(field.replace('.keyword', ''));
					}
					return;
				}

				const value = multiple
					? option.map(option => {
						if (typeof option === 'object') {
							return option.value
						} else {
							const foundOption = _.find(options, { label: option });
							return foundOption ? foundOption.value : option;
						}
					})
					: option.value;
				setFilterValue(value);

				if (Array.isArray(field)) {
					field.forEach(singleField => {
						tableController(tableKey).setFilter({
							field: singleField.replace('.keyword', ''),
							value,
						});
					});
				} else {
					tableController(tableKey).setFilter({
						field: field.replace('.keyword', ''),
						value,
					});
				}
			}}
		/>
	);
}

export default ESAutoCompleteFilter;
