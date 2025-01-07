/* eslint-disable react/prop-types */
/* eslint-disable no-use-before-define */
import React from 'react';

import { hookstate } from '@hookstate/core';
import _, { get, isEqual, isEmpty, pull } from 'lodash';

import { extractUniqueFilters, filterValidFilters } from 'components/Map/DeckGL/helpers/common';
import { viewStateController } from 'components/MRTTable/Common/GridView/ViewController';
import CustomFieldText from 'components/MRTTable/Common/MetaData/CustomFieldText';
import { metaDataColumnStateController } from 'components/MRTTable/Common/MetaData/MetaDataColumnsController';
import ReactSelectField from 'components/MRTTable/Common/MetaData/ReactSelectField';
import MRTSelectCheckboxOverRide from 'components/MRTTable/Common/MRT_SelectCheckbox_OverRide';
import TableHeaderMoreOptions from 'components/MRTTable/Common/TableHeaderMoreOptions';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { formatGridViewToMRT } from 'components/MRTTable/utils/helper';
import { copy, deepEqual, formatDate } from 'components/Shared/functions';
import { customLayersFieldAccessors } from 'components/Shared/SidePanel/compoennts/Filters/consts';
import { getFormattedFilterBasedOnType } from 'components/Shared/SidePanel/compoennts/Filters/UserMapFilter';

import { GET_GRID_VIEWS } from 'graphQL/useQueryGetGridViews';
import { GET_META_DATA } from 'graphQL/useQueryGetMetaData';

import { globalStateController } from 'hookstate/globalStateController';
import { hookStateController } from 'hookstate/hookStateController';

import { compareObjects, validateUrl } from 'utils/helper';

import { handleMRTSchema, handleVisiblityMenu } from './helpers';
import { tableESState, tableGlobalState, tableInitialState } from './initialStates';

function isDateFormat(inputString) {
	// Regular expression for MM/DD/YYYY format
	const mmddyyy = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/;
	const mmddyy = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d\d$/;

	// Check if the inputString matches the date format
	return mmddyyy.test(inputString) || mmddyy.test(inputString);
}

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
					const MAX_TEXT_SIZE = 40;

					if (validateUrl(value)) {
						return (
							<a href={value} target="_blank" rel="noreferrer">
								{value?.length > MAX_TEXT_SIZE ? value?.slice(0, MAX_TEXT_SIZE) + '...' : value}
							</a>
						);
					}
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

async function fetchGridViews(client, module) {
	const user = globalStateController.getValue('user');

	const result = await client.query({
		variables: {
			module,
			userId: user._id,
		},
		query: GET_GRID_VIEWS,
	});

	const allGridViews = result?.data?.getGridViews?.gridViews;
	return allGridViews;
}

const tableESStateControllerHandler = state => ({
	initialize: async (
		tableKey,
		{
			esIndex,
			layerIdentifier,
			layerSchema,
			pageSize,
			defaultSort,
			isIncludeInactive,
			isInFiniteScroll,
			columnVirtualization,
			TableSchema,
			defaultFlterMode,
			defaultFilters,
			customProps = {},
			isClientSide = false,
			modelName,
			isSelectAllAllowed = true,
			isAllRowsSelected,
			search,
			fetchMetaData,
			onCustomKeyChange,
			gridViewSettings,
			density = 'comfortable',
			advanceSearch = [],
			// isDefaultGridView,
			enableHiding = true,
			refetchQueries = [],
			globalFilter,
			excludeFields,
			...rest
		},
		client
	) => {
		if (state.TableSchema.get()) {
			return;
		}

		let _Schema = TableSchema;
		if (!rest.isGeneric && !isClientSide && !rest.enableEditing) {
			_Schema.unshift({
				...CommonSchema.SELECT_SOME,
				Header: () => <TableHeaderMoreOptions tableKey={tableKey} />,
				Cell: ({ row }) => {
					const tableState = tableController(tableKey).useState(['mrtTableRef']);
					const tableStateValues = tableState.stateValues;

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
		}

		if (fetchMetaData) {
			_Schema = await fetchTableSchema(client, fetchMetaData, TableSchema, onCustomKeyChange, tableKey);
		}

		let formatedGridView = null;

		let gridView = {};

		const selectedView = viewStateController('MapView').getValue('selectedView');
		const selectedMapViewFilters = selectedView?.filters || [];

		const mapViewFilters = selectedMapViewFilters
			.filter(view => view.dataSourceName === layerIdentifier)
			.filter(view => view?.filterValues?.length > 0 || ['empty', 'notEmpty'].includes(view?.filterType))
			.map(view => getFormattedFilterBasedOnType(view.filterType, view.fieldName, view.filterValues));

		globalStateController.updateState({
			columnFilterModesFnRefs: {},
		});

		if (gridViewSettings) {
			// Fetch user-specific or default grid views based on provided settings and overrides.
			const allGridViews = await fetchGridViews(client, gridViewSettings.module);
			const defaultViewOverride = allGridViews?.find(obj => obj.name === rest.gridViewOverride);

			const gridViewController = viewStateController(tableKey);
			gridViewController?.initialize({
				client,
				allViews: allGridViews,
				isTable: true,
				Icon: gridViewSettings.Icon,
				label: gridViewSettings.label,
				isNotBreadcrumbView: TableSchema.isNotBreadcrumbView || false,
				...(defaultViewOverride && { defaultViewOverride }),
			});

			const selectedGridView = gridViewController.getValue('selectedView');
			formatedGridView = formatGridViewToMRT(selectedGridView);
			gridView = { selectedGridView };
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
			modelName,
			defaultFlterMode,
			search,
			columnVirtualization,
			globalFilter,
			layerIdentifier,
			isClientSide,
			excludeFields,
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

		if (rest?.disableRowSelection) {
			pull(defaultColumnsOrdering, 'over-ride-checkbox');
			pull(defaultColumnsPinning.left, 'over-ride-checkbox');
		}

		const formattedMapViewFilters = mapViewFilters
			.map(({ field, value, ...rest }) => ({
				...rest,
				field: field.replace('.keyword', ''),
				value,
			}))
			.filter(({ value }) => Boolean(value));

		const combinedFilters = [...(formatedGridView?.filters || []), ...formattedMapViewFilters];

		let stateToUpdate = {
			...rest,
			initialized: true,
			tableKey,
			pageSize,
			isClientSide,
			modelName,
			data: { rows: [], total: 0 },
			isLoading: false,
			isFetching: false,
			isError: false,
			customProps: isEmpty(state?.customProps?.get({ noproxy: true }))
				? customProps
				: state?.customProps?.get({ noproxy: true }),
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
			defaultSort,
			filterModes,
			commentsCounter: [],
			tagsList: [],
			isTrackedList: [],
		};

		const _defaultFilters = defaultFilters || state?.defaultFilters?.get({ noproxy: true }) || [];
		if (isClientSide) {
			stateToUpdate = {
				...stateToUpdate,
				isSelectAllAllowed: isSelectAllAllowed || false,
				isAllRowsSelected: isAllRowsSelected || false,
				showColumnFilters: false,
				defaultFilters: filterValidFilters(_defaultFilters),
				filters: [],
				sorting: [],
				columnVisibility,
				columnOrdering: defaultColumnsOrdering,
				columnPinning: defaultColumnsPinning,
			};
		} else {
			stateToUpdate = {
				...stateToUpdate,
				refetchQueries,
				defaultFlterMode,
				search,
				esIndex,
				fetchMetaData,
				gridViewSettings,
				gridView,
				isSelectall: false,
				isSelectAllAllowed,
				isAllRowsSelected,
				showColumnFilters: formatedGridView?.filters ? true : false,
				defaultFilters: filterValidFilters(_defaultFilters),
				filters: filterValidFilters(extractUniqueFilters(combinedFilters)),
				layerIdentifier,
				layerSchema,
				sorting: formatedGridView?.sorting ? formatedGridView.sorting : [],
				columnVisibility: formatedGridView?.columnVisibility ? formatedGridView.columnVisibility : columnVisibility,
				isIncludeInactive,
				density,
				advanceSearch,
				enableHiding,
				columnOrdering: formatedGridView?.columnOrdering ? formatedGridView.columnOrdering : defaultColumnsOrdering,
				columnPinning: formatedGridView?.columnPinning ? formatedGridView.columnPinning : defaultColumnsPinning,
			};
		}

		// Set default state referneces
		stateToUpdate = {
			...stateToUpdate,
			defaultTableSchema: _TableSchema,
			defaultColumnsOrdering: defaultColumnsOrdering,
			defaultColumnPinning: defaultColumnsPinning,
		};

		if (!isClientSide) {
			stateToUpdate.columnVisibility['mrt-row-select'] = false;
		}

		state.merge(stateToUpdate);

		if (mapViewFilters.length > 0) {
			tableController(tableKey).setShowColumnFilters(true);
		}
		if (customLayersFieldAccessors[layerIdentifier]) {
			mapViewFilters?.forEach(filter => {
				tableController(tableKey).setFilterMode(filter?.field.replace('.keyword', ''), filter.searchType);
			});
		}
	},

	updateCustomProps: customProps => {
		const currentState = state.customProps.get({ noproxy: true });
		const updatedState = {
			...currentState,
			...customProps,
		};

		if (!isEqual(currentState, updatedState)) {
			state.customProps.set(updatedState);
		}
	},

	setInitialFilterMode: (columnSchema, mode, column) => {
		const isClientSide = state.isClientSide.get();

		const updatedColumnnSchema = {};

		switch (mode) {
			case 'singleselect':
				if (isClientSide) {
					updatedColumnnSchema.filterVariant = 'select';
				} else {
					updatedColumnnSchema.Filter = columnSchema?.SingleSelect;
				}
				break;

			case 'multiselect':
				if (isClientSide) {
					updatedColumnnSchema.filterVariant = 'text';
				} // 'multi-select'
				else {
					updatedColumnnSchema.Filter = columnSchema?.MultiSelect;
				}
				break;

			default:
				if (isClientSide) {
					updatedColumnnSchema.filterVariant = 'text';
				} else {
					updatedColumnnSchema.Filter = null;
				}
				break;
		}

		if (!columnSchema?.name) {
			return updatedColumnnSchema;
		}

		state.filterModes?.merge({
			[column]: {
				mode,
				isKeyword: columnSchema.name.includes('.keyword'),
			},
		});

		return updatedColumnnSchema;
	},
	setFilterMode: (column, mode, callSelectFilterMode = true) => {
		const index = state.TableSchema?.get({ noproxy: true })?.findIndex(
			element => element.accessorKey === column || element.id === column
		);
		const columnSchema = state.TableSchema?.[index]?.get({
			noproxy: true,
		});
		const tableKey = state.tableKey.get();

		const updatedColumnnSchema = tableController(tableKey).setInitialFilterMode(columnSchema, mode, column);

		state.TableSchema?.[index]?.merge(updatedColumnnSchema);

		const columnFilterModesFnRefs = globalStateController.getValue('columnFilterModesFnRefs');

		if (callSelectFilterMode) {
			columnFilterModesFnRefs?.[state.tableKey.get({ noproxy: true })]?.[column]?.onSelectFilterMode(mode);
		}
	},

	setSelectAll: value => {
		state.isSelectall.set(value);
	},

	setColumnVisibility: visibility => {
		const isClientSide = state.isClientSide.get();

		if (!deepEqual(state.columnVisibility?.get({ noproxy: true }), visibility)) {
			if (!isClientSide) {
				visibility['mrt-row-select'] = false;
			}

			state.columnVisibility?.set(visibility);
		}
	},

	setColumnPinning: (columnPinning, oldPinning, TableSchema) => {
		if (!deepEqual(state.columnPinning?.get({ noproxy: true }), columnPinning)) {
			state.columnPinning?.set(columnPinning);

			let changeTableSchema = false;
			columnPinning.left.forEach(col => {
				if (oldPinning.left.find(l => l === col)) {
					return;
				}
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
				if (columnPinning.left.find(l => l === col)) {
					return;
				}
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
			if (changeTableSchema) {
				state.TableSchema.set(TableSchema);
			}
		}
		handleVisiblityMenu();
	},

	setColumnOrdering: order => {
		const isClientSide = state.isClientSide.get();

		const updatedOrder = isClientSide ? order : order.filter(col => col !== 'mrt-row-select');

		if (!deepEqual(state.columnOrdering?.get({ noproxy: true }), updatedOrder)) {
			state.columnOrdering?.set(updatedOrder);
		}
	},

	setColumnCheck: rowCheck => {
		if (!deepEqual(state.rowSelection?.get({ noproxy: true }), rowCheck)) {
			state.rowSelection?.set(rowCheck);
		}
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
		if (column?.isArrayKey) {
			filter.isArrayKey = true;
		}
		if (column?.type === 'date') {
			filter.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			if (filter.type !== 'advanced' || (filter.type === 'advanced' && !filter.searchType)) {
				filter.type = 'advanced';
				filter.searchType = 'betweenInclusive';
				filter.columnType = 'date';
			} else {
				if (Array.isArray(filter.value)) {
					if (!isDateFormat(filter.value[0]) || !isDateFormat(filter.value[1])) {
						return;
					}

					const date1 = new Date(filter.value[0]);
					const date2 = new Date(filter.value[1]);

					filter.value = [formatDate(date1.toISOString()), formatDate(date2.toISOString())];
				} else {
					if (!isDateFormat(filter.value)) {
						return;
					}
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
		) {
			return;
		}

		const selectedView = viewStateController('MapView').getValue('selectedView');
		const mapViewsFitlers = selectedView?.filters || [];

		const tableState = state.get({
			noproxy: true,
		});
		if (tableState?.layerIdentifier) {
			const identifierMapViewSchema =
				customLayersFieldAccessors[tableState?.layerIdentifier]?.keys || tableState?.layerSchema;
			if (
				identifierMapViewSchema &&
				identifierMapViewSchema?.find(key => key.value.replace('.keyword', '') === filter.field.replace('.keyword', ''))
			) {
				const existingFilter = mapViewsFitlers.find(
					({ fieldName, filterType }) =>
						(fieldName?.value || fieldName).replace('.keyword', '') === filter.field &&
						filterType === filter?.searchType
				);

				const isValuesEqual = _.isEqual(
					existingFilter?.filterValues,
					typeof filter.value === 'string' ? [filter.value] : filter.value
				);
				const isNonValuesFilter = ['empty', 'notEmpty'].includes(filter.searchType);

				const updateMapFilter = isNonValuesFilter && existingFilter?.filterType === filter?.searchType;
				if (!(isValuesEqual || updateMapFilter)) {
					const newFilter = {
						dataSourceName: tableState?.layerIdentifier,
						filterType: tableState?.filterModes[filter.field.replace('.keyword', '')]?.mode
							? tableState.filterModes[filter.field.replace('.keyword', '')]?.mode
							: existingFilter?.filterType
								? existingFilter.filterType
								: tableState?.esIndex === 'shapefile_flat' || typeof filter.value === 'object'
									? 'multiselect'
									: 'singleselect',

						fieldName: filter.field,
						filterValues: typeof filter.value === 'string' ? [filter.value] : filter.value,
					};

					const myNewMapViewFilters = [
						...mapViewsFitlers.filter(
							({ fieldName, dataSourceName }) =>
								(fieldName?.value || fieldName).replace('.keyword', '') !== filter.field ||
								dataSourceName !== tableState?.layerIdentifier
						),
						newFilter,
					];

					viewStateController('MapView').updateState({
						selectedView: {
							...selectedView,
							filters: myNewMapViewFilters,
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

	clearFilter: (field, updateMapView = true) => {
		const filtersState = state.filters?.get({ noproxy: true });
		const selecteView = viewStateController('MapView').getValue('selecteView');
		const mapViewsFitlers = selecteView?.filters || [];
		if (
			mapViewsFitlers.find(({ fieldName }) => (fieldName?.value || fieldName)?.replace('.keyword', '') === field) &&
			updateMapView
		) {
			const tableState = state.get({
				noproxy: true,
			});

			if (tableState?.layerIdentifier) {
				viewStateController('MapView').updateState({
					selectedView: {
						...selecteView,
						filters: [
							...mapViewsFitlers.filter(
								({ dataSourceName, fieldName }) =>
									(fieldName?.value || fieldName).replace('.keyword', '') !== field ||
									dataSourceName !== tableState?.layerIdentifier
							),
						],
					},
				});
			}
		}

		if (!filtersState.find(filter => filter.field === field)) {
			return;
		}

		state.filters?.set(filtersState.filter(filter => filter.field !== field));
	},

	clearFilters: () => {
		const filtersState = state.filters?.get({ noproxy: true });

		if (!filtersState?.length === 0) {
			return;
		}

		state.filters?.set(filtersState.filter(filter => filter.isMapViewFilter));
	},

	syncFilters: filters => {
		const filtersState = state.filters?.get({ noproxy: true });

		if (filtersState.length <= filters.length) {
			return;
		}

		const filterKeys = filters.map(filter => filter.id);

		const selectedView = viewStateController('MapView').getValue('selectedView');
		const mapViewsFitlers = selectedView?.filters || [];

		const tableState = state.get({
			noproxy: true,
		});

		const keysToClear = filtersState
			.filter(filter => !filterKeys.includes(filter.field.replace(/.keyword/, 'g', '')))
			.map(filter => filter.field);

		if (tableState?.layerIdentifier) {
			viewStateController('MapView').updateState({
				selectedView: {
					...selectedView,
					filters: [
						...mapViewsFitlers.filter(
							({ dataSourceName, fieldName }) =>
								!keysToClear?.includes((fieldName?.value || fieldName)?.replace('.keyword', '')) ||
								dataSourceName !== tableState?.layerIdentifier
						),
					],
				},
			});
		}

		state.filters?.set(filtersState.filter(filter => !keysToClear.includes(filter.field)));
	},

	setIsAllRowsSelected: value => {
		if (!state.isSelectAllAllowed.get()) {
			return;
		}

		if (!isEqual(value, state.isAllRowsSelected.get())) {
			state.isAllRowsSelected.set(value);
		}
	},

	setShowColumnFilters: value => {
		if (!isEqual(value, state.showColumnFilters.get())) {
			state.showColumnFilters.set(value);
		}
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

			if (nestedKey) {
				excludedKeys.push(nestedKey);
			}

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
			layerIdentifier,
		} = state.get({
			noproxy: true,
		});

		if (!isGeneric || rows?.length === 0) {
			return genericState;
		}

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
			layerIdentifier,
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

	setEditedData: (rowId, editedRow) => {
		const tableKey = state.tableKey.get();
		const data = state.data.get({ noproxy: true });

		const currentRow = data.rows.find(r => r._id === rowId);

		const changed = compareObjects(editedRow, currentRow);

		if (changed) {
			const editedData = state.editedData.get({ noproxy: true });
			state.editedData.set({
				...editedData,
				[rowId]: editedRow,
			});
		} else {
			tableController(tableKey).clearEditedRow(rowId);
		}
	},

	setValidationErrors: (rowId, columnId, validationError) => {
		const validationErrors = state.validationErrors.get({ noproxy: true });

		state.validationErrors.set({
			...validationErrors,
			[rowId]: {
				...validationErrors[rowId],
				[columnId]: validationError,
			},
		});
	},

	clearEditedRow: rowId => {
		state.editedData.merge({
			[rowId]: undefined,
		});
		state.validationErrors.merge({
			[rowId]: undefined,
		});
	},

	clearEditing: () => {
		state.editedData.set({});
		state.validationErrors.merge({});
		state.isCreateMode.merge(false);
	},

	applyGridView: slectedView => {
		const tableKey = state.tableKey.get();
		const Controller = tableController(tableKey);

		const TableSchema = Controller.getValue('TableSchema');
		const columnPinning = Controller.getValue('columnPinning');
		if (slectedView?.columns) {
			const columnstoShow = slectedView?.columns.reduce((acc, obj) => {
				acc[obj.name] = obj.display;
				return acc;
			}, {});

			Controller.setColumnVisibility(columnstoShow);
		} else {
			const defaultVisibility = TableSchema?.reduce(
				(acc, cur) => ({ ...acc, [cur.accessorKey || cur.id]: !cur?.hidden }),
				{}
			);
			Controller.setColumnVisibility(defaultVisibility);
		}
		if (slectedView?.filters?.length) {
			Controller.setShowColumnFilters(true);
			Controller.clearFilters();
			for (const filter of slectedView?.filters || []) {
				Controller.setFilter(filter);
			}
			// Controller.syncFilters(slectedView.filters);
			// Controller.setFilters(slectedView.filters);
		} else {
			Controller.setShowColumnFilters(false);
			Controller.clearFilters();
		}
		if (slectedView?.sorting) {
			Controller.setSorting(slectedView?.sorting);
		} else {
			Controller.setSorting([]);
		}
		if (slectedView?.columnPinning?.left?.length) {
			let filterLeftPinning = slectedView?.columnPinning?.left?.map(element =>
				element === 'mrt-row-select' ? 'over-ride-checkbox' : element
			);
			const newColumnPinning = {
				left: filterLeftPinning,
			};
			Controller.setColumnPinning(newColumnPinning, columnPinning, TableSchema);
		} else {
			const pinnedColumns = TableSchema?.filter(column => column.isPinned);
			const pinnedFields = pinnedColumns?.map(column => column.id || column.accessorKey);
			Controller.setColumnPinning(columnPinning, pinnedFields, TableSchema);
		}
		if (slectedView?.columnOrdering) {
			const newColumnOrder = slectedView?.columnOrdering?.map(element =>
				element === 'mrt-row-select' ? 'over-ride-checkbox' : element
			);
			Controller.setColumnOrdering(newColumnOrder);
		} else {
			const columnOrder = TableSchema.map(column => column.accessorKey || column.id);
			const defaultColumnOrder = _.concat(['over-ride-checkbox', 'mrt-row-numbers'], _.slice(columnOrder, 1));
			Controller.setColumnOrdering(defaultColumnOrder);
		}
	},

	getGridViewProperties: () => {
		const tableKey = state.tableKey.get();
		const Controller = tableController(tableKey);
		const tableStateValues = Controller.getValues([
			'filters',
			'sorting',
			'groupedField',
			'columnPinning',
			'columnOrdering',
			'columnVisibility',
		]);

		return {
			filters: tableStateValues?.filters,
			columns: Object.entries(tableStateValues?.columnVisibility).map(([name, display]) => ({
				name,
				display,
			})),
			sorting: tableStateValues?.sorting,
			columnPinning: tableStateValues?.columnPinning,
			groupedField: tableStateValues?.groupedField || [],
			columnOrdering: tableStateValues?.columnOrdering || [],
		};
	},

	getModuleName: () => {
		const tableKey = state.tableKey.get();
		const { module } = tableController(tableKey).getValue('gridViewSettings');
		return module;
	},
});

export const tableController = TableKey => {
	if (!tableESState[TableKey]) {
		tableESState[TableKey] = hookstate(copy(tableInitialState));
	}
	return {
		...tableESStateControllerHandler(tableESState[TableKey]),
		...hookStateController(tableESState[TableKey], copy(tableInitialState)),
	};
};

const tableGlobalControllerHandler = state => ({
	refetch: () => {
		state.refetch.set(!state.refetch.get({ noproxy: true }));
	},
	refetchAdditionalQueries: () => {
		state.refetchAdditionalQueries.set(!state.refetchAdditionalQueries.get({ noproxy: true }));
	},
	reInitialized: () => {
		state.reInitialized.set(!state.reInitialized.get({ noproxy: true }));
	},
	setSelectedTab: tab => {
		if (tab !== state.tabKey.get()) {
			state.tabKey.set(tab);
		}
	},
});

export const tableGlobalController = {
	...tableGlobalControllerHandler(tableGlobalState),
	...hookStateController(tableGlobalState, {}),
};
