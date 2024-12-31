import React, { useEffect, useRef, useState } from 'react';

import { Autocomplete, TextField } from '@mui/material';

import { useLazyQuery } from '@apollo/client';
import _, { debounce } from 'lodash';
import PropTypes from 'prop-types';

import { formatDate, setStateIfDeepEqual } from 'components/Shared/functions';
import vf_currency, { vf_currency_to_fixed } from 'components/Shared/valueformatters/vf_currency';
import vf_number from 'components/Shared/valueformatters/vf_number';

import { GET_ES_SIMPLE_FILTER } from 'graphQL/useQueryESSimpleFilter';

import { tableController } from 'hookstate/tableController';

const MIN_SEARCH_LENGTH = 700;
const MIN_FILTER_LENGTH = 2;

// format value to show filter value & option with $ sign as prefix
const formatValue = (value, field) => {
	if (
		field === 'shapeJson.properties.uMaxUnitPricing.keyword' ||
		field === 'shapeJson.properties.uUnitPricing.keyword'
	) {
		value = vf_currency(value);
	}
	if (Array.isArray(value)) {
		value = value.map(value => value || value === 0);
	}
	return value;
};

function ESAutoCompleteFilter({
	tableKey,
	esIndex,
	modelName,
	column: {
		field,
		label,
		type,
		custom,
		defaultFilterOptions = [],
		setFilterValue,
		filterValue,
		filterSelectOptions,
		isComposite,
	},
	extendSearchQuery,
	multiple,
	textFieldProps = {},
	_value,
}) {
	if (isComposite) {
		field = field.split(',');
	}
	const searchMode = type === 'date' ? 'FE' : 'BE';
	const searchText = useRef('');
	const searchMapping = {
		FE: {
			size: 10000,
			searchText: () => '*',
			filterOptions: undefined,
		},
		BE: {
			size: 100,
			searchText: () => searchText.current,
			filterOptions: options => options,
		},
	};

	const [getFilters, { data: filtersData, loading }] = useLazyQuery(GET_ES_SIMPLE_FILTER, { fetchPolicy: 'no-cache' });

	const [options, setOptions] = useState([]);
	const hasMore = useRef(true);
	const appendOptions = useRef(false);
	const filtersRef = useRef(null);

	const getFiltersAction = debounce(({ afterKey } = {}) => {
		const { searchFields, filters, defaultFilters, advanceSearch, sorting, defaultSort, TableSchema } = tableController(
			tableKey
		).getValues([
			'searchFields',
			'filters',
			'defaultFilters',
			'advanceSearch',
			'sorting',
			'defaultSort',
			'TableSchema',
		]);

		let sort = sorting[0]
			? {
					field: (() => {
						if (sorting[0].field) {
							return sorting[0].field;
						}

						const sortingId = sorting[0].id;
						const matchingSchema = TableSchema.find(val => (val.accessorKey || val.id) === sortingId);

						if (matchingSchema?.isComposite) {
							return matchingSchema.name.split(',')[0];
						}

						return matchingSchema?.name;
					})(),
					order: sorting[0].desc ? 'desc' : 'asc',
				}
			: defaultSort;

		const filtersArray = [...filters, ...defaultFilters];
		const currentFilterRef = {
			filters,
			defaultFilters,
			searchText: searchMapping[searchMode].searchText(),
			afterKey,
		};
		if (!_.isEqual(currentFilterRef, filtersRef.current)) {
			let search = '';
			if (searchText.current) {
				search = type === 'number' ? searchText.current : `*${searchText.current}*`;
			}
			filtersRef.current = currentFilterRef;
			getFilters({
				variables: {
					esIndex,
					modelName,
					index: esIndex,
					filters:
						typeof field === 'string'
							? filtersArray.filter(filter => filter?.field !== field?.replace('.keyword', ''))
							: filtersArray,
					filterKeys: typeof field !== 'string' ? field : undefined,
					filterKey: typeof field === 'string' ? field : undefined,
					search: { query: tableController(tableKey).getGlobalFilter(), fields: searchFields, advanceSearch },
					extendSearchQuery,
					size: 10,
					key_as_string: custom?.key_as_string,
					multi_filter_keys: custom?.multi_filter_keys,
					filterAggs: {
						query: search,
						field: typeof field === 'string' ? field : undefined,
						fields: typeof field !== 'string' ? field : undefined,
						size: searchMapping[searchMode].size,
						afterKey,
						fieldType: type,
					},
					sort,
				},
			});
		}
	}, MIN_SEARCH_LENGTH);

	useEffect(() => {
		const hits = filtersData?.getESSimpleFilter?.hits;

		if (!hits) {
			return;
		}

		let options = hits.map(({ key }) => {
			let label = key;

			if (Array.isArray(key)) {
				label = key.join(' ');
			}

			if (typeof label === 'object') {
				label = label.name || '';
			}

			return {
				label,
				value: key,
			};
		});

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
					value: key,
				};
			});

			options = _.uniqWith(options, (a, b) => a.label === b.label);
		}

		if (type === 'price') {
			options = hits.map(({ key }) => ({
				label: vf_currency_to_fixed(key, MIN_FILTER_LENGTH),
				value: key,
			}));
			options = _.uniqWith(options, (a, b) => a.label === b.label);
		}

		if (type === 'decimal') {
			options = hits.map(({ key }) => ({
				label: vf_number(key, MIN_FILTER_LENGTH),
				value: key,
			}));
			options = _.uniqWith(options, (a, b) => a.label === b.label);
		}

		options = options.filter(op => {
			op.label = formatValue(op.label); // format value to show $ sign as prefix
			return op.value || op.value === 0;
		});

		if (appendOptions.current) {
			appendOptions.current = false;
			setOptions(prevOptions => [...prevOptions, ...options]);
		} else {
			setStateIfDeepEqual(setOptions, filterSelectOptions || options);
		}
	}, [filtersData, filterValue, type, filterSelectOptions, field]);

	const { filters } = tableController(tableKey).getValues(['filters']);

	// If we have orFilter then filterValue is null due to id mismatch
	if (isComposite) {
		const key = field[0].replace('.keyword', '');
		const _field = filters.find(f => f?.field === key);
		if (Array.isArray(_field?.value)) {
			filterValue = _field.value.join(' ');
		}
	}

	if (!filterValue || filterValue?.length === 0) {
		const filter = filters.find(filter => filter?.field.includes(field));
		if (filter) {
			filterValue = filter?.value;
		}
	}

	// Handle Filter Value is changed from Single Select to Multi Select and vice versa
	if (multiple && typeof filterValue === 'string') {
		filterValue = [];
	} else if (!multiple && Array.isArray(filterValue)) {
		filterValue = '';
	} else if (multiple && !Array.isArray(filterValue)) {
		filterValue = [];
		tableController(tableKey).clearFilter(field.replace('.keyword', ''));
	} else if (type === 'date' && (typeof filterValue === 'string' ? filterValue : filterValue.length)) {
		if (typeof filterValue === 'string') {
			filterValue = formatDate(filterValue);
		} else if (typeof filterValue === 'object' && !Array.isArray(filterValue)) {
			const formattedGte = formatDate(filterValue?.gte);
			const formattedLte = formatDate(filterValue?.lte);
			filterValue = `${formattedGte} to ${formattedLte}`;
		} else if (Array.isArray(filterValue)) {
			filterValue = filterValue.map(val => formatDate(val));
		} else if (typeof filterValue === 'boolean' || type === 'defaultFiltersOptions') {
			// If there are default filters, use them
			const requiredFilterValue = defaultFilterOptions?.find(option => option?.value === filterValue)?.label;
			filterValue = requiredFilterValue;
		}
	} else if (type === 'price') {
		if (typeof filterValue === 'number') {
			filterValue = vf_currency_to_fixed(filterValue, MIN_FILTER_LENGTH);
		} else if (typeof filterValue === 'object' && !Array.isArray(filterValue)) {
			filterValue = vf_currency_to_fixed(filterValue, MIN_FILTER_LENGTH);
		} else if (Array.isArray(filterValue)) {
			filterValue = filterValue.map(val => vf_currency_to_fixed(val, MIN_FILTER_LENGTH));
		} else if (typeof filterValue === 'boolean' || type === 'defaultFiltersOptions') {
			// If there are default filters, use them
			const requiredFilterValue = defaultFilterOptions?.find(option => option?.value === filterValue)?.label;
			filterValue = vf_currency_to_fixed(requiredFilterValue, MIN_FILTER_LENGTH);
		}
	} else if (type === 'decimal' && filterValue !== '') {
		if (typeof filterValue === 'number') {
			filterValue = vf_number(filterValue, MIN_FILTER_LENGTH);
		} else if (typeof filterValue === 'object' && !Array.isArray(filterValue)) {
			filterValue = vf_number(filterValue, MIN_FILTER_LENGTH);
		} else if (Array.isArray(filterValue)) {
			filterValue = filterValue.map(val => vf_number(val, MIN_FILTER_LENGTH));
		} else if (typeof filterValue === 'boolean' || type === 'defaultFiltersOptions') {
			// If there are default filters, use them
			const requiredFilterValue = defaultFilterOptions?.find(option => option?.value === filterValue)?.label;
			filterValue = vf_number(requiredFilterValue, MIN_FILTER_LENGTH);
		}
		filterValue = vf_number(filterValue, MIN_FILTER_LENGTH);
	}
	const id = Array.isArray(field) ? field.join(' ') : field;
	// Filter out the options
	const requiredOptions =
		defaultFilterOptions?.length > 0
			? defaultFilterOptions
			: multiple
				? options?.filter(item => !filterValue.includes(item.value))
				: options;

	const handleScroll = event => {
		const bottom = event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;
		if (bottom && hasMore.current && !loading) {
			appendOptions.current = true;
			getFiltersAction({ afterKey: options[options.length - 1].value });
		}
	};
	return (
		<Autocomplete
			multiple={multiple}
			id={`${id}-filter-autocomplete`}
			options={requiredOptions}
			getOptionLabel={op => {
				if (typeof op !== 'object') {
					return op;
				}

				return op?.label ?? op?.name ?? '';
			}}
			loading={loading}
			filterOptions={searchMapping[searchMode].filterOptions}
			value={formatValue(filterValue ?? _value, field)}
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
						searchText.current = e.target.value;
						getFiltersAction();
					}}
					onFocus={e => {
						searchText.current = e.target.value;
						getFiltersAction();
					}}
					{...textFieldProps}
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
								return option.value;
							} else {
								const foundOption = _.find(requiredOptions, { label: option });
								return foundOption ? foundOption.value : option;
							}
						})
					: option.value;

				if (type === 'date') {
					value = formatDate(value);
				} else if (type === 'boolean') {
					value = value === 'true';
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

ESAutoCompleteFilter.propTypes = {
	tableKey: PropTypes.string.isRequired,
	esIndex: PropTypes.string.isRequired,
	modelName: PropTypes.string,
	column: PropTypes.shape({
		field: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
		type: PropTypes.string.isRequired,
		custom: PropTypes.object,
		defaultFilterOptions: PropTypes.array,
		setFilterValue: PropTypes.func,
		filterValue: PropTypes.any,
		filterSelectOptions: PropTypes.array,
		isComposite: PropTypes.bool,
	}).isRequired,
	extendSearchQuery: PropTypes.func.isRequired,
	multiple: PropTypes.bool.isRequired,
	textFieldProps: PropTypes.object,
	_value: PropTypes.any,
};

export default ESAutoCompleteFilter;
