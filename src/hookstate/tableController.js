import React from 'react';
import { hookstate } from '@hookstate/core';
import _, { get, isEqual, isEmpty, pull } from 'lodash';
import { copy, deepEqual, formatDate } from 'components/Shared/functions';
import { hookStateController } from 'hookstate/hookStateController';
import { GET_META_DATA } from 'graphQL/useQueryGetMetaData';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { globalStateController } from 'hookstate/globalStateController';
import ReactSelectField from 'components/MRTTable/Common/MetaData/ReactSelectField';
import CustomFieldText from 'components/MRTTable/Common/MetaData/CustomFieldText';
import { metaDataColumnStateController } from 'components/MRTTable/Common/MetaData/MetaDataColumnsController';
import { GET_GRID_VIEWS } from 'graphQL/useQueryGetGridViews';
import { gridViewStateController } from 'components/MRTTable/Common/GridView/GridViewController';
import { formatGridViewToMRT } from 'components/MRTTable/utils/helper';
import TableHeaderMoreOptions from 'components/MRTTable/Common/TableHeaderMoreOptions';
import MRTSelectCheckboxOverRide from 'components/MRTTable/Common/MRT_SelectCheckbox_OverRide';
import { handleMRTSchema, handleVisiblityMenu } from './helpers';
import { validateUrl } from 'utils/helper';
import { getFormattedFilterBasedOnType } from 'components/Shared/SidePanel/compoennts/Filters/UserMapFilter';
import { extractUniqueFilters } from 'components/Map/DeckGL/helpers/common';
import { customLayersFieldAccessors } from 'components/Shared/SidePanel/compoennts/Filters/consts';

function isDateFormat(inputString) {
	// Regular expression for MM/DD/YYYY format
	const mmddyyy = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/;
	const mmddyy = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d\d$/;

	// Check if the inputString matches the date format
	return mmddyyy.test(inputString) || mmddyy.test(inputString);
}

const initialState = {
	defaultFilters: [],
	customProps: [],
	filters: [],
	sorting: [],
	searchFields: [],
	groupedField: {},
	grouping: [],
	footerProps: [],
	ExternalFilter: [],
	defaultSort: {},
	columnOrdering: [],
	columnPinning: {
		left: [],
	},
	isIncludeInactive: false,
	gridView: {},
	showTypes: true,
};

export const tableESState = {};
export const tableGlobalState = hookstate({
	refetch: false,
	reInitialized: false,
});

async function fetchTableSchema(client, fetchMetaData, TableSchema, onCustomKeyChange, tableKey) {
	const _user = globalStateController.getValue('user');

	const result = await client.query({
		variables: {
			user: _user?._id,
			category: fetchMetaData?.category,
		},
		query: GET_META_DATA,
	});

	const data = result?.data?.getMetaData?.metaData;

	const metaDataTableSchema = data.map((item, index) => {
		const key = item?.esKey.replaceAll('.keyword', '');
		return {
			...CommonSchema.COMMON_COLUMN,
			...item,
			name: `${key}.keyword`,
			id: key,
			accessorFn: row => get(row, key),
			header: item?.label,
			isCustom: true,
			size: 350,
			inputType: item?.type,
			dbKey: item?.name,
			isSearchField: !item.type === 'date',
			Cell: ({ row }) => {
				const value = _.get(row?.original, `custom_data.${item?.name}`);

				if (item?.type === 'multiselect' || item?.type === 'dropdown') {
					return (
						<div>
							<ReactSelectField
								tooltipView={true}
								isSingleSelect={item.type !== 'multiselect'}
								dropdownOptions={item.dropdownOptions}
								index={index}
								column={item}
								value={value}
								id={item.label}
								tableKey={tableKey}
								onCustomKeyChange={value => onCustomKeyChange(client, row?.original, value, item)}
							/>
						</div>
					);
				}

				if (item?.type === 'text') {
					if (validateUrl(value))
						return (
							<a href={value} target="_blank" rel="noreferrer">
								{value?.length > 40 ? value?.slice(0, 40) + '...' : value}
							</a>
						);
					return (
						<CustomFieldText
							value={value}
							onCustomKeyChange={value => {
								onCustomKeyChange(client, row?.original, value, item);
							}}
						/>
					);
				}

				return <>{value}</>;
			},
		};
	});

	metaDataColumnStateController(tableKey)?.initialize(tableKey, metaDataTableSchema);

	const lastColumns = TableSchema.filter(obj => obj.showInLast === true);
	const defaultColumns = TableSchema.filter(obj => obj.showInLast !== true);
	const newTableSchema = [...defaultColumns, ...metaDataTableSchema, ...lastColumns];
	return newTableSchema;
}

async function fetchGridViews(client, module, tableKey, gridViewOverride) {
	// Retrieve the current user's information from a global state controller.
	const user = globalStateController.getValue('user');

	// Execute a GraphQL query to fetch grid views for the specified module and user ID.
	const result = await client.query({
		variables: {
			module,
			userId: user._id,
		},
		query: GET_GRID_VIEWS,
	});

	// Extract the grid views from the query result.
	const allGridViews = result?.data?.getGridViews?.gridViews;

	// Initialize the grid view state controller with the fetched grid views for the specified table.
	const gridViewController = gridViewStateController(tableKey);
	gridViewController?.initialize(tableKey, allGridViews);

	// Attempt to find a grid view that matches the override name, if provided.
	let defaultDisplay = allGridViews?.find(obj => obj.name === gridViewOverride);

	// If no override is found or provided, attempt to find a default grid view for the user.
	if (!defaultDisplay) defaultDisplay = allGridViews?.find(obj => obj.defaultDisplayBy?.includes(user?._id));

	// Return the determined default or overridden grid view configuration.
	return defaultDisplay;
}

const tableESStateControllerHandler = state => ({
	initialize: async (
		tableKey,
		{
			esIndex,
			layerIdentifier,
			pageSize,
			defaultSort,
			isIncludeInactive,
			isInFiniteScroll,
			columnVirtualization,
			TableSchema,
			defaultFlterMode,
			defaultFilters,
			customProps = {},
			isSelectAllAllowed = true,
			isSelectall,
			search,
			fetchMetaData,
			onCustomKeyChange,
			gridViewSettings,
			density = 'comfortable',
			advanceSearch = [],
			isDefaultGridView,
			enableHiding = true,
			refetchQueries = [],
			globalFilter,
			...rest
		},
		client
	) => {
		if (state.TableSchema.get()) return;

		let _Schema = TableSchema;
		if (!rest.isGeneric)
			_Schema.unshift({
				...CommonSchema.SELECT_SOME,
				Header: () => <TableHeaderMoreOptions tableKey={tableKey} />,
				Cell: ({ row }) => {
					const tableState = tableController(tableKey).useState(['mrtTableRef']);
					const tableStateValues = tableState.stateValues;
					// eslint-disable-next-line react/jsx-pascal-case
					return (
						<MRTSelectCheckboxOverRide
							row={row}
							selectAll={false}
							table={tableStateValues?.mrtTableRef}
							tableKey={tableKey}
						/>
					);
				},
			});

		if (fetchMetaData) {
			_Schema = await fetchTableSchema(client, fetchMetaData, TableSchema, onCustomKeyChange, tableKey);
		}

		let formatedGridView = null;

		let gridView = {};

		const mapView = globalStateController.getValue('mapView');
		const { filters } = mapView?.selectedMapView || {};
		const selectedMapViewFilters = filters || [];

		const dataSourceViews = selectedMapViewFilters?.filter(view => view.dataSourceName === layerIdentifier);
		const mapViewFilters =
			dataSourceViews?.map(view => getFormattedFilterBasedOnType(view.filterType, view.fieldName, view.filterValues)) ||
			[];

		if (gridViewSettings) {
			// Fetch user-specific or default grid views based on provided settings and overrides.
			const userDefaultDisplay = await fetchGridViews(client, gridViewSettings.module, tableKey, rest.gridViewOverride);

			// Format the fetched grid view for use with a specific grid view library or framework, assumed to be Material-UI's React Table (MRT).
			formatedGridView = formatGridViewToMRT(userDefaultDisplay);

			// Setup the gridView object with the selected grid view configuration and some flags for UI control.
			gridView = {
				selectedGridView: isDefaultGridView || !userDefaultDisplay ? gridViewSettings.defaultView : userDefaultDisplay,
				showViewModal: false,
				showSaveAsNew: false,
			};
		}
		const {
			_TableSchema,
			tableCss,
			searchFields,
			groupedField,
			ExternalFilter,
			columnVisibility,
			filterModes,
			columnOrder,
			pinnedFields,
		} = handleMRTSchema({
			_Schema,
			tableKey,
			esIndex,
			defaultFlterMode,
			search,
			columnVirtualization,
			globalFilter,
		});

		// Set default pinning and ordering
		const defaultColumnsOrdering = ['over-ride-checkbox', 'mrt-row-numbers', ...columnOrder];
		const defaultColumnsPinning = {
			left: [
				...(pinnedFields.length > 0
					? _.concat(['over-ride-checkbox', 'mrt-row-numbers'], _.slice(pinnedFields, 1))
					: ['over-ride-checkbox', 'mrt-row-numbers']),
			],
		};

		// Push action menu in first place
		if (rest.isShowActionMenuFirst) {
			// removing 'actionMenu' from array and adding it at start
			pull(defaultColumnsOrdering, 'actionMenu');
			pull(defaultColumnsPinning.left, 'actionMenu');

			defaultColumnsOrdering?.unshift('actionMenu');
			defaultColumnsPinning?.left?.unshift('actionMenu');
		}
		const formattedmapViewsFilters = mapViewFilters.map(filter => ({
			...filter,
			field: filter.field.replace('.keyword', ''),
			value: filter.value,
		}));

		const combinedFilters = formatedGridView?.filters
			? [...formatedGridView.filters, ...formattedmapViewsFilters]
			: [...formattedmapViewsFilters];

		state.merge({
			...rest,
			refetchQueries,
			defaultFlterMode,
			search,
			initialized: true,
			tableKey,
			esIndex,
			fetchMetaData,
			gridViewSettings,
			gridView,
			pageSize,
			isSelectall: false,
			isSelectAllAllowed,
			showColumnFilters: formatedGridView?.filters ? true : false,
			data: { rows: [], total: 0 },
			isLoading: false,
			isFetching: false,
			isError: false,
			defaultFilters: defaultFilters || state?.defaultFilters?.get({ noproxy: true }) || [],
			customProps: isEmpty(state?.customProps?.get({ noproxy: true }))
				? customProps
				: state?.customProps?.get({ noproxy: true }),
			filters: extractUniqueFilters(combinedFilters),
			layerIdentifier,
			sorting: formatedGridView?.sorting ? formatedGridView.sorting : [],
			rowSelection: {},
			searchFields,
			isInFiniteScroll,
			columnVirtualization,
			TableSchema: _TableSchema,
			tableCss,
			groupedField,
			grouping: groupedField ? [groupedField] : [],
			footerProps: [],
			ExternalFilter,
			columnVisibility: formatedGridView?.columnVisibility ? formatedGridView.columnVisibility : columnVisibility,
			defaultSort,
			isIncludeInactive,
			filterModes,
			density,
			advanceSearch,
			enableHiding,
			columnOrdering: formatedGridView?.columnOrdering ? formatedGridView.columnOrdering : defaultColumnsOrdering,
			columnPinning: formatedGridView?.columnPinning ? formatedGridView.columnPinning : defaultColumnsPinning,
		});

		if (mapViewFilters.length > 0) tableController(tableKey).setShowColumnFilters(true);
		mapViewFilters?.forEach(filter => {
			tableController(tableKey).setFilterMode(filter?.field.replace('.keyword', ''), filter.searchType);
		});
	},

	setFilterMode: (column, mode) => {
		const index = state.TableSchema?.get({ noproxy: true })?.findIndex(
			element => element.accessorKey === column || element.id === column
		);
		const columnSchema = state.TableSchema?.[index]?.get({
			noproxy: true,
		});

		if (mode === 'singleselect') {
			state.TableSchema?.[index]?.merge({
				Filter: columnSchema?.SingleSelect,
			});
		} else if (mode === 'multiselect') {
			state.TableSchema?.[index]?.merge({
				Filter: columnSchema?.MultiSelect,
			});
		} else if (columnSchema?.Filter) {
			state.TableSchema?.[index]?.merge({ Filter: null });
		}

		if (!columnSchema?.name) return;
		state.filterModes?.merge({
			[column]: {
				mode,
				isKeyword: columnSchema.name.includes('.keyword'),
			},
		});

		const columnFilterModesFnRefs = globalStateController.getValue('columnFilterModesFnRefs');

		columnFilterModesFnRefs?.[state.tableKey.get({ noproxy: true })]?.[column]?.(mode);
	},
	setSelectAll: value => {
		state.isSelectall.set(value);
	},

	setColumnVisibility: visibility => {
		if (!deepEqual(state.columnVisibility?.get({ noproxy: true }), visibility)) state.columnVisibility?.set(visibility);
	},

	setColumnPinning: (columnPinning, oldPinning, TableSchema) => {
		if (!deepEqual(state.columnPinning?.get({ noproxy: true }), columnPinning)) {
			let size = 0;
			columnPinning.left.forEach(pin => {
				if (pin === 'mrt-row-numbers') {
					size += 60;
				} else if (pin === 'mrt-row-select') {
					size += 0;
				} else {
					size += state.TableSchema.get({ noproxy: true }).find(
						column => column.id === pin || column.accessorKey === pin
					)?.size;
				}
			});
			const tableCss = {
				...state.tableCss?.get({ noproxy: true }),
				...(state.columnVirtualization.get()
					? { '& .MuiTableRow-root>:nth-child(2)': { marginLeft: `-${size}px !important` } }
					: {}),
			};
			state.columnPinning?.set(columnPinning);

			let changeTableSchema = false;
			columnPinning.left.forEach(col => {
				if (oldPinning.left.find(l => l === col)) return;
				TableSchema.forEach(column => {
					if (column.id === col) {
						column.enableResizing = false;
						column.enableColumnDragging = false;
						column.enableColumnOrdering = false;
						column.enableHiding = false;
						changeTableSchema = true;
					}
				});
			});

			oldPinning.left.forEach(col => {
				if (columnPinning.left.find(l => l === col)) return;
				TableSchema.forEach(column => {
					if (column.id === col) {
						column.enableResizing = true;
						column.enableColumnDragging = true;
						column.enableColumnOrdering = true;
						column.enableHiding = true;
						changeTableSchema = true;
					}
				});
			});
			if (changeTableSchema) state.TableSchema.set(TableSchema);
			state.tableCss?.set(tableCss);
		}
		handleVisiblityMenu();
	},

	setColumnOrdering: order => {
		if (!deepEqual(state.columnOrdering?.get({ noproxy: true }), order)) state.columnOrdering?.set(order);
	},

	setColumnCheck: rowCheck => {
		if (!deepEqual(state.rowSelection?.get({ noproxy: true }), rowCheck)) state.rowSelection?.set(rowCheck);
	},

	setPagination: pagination =>
		!deepEqual(state.pagination?.get({ noproxy: true }), pagination) && state.pagination?.set(pagination),

	setGlobalFilter: globalFilter =>
		!deepEqual(state.globalFilter?.get({ noproxy: true }), globalFilter) && state.globalFilter?.set(globalFilter),

	getGlobalFilter: () => state.globalFilter?.get({ noproxy: true }),

	setFilter: _filter => {
		const TableSchema = state.TableSchema.get({ noproxy: true }) || [];
		const filter = copy(_filter);
		const column = TableSchema?.find(column => column.id === filter.field || column.accessorKey === filter.field);
		if (column?.type === 'date') {
			filter.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			if (filter.type !== 'advanced' || (filter.type === 'advanced' && !filter.searchType)) {
				filter.type = 'advanced';
				filter.searchType = 'betweenInclusive';
				filter.columnType = 'date';
			} else {
				if (Array.isArray(filter.value)) {
					if (!isDateFormat(filter.value[0]) || !isDateFormat(filter.value[1])) return;

					const date1 = new Date(filter.value[0]);
					const date2 = new Date(filter.value[1]);

					filter.value = [formatDate(date1.toISOString()), formatDate(date2.toISOString())];
				} else {
					if (!isDateFormat(filter.value)) return;
					const date = new Date(filter.value);
					filter.value = formatDate(date.toISOString());
				}
			}
		}

		const filtersState = state.filters?.get({ noproxy: true });

		if (
			deepEqual(
				filtersState.find(({ field }) => field === filter.field),
				filter
			)
		)
			return;

		const mapView = globalStateController.getValue('mapView');
		const mapViewsFitlers = mapView?.selectedMapView?.filters || [];

		const tableState = state.get({
			noproxy: true,
		});

		if (tableState?.layerIdentifier) {
			const currentIdentifier = customLayersFieldAccessors[tableState?.layerIdentifier];

			if (
				currentIdentifier &&
				currentIdentifier.keys?.find(key => key.value.replace('.keyword', '') === filter.field.replace('.keyword', ''))
			) {
				const existingFilter = mapViewsFitlers.find(
					({ fieldName }) => (fieldName?.value || fieldName).replace('.keyword', '') === filter.field
				);

				const isValuesEqual = _.isEqual(
					existingFilter?.filterValues,
					typeof filter.value === 'string' ? [filter.value] : filter.value
				);
				const isNonValuesFilter = ['empty', 'notEmpty'].includes(filter.searchType);

				if (!(isValuesEqual || isNonValuesFilter)) {
					globalStateController.updateState({
						viewChanged: true,
						mapView: {
							...mapView,
							viewChanged: true,
							selectedMapView: {
								...mapView?.selectedMapView,
								filters: [
									...mapViewsFitlers.filter(
										({ fieldName }) => (fieldName?.value || fieldName).replace('.keyword', '') !== filter.field
									),
									{
										dataSourceName: tableState?.layerIdentifier,
										filterType:
											tableState?.filterModes[filter.field.replace('.keyword', '')]?.mode ||
											existingFilter?.filterType ||
											tableState?.esIndex === 'shapefile_flat'
												? 'multiselect'
												: 'singleselect',
										fieldName: filter.field,
										filterValues: typeof filter.value === 'string' ? [filter.value] : filter.value,
									},
								],
							},
						},
					});
				}
			}
		}

		state.filters?.set([...filtersState.filter(({ field }) => field !== filter.field), filter]);
	},

	getExternalFilter: () => {
		const filtersState = state.filters?.get({ noproxy: true });
		const requiredFields = state.ExternalFilter?.get({ noproxy: true })?.map(f => f.replaceAll('.keyword', ''));
		const esFilters = (filtersState || [])?.filter(filter =>
			requiredFields.includes(filter.field.replaceAll('.keyword', ''))
		);
		return esFilters;
	},

	clearFilter: field => {
		const filtersState = state.filters?.get({ noproxy: true });
		const mapView = globalStateController.getValue('mapView');
		const mapViewsFitlers = mapView?.selectedMapView?.filters || [];
		if (mapViewsFitlers.find(({ fieldName }) => (fieldName?.value || fieldName).replace('.keyword', '') === field)) {
			const tableState = state.get({
				noproxy: true,
			});

			if (tableState?.layerIdentifier)
				globalStateController.updateState({
					viewChanged: true,
					mapView: {
						...mapView,
						viewChanged: true,
						selectedMapView: {
							...mapView?.selectedMapView,
							filters: [
								...mapViewsFitlers.filter(
									({ dataSourceName, fieldName }) =>
										(fieldName?.value || fieldName).replace('.keyword', '') !== field ||
										dataSourceName !== tableState?.layerIdentifier
								),
							],
						},
					},
				});
		}

		if (!filtersState.find(filter => filter.field === field)) return;

		state.filters?.set(filtersState.filter(filter => filter.field !== field));
	},

	clearFilters: () => {
		const filtersState = state.filters?.get({ noproxy: true });

		if (!filtersState?.length === 0) return;

		state.filters?.set(filtersState.filter(filter => filter.isMapViewFilter));
	},

	syncFilters: filters => {
		const filtersState = state.filters?.get({ noproxy: true });

		if (filtersState.length <= filters.length) return;

		const filterKeys = filters.map(filter => filter.id);

		const mapView = globalStateController.getValue('mapView');
		const mapViewsFitlers = mapView?.selectedMapView?.filters || [];

		const tableState = state.get({
			noproxy: true,
		});

		const keysToClear = filtersState
			.filter(filter => !filterKeys.includes(filter.field.replace(/.keyword/, 'g', '')))
			.map(filter => filter.field);

		if (tableState?.layerIdentifier)
			globalStateController.updateState({
				viewChanged: true,
				mapView: {
					...mapView,
					viewChanged: true,
					selectedMapView: {
						...mapView?.selectedMapView,
						filters: [
							...mapViewsFitlers.filter(
								({ dataSourceName, fieldName }) =>
									!keysToClear.includes((fieldName?.value || fieldName).replace('.keyword', '')) ||
									dataSourceName !== tableState?.layerIdentifier
							),
						],
					},
				},
			});

		state.filters?.set(filtersState.filter(filter => !keysToClear.includes(filter.field)));
	},

	setIsAllRowsSelected: value => {
		if (!state.isSelectAllAllowed.get()) return;

		if (!isEqual(value, state.isAllRowsSelected.get())) state.isAllRowsSelected.set(value);
	},

	setShowColumnFilters: value => {
		if (!isEqual(value, state.showColumnFilters.get())) state.showColumnFilters.set(value);
	},

	setSorting: sorting => {
		state.sorting?.set(sorting);
	},

	setFilters: filters => {
		state.filters.set(filters);
	},

	setIncludeInactive: isIncludeInactive => {
		state.isIncludeInactive?.set(isIncludeInactive);
	},

	setMrtTableRef: mrtTableRef => {
		!deepEqual(state.mrtTableRef?.get({ noproxy: true }), mrtTableRef) && state.mrtTableRef?.set(mrtTableRef);
	},

	setAdvanceSearch: (value, otherState) => {
		if (!isEqual(value, state.advanceSearch.get({ noproxy: true }))) {
			state.merge({
				advanceSearch: value,
				...(otherState && { globalFilter: otherState.globalFilter || '' }),
			});
		}
	},

	getGenericState: rows => {
		const getGenericKeys = (orderKeys, excludedKeys, nestedKey) => {
			orderKeys = orderKeys || ['_id', 'id', 'name', 'flatSyncAt', '_ts'];
			excludedKeys = excludedKeys || ['isDeleted', 'IsDeleted', 'sort'];

			if (nestedKey) excludedKeys.push(nestedKey);

			let keys = [];

			rows.forEach(row => {
				keys = [
					...new Set([
						...keys,
						...Object.keys(row).filter(key => !excludedKeys.includes(key)),
						...(nestedKey ? Object.keys(row[nestedKey] || {}) : []),
					]),
				];
			});

			keys = keys.sort((a, b) => {
				const aIndex = orderKeys.indexOf(a);
				const bIndex = orderKeys.indexOf(b);

				// If both keys are in the orderKeys array, sort based on their order in orderKeys.
				if (aIndex !== -1 && bIndex !== -1) {
					return aIndex - bIndex;
				}

				// If only one key is in the orderKeys array, prioritize it.
				if (aIndex !== -1) {
					return -1;
				}

				if (bIndex !== -1) {
					return 1;
				}

				// If neither key is in the orderKeys array, maintain the original order.
				return 0;
			});

			return keys;
		};

		const genericState = {};

		const {
			isGeneric,
			orderKeys,
			excludedKeys,
			nestedKey,
			generateSchema,
			tableKey,
			esIndex,
			defaultFlterMode,
			search,
			columnVirtualization,
		} = state.get({
			noproxy: true,
		});

		if (!isGeneric || rows?.length === 0) return genericState;

		const keys = getGenericKeys(orderKeys, excludedKeys, nestedKey);

		const {
			_TableSchema,
			tableCss,
			// searchFields,
			groupedField,
			ExternalFilter,
			columnVisibility,
			filterModes,
			columnOrder,
			pinnedFields,
		} = handleMRTSchema({
			_Schema: generateSchema(keys, rows),
			tableKey,
			esIndex,
			defaultFlterMode,
			search,
			columnVirtualization,
		});

		genericState.TableSchema = _TableSchema;
		genericState.tableCss = tableCss;
		// genericState.searchFields = searchFields; // causes infinite loop
		genericState.groupedField = groupedField;
		genericState.ExternalFilter = ExternalFilter;
		genericState.columnVisibility = columnVisibility;
		genericState.filterModes = filterModes;
		genericState.columnOrder = columnOrder;
		genericState.pinnedFields = pinnedFields;

		return genericState;
	},
});

export const tableController = TableKey => {
	if (!tableESState[TableKey]) tableESState[TableKey] = hookstate(copy(initialState));
	return {
		...tableESStateControllerHandler(tableESState[TableKey]),
		...hookStateController(tableESState[TableKey], copy(initialState)),
	};
};

const tableGlobalControllerHandler = state => ({
	refetch: () => {
		state.refetch.set(!state.refetch.get({ noproxy: true }));
	},
	reInitialized: () => {
		state.reInitialized.set(!state.reInitialized.get({ noproxy: true }));
	},
});

export const tableGlobalController = {
	...tableGlobalControllerHandler(tableGlobalState),
	...hookStateController(tableGlobalState, {}),
};
