import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useLazyQuery } from '@apollo/client';
import _, { debounce } from 'lodash';

import { tableController } from 'hookstate/tableController';
import { GET_ES_SIMPLE_FILTER } from 'graphQL/useQueryESSimpleFilter';
import { formatDate, setStateIfDeepEqual } from 'components/Shared/functions';
import vf_currency from "components/Shared/valueformatters/vf_currency.js";

function ESAutoCompleteFilter({
	tableKey,
	esIndex,
	column: { field, label, type, custom, defaultFilterOptions = [], setFilterValue, filterValue, filterSelectOptions, isComposite },
	extendSearchQuery,
	multiple,
}) {
	if (isComposite) field = field.split(',')
	const searchMode = type === 'date' ? 'FE' : 'BE'
	const searchMapping = {
		FE: {
			size: 10000,
			searchText: () => "*",
			filterOptions: undefined
		},
		BE: {
			size: 100,
			searchText: () => searchText.current,
			filterOptions: (options) => options
		}
	}

	const [getFilters, { data: filtersData, loading }] = useLazyQuery(GET_ES_SIMPLE_FILTER, { fetchPolicy: 'no-cache' });

	const [options, setOptions] = useState([]);
	const hasMore = useRef(true);
	const searchText = useRef('');
	const appendOptions = useRef(false);
	const filtersRef = useRef(null);

	const { searchFields, filters, defaultFilters, advanceSearch } = tableController(tableKey).getValues([
		'searchFields',
		'filters',
		'defaultFilters',
		'advanceSearch',
	]);

	const getFiltersAction = debounce(({ afterKey } = {}) => {
		if (filtersData && multiple && filterValue?.length !== 0) return;

		const filtersArray = [...filters, ...defaultFilters];
		const currentFilterRef = {
			filters,
			defaultFilters,
			searchText: searchMapping[searchMode].searchText(),
			afterKey
		}
		if (!_.isEqual(currentFilterRef, filtersRef.current)) {
			let search = ''
			if (searchText.current) search = type === 'number' ? searchText.current : `*${searchText.current}*`;
			filtersRef.current = currentFilterRef;
			getFilters({
				variables: {
					esIndex,
					index: esIndex,
					filters: typeof field === 'string' ? filtersArray.filter(
						filter => filter?.field !== field?.replace('.keyword', '')
					) : filtersArray,
					filterKeys: typeof field !== 'string' ? field : undefined,
					filterKey: typeof field === 'string' ? field : undefined,
					search: { query: extendSearchQuery, fields: searchFields, advanceSearch },
					extendSearchQuery,
					size: 10,
					key_as_string: custom?.key_as_string,
					multi_filter_keys: custom?.multi_filter_keys,
					filterAggs: {
						query: search,
						field: typeof field === 'string' ? field : undefined,
						fields: typeof field !== 'string' ? field : undefined,
						size: searchMapping[searchMode].size,
						afterKey
					},
				},
			});
		}
	}, 700);

	useEffect(() => {
		const hits = filtersData?.getESSimpleFilter?.hits;

		if (!hits) return;

		let options = hits.map(({ key }) => ({
			label: Array.isArray(key) ? key.join(' ') : key,
			value: key
		}));

		if (type === 'date') {
			options = hits.map(({ key_as_string, key }) => {
			  if (key_as_string) {
				return {
				  label: formatDate(key_as_string),
				  value: key_as_string,
				};
			  }
			  return {
					label: key,
					value: key
				}		  
			});

			options = _.uniqWith(options, (a, b) => a.label === b.label);
		}

		options = options.filter((op) => {
			op.label = formatValue(op.label) // format value to show $ sign as prefix
			return op.value;
		});

		if (appendOptions.current) {
			appendOptions.current = false
			setOptions(prevOptions => [...prevOptions, ...options]);
		}
		else
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
		} else if (typeof filterValue === 'boolean' || type === "defaultFiltersOptions") {
			// If there are default filters, use them 
			const requiredFilterValue = defaultFilterOptions?.find((option) => option?.value === filterValue)?.label;
			filterValue = requiredFilterValue;
		}
	}
	const id = Array.isArray(field) ? field.join(' ') : field;
	// Filter out the options
	const requiredOptions = defaultFilterOptions?.length > 0 ? defaultFilterOptions : (multiple ? options?.filter(item => !filterValue.includes(item.value)) : options);

	// format value to show filter value & option with $ sign as prefix
	const formatValue = (value) => {
		if (field === 'shapeJson.properties.uMaxUnitPricing.keyword' || field === 'shapeJson.properties.uUnitPricing.keyword') {
			value = vf_currency(value);
		}
		return value;
	}

	const handleScroll = (event) => {
		const bottom = event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;
		if (bottom && hasMore.current && !loading) {
			appendOptions.current = true
			getFiltersAction({ afterKey: options[options.length - 1].value })
		}
	};

	return (
		<Autocomplete
			multiple={multiple}
			id={`${id}-filter-autocomplete`}
			options={requiredOptions}
			loading={loading}
			filterOptions={searchMapping[searchMode].filterOptions}
			value={formatValue(filterValue)}
			renderInput={params => (
				<TextField
					{...params}
					inputProps={{
						...params.inputProps,
						value: filterSelectOptions
							? filterSelectOptions.find(op => op.value === params.inputProps.value)?.label || ''
							: params?.inputProps?.value,
						'data-testid': `${multiple ? 'multi' : 'single'}-filter-${label}`,
					}}
					data-testid={`mrt-grid-filter-text-field-${label}`}
					placeholder={`Filter by ${label}`}
					variant="standard"
					onChange={e => {
						searchText.current = e.target.value
						getFiltersAction()
					}}
					onFocus={e => {
						searchText.current = e.target.value
						getFiltersAction()
					}}
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

				let value = multiple
					? option.map(option => {
						if (typeof option === 'object') {
							return option.value
						} else {
							const foundOption = _.find(options, { label: option });
							return foundOption ? foundOption.value : option;
						}
					})
					: option.value;

				if (type === 'date') {
					value = formatDate(value)
				}
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
			ListboxProps={{
				onScroll: handleScroll,
			}}

		/>
	);
}

export default ESAutoCompleteFilter;
