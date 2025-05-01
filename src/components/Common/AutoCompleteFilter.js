import React, { useState, useEffect, useContext } from 'react';
import { VariableSizeList } from 'react-window';

import { useLazyQuery } from '@apollo/client';
import { isArray, isEqual } from 'lodash';
import uniqBy from 'lodash/uniqBy';
import moment from 'moment';
import PropTypes from 'prop-types';

import { capitalizeFirstLetter, customStartCaseString } from 'components/Shared/functions';

import { AppContext } from 'AppContext';
import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';

export const AutoCompleteFilter = React.memo(
	({
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
		isDate,
		...others
	}) => {
		const getDefaultSearchValue = () => {
			if (custom?.formatedFilterOptions) {
				const find = custom.formatedFilterOptions.find(op => op.value === filterList[index][0]);

				if (find) {
					return find.label;
				}
			}

			return filterList[index][0];
		};

		const getDefaltValue = () => {
			let filterValue = multiple ? filterList[index].map(key => ({ key })) : { key: filterList[index][0] };

			if (custom?.formatedFilterOptions) {
				filterValue = custom?.formatedFilterOptions.find(f => f.value === filterValue.key) || filterValue;
			}

			return filterValue;
		};

		const filterValue = getDefaltValue();
		const [open, setOpen] = useState(false);
		const [, setStateApp] = useContext(AppContext);
		const [options, setOptions] = useState([]);
		const SetOptions = ops => setOptions(ops.filter(op => op.key));
		const [value, setValue] = useState(filterValue);
		const [search, setSearch] = useState(filterList[index][0]);
		const { label, filterKey, type } = column;
		const [getFilters, { data: filtersData, loading }] = useLazyQuery(query, { fetchPolicy: 'no-cache' });
		const getFiltersType = query?.definitions?.[0]?.name?.value;

		useEffect(() => {
			const filterVal = filterList[index][0];
			setSearch(isArray(filterVal) || multiple ? '' : filterVal);
			if (!filterVal) {
				setValue(filterValue);
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [filterList[index][0]]);

		useEffect(() => {
			if (!custom?.filterOptions) {
				getFiltersAction('');
			} else {
				SetOptions(custom?.filterOptions);
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [filters]);

		useEffect(() => {
			if (filtersData) {
				const keys = Object.keys(filtersData);
				if (keys && filtersData[keys[0]] && filtersData[keys[0]]?.hits) {
					if (custom?.isState || custom?.oRFilter) {
						let hits = filtersData[keys[0]].hits.map(hit => {
							const keys = hit.key_as_string.split('|');
							return {
								...hit,
								key: keys[0] || keys[1],
								key_as_string: hit.key_as_string || hit.key,
							};
						});
						hits = uniqBy(hits, 'key');
						SetOptions(hits);
					} else if (custom?.isDate) {
						filtersData[keys[0]].hits = filtersData[keys[0]]?.hits.filter(hit => hit.key);
						let hits = filtersData[keys[0]].hits.map(hit => ({
							...hit,
							key: moment(new Date(hit.key)).format('MM/DD/YYYY'),
							key_as_string: hit.key_as_string || hit.key,
						}));
						// making records unique
						hits = uniqBy(hits, 'key');
						SetOptions(hits);
						setStateApp((state, props) => {
							return { ...state, filtersData: { ...state.filtersData, [column.name]: hits } };
						});
					} else if (custom?.isDateTime) {
						filtersData[keys[0]].hits = filtersData[keys[0]]?.hits.filter(hit => hit.key);
						const hits = filtersData[keys[0]].hits.map(hit => ({
							...hit,
							key: moment(new Date(hit.key)).format('MM/DD/YYYY HH:mm:ss.SSS'),
							key_as_string: hit.key_as_string || hit.key,
						}));
						SetOptions(hits);
						setStateApp((state, props) => {
							return { ...state, filtersData: { ...state.filtersData, [column.name]: hits } };
						});
					} else if (custom?.toFixed) {
						filtersData[keys[0]].hits = filtersData[keys[0]]?.hits.filter(hit => hit.key);
						const hits = filtersData[keys[0]].hits.map(hit => ({
							...hit,
							key: parseFloat(hit.key.toFixed(custom?.toFixed)),
						}));
						SetOptions(hits);
					} else if (custom?.formatedFilterOptions) {
						const hits = filtersData[keys[0]].hits;
						for (let i = 0; i < custom.formatedFilterOptions.length; i++) {
							const index = hits.findIndex(
								h =>
									h.key === custom.formatedFilterOptions[i].value ||
									h.key_as_string === custom.formatedFilterOptions[i].value
							);
							if (index > -1) {
								hits[index].key = custom.formatedFilterOptions[i].label;
							}
						}
						SetOptions(hits);
						setSearch(getDefaultSearchValue());
					} else {
						SetOptions(filtersData[keys[0]].hits);
					}
				}
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [filtersData]);

		const getFiltersAction = search => {
			let addedFilters = filters;

			if (multiple) {
				if (filtersData && filterList[index].length > 0) {
					return;
				}

				if (!filtersData && filterList[index].length > 0) {
					addedFilters = addedFilters.filter(filter => {
						if (typeof filterKey !== 'string') {
							return !isEqual(filter.field, JSON.stringify(filterKey));
						}

						return !isEqual(filter.field, filterKey);
					});
				}
			}

			const rawSearch = search;
			if (search) {
				search = type === 'number' ? search : `*${search}*`;
			}
			getFilters({
				variables: {
					esIndex,
					index: esIndex,
					filters: addedFilters,
					filterKeys: typeof filterKey !== 'string' ? filterKey : undefined,
					filterKey: typeof filterKey === 'string' ? filterKey : undefined,
					search,
					...(getFiltersType === 'getDbFilters' && { search: { query: extendSearchQuery, fields: searchFields } }),
					extendSearchQuery,
					size: 10,
					key_as_string: custom?.key_as_string,
					multi_filter_keys: custom?.multi_filter_keys,
					filterAggs: {
						query: rawSearch,
						field: typeof filterKey === 'string' ? filterKey : undefined,
						fields: typeof filterKey !== 'string' ? filterKey : undefined,
						size: 100000,
					},
				},
			});
		};

		return (
			<CustomAutoComplete
				id={`filter-autocomplete-${custom?.filterLabel || label}`}
				disableListWrap
				ListboxComponent={ListboxComponent}
				fieldAttributes={{
					label: custom?.filterLabel || label,
					value: filterList[index][0],
					optionArray: options,
				}}
				fieldConfig={{
					variant: others?.variant || 'standard',
					size: others.inputSize || 'medium',
					disabled: others.disabled,
					multiple,
					loading,
					getCustomOptionLabel: option =>
						customStartCaseString(capitalizeFirstLetter(option?.key?.toString().replace(/^,|,$/gm, '')), isDate),
					textfieldRestProps: {
						style: { background: 'white' },
					},
				}}
				fieldEvents={{
					onChange: ({ value, reason }) => {
						if (reason === 'clear' || (multiple && value.length === 0) || (!multiple && !value?.key)) {
							filterList[index] = [];
							setSearch('');
							setValue(multiple ? [] : { key: 'All' }); // Reset dropdwon to default value correctly
						} else {
							if (multiple) {
								filterList[index].length = 0;
								value.forEach(v => {
									const val = typeof v.key === 'string' ? v.key.replace(/^,|,$/gm, '') : v.key;
									filterList[index].push(val);
								});
								// setSearch(value[value.length - 1]?.key);
							} else {
								filterList[index][0] = typeof value.key === 'string' ? value.key.replace(/^,|,$/gm, '') : value.key;
								if (custom?.initialCapitalization) {
									setSearch(capitalizeFirstLetter(value.key));
								} else {
									setSearch(value.key);
								}
							}

							setValue(value);
							if (value?.esKey) {
								column.activeFilterKey = value?.esKey;
							}
						}
						if (setFilters && esIndex !== 'mywells_flat') {
							setFilters(filterList);
						}

						column.filterList = filterList[index];

						const filterVal = filterList[index].length > 1 ? [filterList[index]] : filterList[index];

						onChange(filterVal, index, column, value?.esKey || '', reason === 'clear');
					},
					onTextFieldChange: value => setSearch(value),
				}}
			/>
		);
	}
);

AutoCompleteFilter.propTypes = {
	filterList: PropTypes.arrayOf(PropTypes.array).isRequired,
	onChange: PropTypes.func.isRequired,
	index: PropTypes.number.isRequired,
	column: PropTypes.shape({
		label: PropTypes.string,
		filterKey: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
		type: PropTypes.string,
		name: PropTypes.string,
		activeFilterKey: PropTypes.any,
		filterList: PropTypes.any,
	}).isRequired,
	query: PropTypes.object.isRequired,
	extendSearchQuery: PropTypes.any,
	searchFields: PropTypes.array,
	esIndex: PropTypes.string,
	filters: PropTypes.array,
	custom: PropTypes.shape({
		formatedFilterOptions: PropTypes.arrayOf(
			PropTypes.shape({
				value: PropTypes.any,
				label: PropTypes.string,
			})
		),
		filterOptions: PropTypes.array,
		isState: PropTypes.bool,
		oRFilter: PropTypes.bool,
		isDate: PropTypes.bool,
		isDateTime: PropTypes.bool,
		toFixed: PropTypes.number,
		key_as_string: PropTypes.bool,
		multi_filter_keys: PropTypes.any,
		filterLabel: PropTypes.string,
		initialCapitalization: PropTypes.bool,
	}),
	setFilters: PropTypes.func,
	multiple: PropTypes.bool,
	isDate: PropTypes.bool,
};

// Adapter for react-window
const ListboxComponent = React.forwardRef((props, ref) => {
	const { children, ...other } = props;
	const itemData = [];
	children.forEach(item => {
		itemData.push(item);
		itemData.push(...(item.children || []));
	});

	const itemCount = itemData.length;
	const itemSize = 40;
	const LISTBOX_PADDING = 5; // px

	// const getChildSize = (child) => {
	//   // if (child.hasOwnProperty('group')) {
	//   //   return 48;
	//   // }
	//   return itemSize;
	// };

	const getHeight = () => {
		// adding 10px as padding
		if (itemCount > 8) {
			return 8 * itemSize + LISTBOX_PADDING;
		}
		// const items = itemData.map(getChildSize).reduce((a, b) => a + b, 0);
		// const height = items * LISTBOX_PADDING
		// return height;
		return itemData.length * itemSize + LISTBOX_PADDING;
	};

	function renderRow(props) {
		const { data, index, style } = props;

		if (!data[index]) {
			return null;
		}

		return React.cloneElement(data[index], {
			style: {
				...style,
				top: style.top + LISTBOX_PADDING,
			},
		});
	}

	const OuterElementContext = React.createContext({});

	const OuterElementType = React.forwardRef((props, ref) => {
		const outerProps = React.useContext(OuterElementContext);
		return <div ref={ref} {...props} {...outerProps} />;
	});

	const useResetCache = data => {
		const ref = React.useRef(null);
		React.useEffect(() => {
			if (ref.current != null) {
				ref.current.resetAfterIndex(0, true);
			}
		}, [data]);
		return ref;
	};

	const gridRef = useResetCache(itemCount);

	return (
		<div ref={ref}>
			<OuterElementContext.Provider value={other}>
				<VariableSizeList
					itemData={itemData}
					height={getHeight()}
					width="100%"
					ref={gridRef}
					outerElementType={OuterElementType}
					innerElementType="ul"
					itemSize={() => itemSize}
					overscanCount={5}
					itemCount={itemCount}
				>
					{renderRow}
				</VariableSizeList>
			</OuterElementContext.Provider>
		</div>
	);
});

ListboxComponent.propTypes = {
	children: PropTypes.node,
};
