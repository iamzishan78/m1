import React, { useEffect, useRef, useState } from 'react';

import { Autocomplete, TextField } from '@mui/material';

import { useLazyQuery } from '@apollo/client';
import _, { debounce, isEqual } from 'lodash';
import PropTypes from 'prop-types';

import { formatDate, setStateIfDeepEqual } from 'components/Shared/functions';
import { vf_currency_to_fixed } from 'components/Shared/valueformatters/vf_currency';
import vf_number from 'components/Shared/valueformatters/vf_number';

import { GET_DB_FILTERS } from 'graphQL/useQueryDbQuery';

import { tableController } from 'stateManagement/tableController';

const MIN_SEARCH_LENGTH = 700;
const MIN_FILTER_LENGTH = 2;

function ESAutoCompleteFilter({
	tableKey,
	esIndex,
	modelName,
	column: {
		field,
		label,
		type,
		subType,
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
	const compositeFields = isComposite ? field.split(',') : [field];
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

	const [getFilters, { data: filtersData, loading }] = useLazyQuery(GET_DB_FILTERS, { fetchPolicy: 'no-cache' });

	const [options, setOptions] = useState([]);
	const hasMore = useRef(true);
	const appendOptions = useRef(false);
	const filtersRef = useRef(null);

	if (isComposite && filterValue) {
		filterValue = Array.isArray(filterValue) ? filterValue.join(' ') : filterValue;
	}

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

		const sort = sorting[0]
			? {
					field:
						sorting[0].field ||
						TableSchema.find(val => (val.accessorKey || val.id) === sorting[0].id)?.name.split(',')[0],
					order: sorting[0].desc ? 'desc' : 'asc',
				}
			: defaultSort;

		const filtersArray = [...filters, ...defaultFilters].filter(filter => !compositeFields.includes(filter?.field));
		const currentFilterRef = {
			filters,
			defaultFilters,
			searchText: searchMapping[searchMode].searchText(),
			afterKey,
		};
		if (!_.isEqual(currentFilterRef, filtersRef.current)) {
			const searchQuery = searchText.current
				? type === 'number'
					? searchText.current
					: `*${searchText.current}*`
				: '';
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
					filterKeys: isComposite ? compositeFields : undefined,
					filterKey: !isComposite ? field : undefined,
					search: { query: tableController(tableKey).getGlobalFilter(), fields: searchFields, advanceSearch },
					extendSearchQuery,
					size: 10,
					key_as_string: custom?.key_as_string,
					multi_filter_keys: custom?.multi_filter_keys,
					filterAggs: {
						query: searchQuery,
						field: !isComposite ? field : undefined,
						fields: isComposite ? compositeFields : undefined,
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
		const hits = filtersData?.getDbFilters?.hits;

		if (!hits) {
			return;
		}

		let newOptions = hits.map(({ key_as_string, key }) => {
			let value = key;
			let label = key;

			if (Array.isArray(value)) {
				label = value.join(' ');
			} else if (typeof value === 'object') {
				label = value.name || '';
			}

			switch (subType || type) {
				case 'date':
					if (key_as_string) {
						label = formatDate(key_as_string);
						value = key_as_string;
					}
					break;
				case 'price':
					label = vf_currency_to_fixed(value, MIN_FILTER_LENGTH);
					break;
				case 'number':
					label = vf_number(value, MIN_FILTER_LENGTH);
					break;
			}

			return { label, value };
		});
		newOptions = _.uniqWith(newOptions, (a, b) => a.label === b.label).filter(op => op.value || op.value === 0);

		if (appendOptions.current) {
			appendOptions.current = false;
			setOptions(prevOptions => [...prevOptions, ...newOptions]);
		} else {
			setStateIfDeepEqual(setOptions, filterSelectOptions || newOptions);
		}
	}, [filtersData, filterValue, type, filterSelectOptions, field]);

	const handleScroll = event => {
		const bottom = event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;
		if (bottom && hasMore.current && !loading) {
			appendOptions.current = true;
			getFiltersAction({ afterKey: options[options.length - 1].value });
		}
	};

	const handleChange = (e, value) => {
		if (!value || value.length === 0) {
			setFilterValue(null);
			compositeFields.forEach(singleField =>
				tableController(tableKey).clearFilter(singleField.replace('.keyword', ''))
			);
			return;
		}

		const getValue = option => option?.value ?? _.find(options, { label: option })?.value ?? option;
		let newValue = multiple ? value.map(getValue) || [] : getValue(value);

		if (type === 'boolean') {
			newValue = newValue === 'true';
		}

		setFilterValue(newValue);
		compositeFields.forEach(singleField =>
			tableController(tableKey).setFilter({
				field: singleField.replace('.keyword', ''),
				value: newValue,
			})
		);

		if (!_.isEmpty(searchText.current)) {
			searchText.current = '';
			getFiltersAction();
		}
	};

	const optionsToShow = defaultFilterOptions?.length > 0 ? defaultFilterOptions : options;

	return (
		<Autocomplete
			multiple={multiple}
			id={`${compositeFields.join(' ')}-filter-autocomplete`}
			options={
				multiple && Array.isArray(filterValue)
					? optionsToShow?.filter(item => filterValue.find(value => isEqual(value, item.value)) == null)
					: optionsToShow
			}
			getOptionLabel={op => {
				if (typeof op !== 'object') {
					const foundOption = options.find(o => o?.value === op);

					if (foundOption) {
						op = foundOption;
					}
				}
				return op?.label ?? op?.name ?? op ?? '';
			}}
			loading={loading}
			filterOptions={searchMapping[searchMode].filterOptions}
			value={multiple ? (typeof filterValue === 'string' ? [filterValue] : filterValue) : (filterValue ?? _value)}
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
			onChange={handleChange}
			ListboxProps={{ onScroll: handleScroll }}
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
		subType: PropTypes.string,
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
