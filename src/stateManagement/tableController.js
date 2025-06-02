import React from 'react';

import _, { get, isEqual, isEmpty, pull } from 'lodash';

import { extractUniqueFilters, filterValidFilters } from 'components/Map/DeckGL/helpers/common';
import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import { viewStateController } from 'components/MRTTable/Common/GridView/ViewController';
import ReactSelectField from 'components/MRTTable/Common/MetaData/ReactSelectField';
import MRTSelectCheckboxOverRide from 'components/MRTTable/Common/MRT_SelectCheckbox_OverRide';
import OwnerTypeCell from 'components/MRTTable/Common/TableCells/OwnerTypeCell';
import TableHeaderMoreOptions from 'components/MRTTable/Common/TableHeaderMoreOptions';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { columnFilterModesFnRefs } from 'components/MRTTable/utils/filterModeMenu';
import { formatGridViewToMRT } from 'components/MRTTable/utils/helper';
import CustomTextField from 'components/Shared/components/Fields/CustomTextField';
import CustomTypography from 'components/Shared/components/Fields/CustomTypography';
import { copy, deepEqual, formatDate } from 'components/Shared/functions';
import { customLayersFieldAccessors } from 'components/Shared/SidePanel/compoennts/Filters/consts';
import { getFormattedFilterBasedOnType } from 'components/Shared/SidePanel/compoennts/Filters/UserMapFilter';

import { GET_CUSTOM_ASSET_INFO } from 'graphQL/useQueryAllCustomAssetInfo';
import { GET_GRID_VIEWS } from 'graphQL/useQueryGetGridViews';
import { GET_META_DATA } from 'graphQL/useQueryGetMetaData';
import { GETMONGOUSERS } from 'graphQL/useQueryGetUsers';

import { globalStateController } from 'stateManagement/globalStateController';
import { metaDataColumnStateController } from 'stateManagement/metaDataColumnsController';

import { compareObjects } from 'utils/helper';

import { detailCardController } from './detailCardController';
import { handleMRTSchema, handleVisiblityMenu } from './helpers';
import { StateController } from './stateController';

export const tableInitialState = {
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
	showTypes: false,
	editedData: {},
	validationErrors: {},
	isCreateMode: false,
};
export const tableESState = {};

export const tableGlobalState = {
	refetch: false,
	refetchAdditionalQueries: false,
	reInitialized: false,
	tabKey: 0,
};

function isDateFormat(inputString) {
	try {
		const date = new Date(inputString);
		date.toISOString();
	} catch {
		return false;
	}

	// Regular expression for MM/DD/YYYY or MM/DD/YY format
	const mmddyyyy = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{1,7}$/; // Allows 1 to 7 digits for the year
	const mmddyy = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{2}$/; // Two-digit year format
	const iso8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/; // ISO 8601

	// Check if the inputString matches the date format
	return mmddyyyy.test(inputString) || mmddyy.test(inputString) || iso8601.test(inputString);
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
			...item,
			...CommonSchema.STRING_COLUMN,
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
					return (
						<CustomTextField
							fieldAttributes={{
								name: key,
								defaultValue: value,
								placeholder: 'N/A',
								InputProps: { disableUnderline: true },
							}}
							fieldEvents={{
								onBlur: updatedValue => {
									if (value !== updatedValue.trim()) {
										onCustomKeyChange(client, row?.original, updatedValue.trim(), item);
									}
								},
							}}
							fieldConfig={{
								size: 'small',
								variant: 'standard',
								fullWidth: true,
							}}
						/>
					);
				}

				if (item?.type === 'number') {
					return (
						<CustomTextField
							fieldAttributes={{
								name: key,
								defaultValue: value,
								InputProps: { disableUnderline: true },
							}}
							fieldEvents={{
								onBlur: updatedValue => {
									if (value !== updatedValue) {
										onCustomKeyChange(client, row?.original, updatedValue, item);
									}
								},
							}}
							fieldConfig={{
								size: 'small',
								variant: 'standard',
								fullWidth: true,
								type: 'number',
							}}
						/>
					);
				}

				if (item?.type === 'date') {
					return <>{formatDate(value)}</>;
				}

				return <CustomTypography value={value} />;
			},
		};
	});

	metaDataColumnStateController(tableKey)?.initialize(tableKey, metaDataTableSchema);

	const lastColumns = TableSchema.filter(obj => obj.showInLast === true);
	const defaultColumns = TableSchema.filter(obj => obj.showInLast !== true);
	const newTableSchema = [...defaultColumns, ...metaDataTableSchema, ...lastColumns];
	return newTableSchema;
}

// Funtion for fetching dynamic grids schema
async function fetchDynamicTableSchema(client, fetchDynamicSchema, TableSchema) {
	const {
		isAssociatedModel,
		associatedModel,
		tableName,
		variables,
		associationKey = 'relatedObject',
	} = fetchDynamicSchema;

	// Fetch dynamic grid schema
	const result = await client.query({
		variables,
		query: GET_CUSTOM_ASSET_INFO,
	});

	const customAsset = result?.data?.getCustomAssetInfo?.asset;
	globalStateController.updateState({ currentAsset: customAsset });

	const columns = isAssociatedModel ? associatedModel?.modelKeys || [] : customAsset?.modelKeys || [];

	const modelName = isAssociatedModel ? associatedModel?.tableName : tableName;

	// Utility to build full key
	const getColumnKey = mappingKey => (isAssociatedModel ? `${associationKey}.${mappingKey}` : mappingKey);

	// Build dynamic columns
	const dynamicColumns = columns
		.filter(column => !!column?.isGridDisplayed)
		.map(column => {
			let key = getColumnKey(column.mappingKey);
			if (column.keyType === 'user') {
				key += '.name';
			}

			const commonProps = {
				name: key,
				accessorKey: key,
				id: key,
				header: column.label,
				type: column.keyType,
				size: 350,
				isPinned: !!column.isControlColumn,
				isSearchField: !['date', 'user'].includes(column.keyType),
			};

			// Column rendering logic
			const renderCell = ({ row }) => {
				let value = row.getValue(key);
				switch (column.keyType) {
					case 'date':
						value = formatDate(value);
						break;
					case 'boolean':
						value = value ? 'Yes' : 'No';
						break;
				}

				if (column.isControlColumn) {
					const id = isAssociatedModel ? row.getValue(`${associationKey}._id}`) : row.getValue('_id');

					return (
						<ColumnWithLink
							value={value}
							link={`/land/customAsset/${modelName}/details/${id}`}
							onClick={e => {
								e.stopPropagation();
								detailCardController.setBottomSelectedTab(0);
							}}
						/>
					);
				}

				return <>{value}</>;
			};

			switch (column.keyType) {
				case 'boolean':
					return { ...CommonSchema.BOOLEAN_COLUMN, ...commonProps, Cell: renderCell };
				default:
					return {
						...CommonSchema.STRING_COLUMN,
						...commonProps,
						Cell: renderCell,
					};
			}
		});

	// Clean original schema
	const baseSchema = TableSchema.filter(column => !column.isDummy);

	// Build audit columns
	const auditColumns = [
		CommonSchema.OWNER,
		CommonSchema.CREATED_BY,
		CommonSchema.CREATED_DATE,
		CommonSchema.LAST_UPDATED_BY,
		CommonSchema.LAST_UPDATED_DATE,
	].map(column => {
		const key = getColumnKey(column.accessorKey || column.id);
		return {
			...column,
			name: key,
			accessorKey: key,
			id: key,
			Cell: ({ row }) => {
				const value = column.type === 'date' ? formatDate(row.getValue(key)) : row.getValue(key);
				return <>{value}</>;
			},
		};
	});

	return [...baseSchema, ...dynamicColumns, ...auditColumns];
}

async function fetchGridViews(client, module) {
	// Retrieve the current user's information from a global state controller.
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

class TableESStateControllerHandler extends StateController {
	constructor(initialState) {
		super(initialState, TableESStateControllerHandler.name);
		this.autoBind(this);
	}
	async initialize(
		tableKey,
		{
			esIndex,
			layerDataSourceName,
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
			fetchDynamicSchema,
			assetName,
			associatedAssetName,
			...rest
		},
		client
	) {
		if (this.getValue('TableSchema')) {
			return;
		}
		let _Schema = TableSchema;
		if (!rest.isGeneric && !isClientSide && !rest.enableEditing && !rest?.disableRowSelection) {
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

		if (fetchDynamicSchema) {
			_Schema = await fetchDynamicTableSchema(client, fetchDynamicSchema, TableSchema, tableKey);
		}

		if (fetchMetaData) {
			_Schema = await fetchTableSchema(client, fetchMetaData, TableSchema, onCustomKeyChange, tableKey);
		}

		const selectedView = viewStateController('MapView').getValue('selectedView');
		const selectedMapViewFilters = selectedView?.filters || [];

		const mapViewFilters = selectedMapViewFilters
			.filter(view => view.dataSourceName === layerDataSourceName)
			.filter(
				view =>
					view?.filterValues?.length > 0 ||
					['empty', 'notEmpty'].includes(view?.filterType) ||
					(view?.filterValues?.gte && view?.filterValues?.lte)
			)
			.map(view => getFormattedFilterBasedOnType(view.filterType, view.fieldName, view.filterValues));

		Object.keys(columnFilterModesFnRefs).forEach(key => delete columnFilterModesFnRefs[key]);

		let gridView = {};
		let formatedGridView = null;

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
				defaultViewOverride,
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
			layerDataSourceName,
			isClientSide,
			excludeFields,
		});

		const rowSelectId = isClientSide ? 'mrt-row-select' : 'over-ride-checkbox';

		// Set default pinning and ordering
		const defaultColumnsOrdering = [rowSelectId, 'mrt-row-numbers', ...columnOrder];
		const defaultColumnsPinning = {
			left: [
				...(pinnedFields.length > 0
					? _.concat([rowSelectId, 'mrt-row-numbers'], _.slice(pinnedFields, 1))
					: [rowSelectId, 'mrt-row-numbers']),
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
			pull(defaultColumnsOrdering, rowSelectId);
			pull(defaultColumnsPinning.left, rowSelectId);
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
			fetchDynamicSchema,
			assetName,
			associatedAssetName,
			tableKey,
			pageSize,
			isClientSide,
			modelName,
			data: { rows: [], total: 0 },
			isLoading: true,
			isFetching: false,
			isError: false,
			customProps: isEmpty(this.getValue('customProps')) ? customProps : this.getValue('customProps'),
			rowSelection: {},
			searchFields,
			isInFiniteScroll,
			columnVirtualization,
			TableSchema: _TableSchema,
			tableCss,
			groupedField,
			grouping: groupedField || [],
			footerProps: [],
			ExternalFilter,
			defaultSort,
			filterModes,
			commentsCounter: [],
			tagsList: [],
			isTrackedList: [],
			isSummaryGrid: rest.isSummaryGrid ?? false,
		};

		const _defaultFilters = defaultFilters || this.getValue('defaultFilters') || [];
		if (isClientSide) {
			stateToUpdate = {
				...stateToUpdate,
				isSelectAllAllowed,
				isAllRowsSelected,
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
				showColumnFilters: Boolean(formatedGridView?.filters),
				defaultFilters: filterValidFilters(_defaultFilters),
				filters: filterValidFilters(extractUniqueFilters(combinedFilters)),
				layerDataSourceName,
				layerSchema,
				sorting: formatedGridView?.sorting || [],
				columnVisibility: formatedGridView?.columnVisibility || columnVisibility,
				isIncludeInactive,
				density,
				advanceSearch,
				enableHiding,
				columnOrdering: formatedGridView?.columnOrdering || defaultColumnsOrdering,
				columnPinning: formatedGridView?.columnPinning || defaultColumnsPinning,
			};
		}

		// Set default state referneces
		stateToUpdate = {
			...stateToUpdate,
			initialGridView: gridView,
			defaultTableSchema: _TableSchema,
			defaultColumnsOrdering,
			defaultColumnPinning: defaultColumnsPinning,
		};

		if (!isClientSide) {
			stateToUpdate.columnVisibility['mrt-row-select'] = false;
		}

		this.updateState(stateToUpdate);

		if (mapViewFilters.length > 0) {
			tableController(tableKey).setShowColumnFilters(true);
		}
		if (customLayersFieldAccessors[layerDataSourceName]) {
			mapViewFilters?.forEach(filter => {
				tableController(tableKey).setFilterMode(filter?.field.replace('.keyword', ''), filter.searchType);
			});
		}
	}

	updateCustomProps(customProps) {
		const currentState = this.getValue('customProps');
		const updatedState = {
			...currentState,
			...customProps,
		};

		if (!isEqual(currentState, updatedState)) {
			this.updateState({ customProps: updatedState });
		}
	}

	setInitialFilterMode(columnSchema, mode, column) {
		const isClientSide = this.getValue('isClientSide');

		const updatedColumnSchema = {};

		switch (mode) {
			case 'singleselect':
				if (isClientSide) {
					updatedColumnSchema.filterVariant = 'autocomplete';
				} else {
					updatedColumnSchema.Filter = columnSchema?.SingleSelect;
				}
				break;

			case 'multiselect':
				if (isClientSide) {
					updatedColumnSchema.filterVariant = 'text';
				} // 'multi-select'
				else {
					updatedColumnSchema.Filter = columnSchema?.MultiSelect;
				}
				break;

			default:
				if (isClientSide) {
					updatedColumnSchema.filterVariant = 'text';
				} else {
					updatedColumnSchema.Filter = null;
				}
				break;
		}

		if (!columnSchema?.name) {
			return updatedColumnSchema;
		}

		this.updateState({
			filterModes: {
				...this.getValue('filterModes'),
				[column]: { mode },
			},
		});

		return updatedColumnSchema;
	}

	setFilterMode(column, mode, callSelectFilterMode = true) {
		const tableSchema = this.getValue('TableSchema');
		const tableKey = this.getValue('tableKey');

		const index = tableSchema?.findIndex(element => element.accessorKey === column || element.id === column);

		const columnSchema = tableSchema?.[index];

		const updatedColumnSchema = this.setInitialFilterMode(columnSchema, mode, column);

		this.updateState({
			TableSchema:
				this.getValue('TableSchema')?.map((col, i) => (i === index ? { ...col, ...updatedColumnSchema } : col)) || [],
		});

		if (callSelectFilterMode) {
			this.getValue(`columnFilterModesFnRefs.${tableKey}.${column}`)?.onSelectFilterMode(mode);
		}
	}

	setSelectAll(value) {
		this.updateState({ isSelectall: value });
	}

	setColumnVisibility(visibility) {
		const isClientSide = this.getValue('isClientSide');

		if (!deepEqual(this.getValue('columnVisibility'), visibility)) {
			if (!isClientSide) {
				visibility['mrt-row-select'] = false;
			}

			this.updateState({ columnVisibility: visibility });
		}
	}

	setColumnPinning(columnPinning, oldPinning, TableSchema) {
		if (!deepEqual(this.getValue('columnPinning'), columnPinning)) {
			this.updateState({ columnPinning });

			let changeTableSchema = false;

			columnPinning.left.forEach(col => {
				if (oldPinning.left.includes(col)) {
					return;
				}

				TableSchema.forEach(column => {
					if (column.id === col) {
						Object.assign(column, {
							enableResizing: false,
							enableColumnDragging: false,
							enableColumnOrdering: false,
							enableHiding: false,
						});
						changeTableSchema = true;
					}
				});
			});

			oldPinning.left.forEach(col => {
				if (columnPinning.left.includes(col)) {
					return;
				}

				TableSchema.forEach(column => {
					if (column.id === col) {
						Object.assign(column, {
							enableResizing: true,
							enableColumnDragging: true,
							enableColumnOrdering: true,
							enableHiding: true,
						});
						changeTableSchema = true;
					}
				});
			});

			if (changeTableSchema) {
				this.updateState({ TableSchema });
			}
		}

		handleVisiblityMenu();
	}

	setColumnOrdering(order) {
		const isClientSide = this.getValue('isClientSide');

		const updatedOrder = isClientSide ? order : order.filter(col => col !== 'mrt-row-select');

		if (!deepEqual(this.getValue('columnOrdering'), updatedOrder)) {
			this.updateState({ columnOrdering: updatedOrder });
		}
	}

	setColumnCheck(rowCheck) {
		if (!deepEqual(this.getValue('rowSelection'), rowCheck)) {
			this.updateState({ rowSelection: rowCheck });
		}
	}

	setPagination(pagination) {
		if (!deepEqual(this.getValue('pagination'), pagination)) {
			this.updateState({ pagination: pagination });
		}
	}

	setGlobalFilter(globalFilter) {
		if (!deepEqual(this.getValue('globalFilter'), globalFilter)) {
			this.updateState({ globalFilter: globalFilter });
		}
	}

	getGlobalFilter() {
		return this.getValue('globalFilter');
	}

	setFilter(filter) {
		const tableSchema = this.getValue('TableSchema') || [];
		const updatedFilter = copy(filter);

		const column = tableSchema.find(col => col.id === updatedFilter.field || col.accessorKey === updatedFilter.field);
		if (column?.isArrayKey) {
			updatedFilter.isArrayKey = true;
		}

		if (column?.type === 'date' || column?.columnType === 'date') {
			updatedFilter.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

			if (updatedFilter.type !== 'advanced' || (updatedFilter.type === 'advanced' && !updatedFilter.searchType)) {
				Object.assign(updatedFilter, { type: 'advanced', searchType: 'betweenInclusive', columnType: 'date' });
			} else {
				if (Array.isArray(updatedFilter.value)) {
					if (!isDateFormat(updatedFilter.value[0]) || !isDateFormat(updatedFilter.value[1])) {
						return;
					}

					const date1 = new Date(updatedFilter.value[0]);
					const date2 = new Date(updatedFilter.value[1]);

					updatedFilter.value = [formatDate(date1.toISOString()), formatDate(date2.toISOString())];
				} else {
					if (!isDateFormat(updatedFilter.value)) {
						return;
					}

					const date = new Date(updatedFilter.value);
					updatedFilter.value = formatDate(date.toISOString());
				}
			}
		}

		const filtersState = this.getValue('filters');

		if (
			deepEqual(
				filtersState.find(({ field }) => field === updatedFilter.field),
				updatedFilter
			)
		) {
			return;
		}

		const selectedView = viewStateController('MapView').getValue('selectedView');
		const mapViewsFilters = selectedView?.filters || [];

		const tableState = this.getAllValues();
		if (tableState?.layerDataSourceName) {
			const identifierMapViewSchema =
				customLayersFieldAccessors[tableState?.layerDataSourceName]?.keys || tableState?.layerSchema;
			if (
				identifierMapViewSchema &&
				identifierMapViewSchema.find(
					key => key.value.replace('.keyword', '') === updatedFilter.field.replace('.keyword', '')
				)
			) {
				const existingFilter = mapViewsFilters.find(
					({ fieldName, filterType }) =>
						(fieldName?.value || fieldName).replace('.keyword', '') === updatedFilter.field &&
						filterType === updatedFilter?.searchType
				);

				const isValuesEqual = _.isEqual(
					existingFilter?.filterValues,
					typeof updatedFilter.value === 'string' ? [updatedFilter.value] : updatedFilter.value
				);
				const isNonValuesFilter = ['empty', 'notEmpty'].includes(updatedFilter.searchType);
				const updateMapFilter = isNonValuesFilter && existingFilter?.filterType === updatedFilter?.searchType;

				if (!(isValuesEqual || updateMapFilter)) {
					const newFilter = {
						dataSourceName: tableState?.layerDataSourceName,
						filterType:
							tableState?.filterModes[updatedFilter.field.replace('.keyword', '')]?.mode ||
							existingFilter?.filterType ||
							(tableState?.esIndex === 'shapefile_flat' || typeof updatedFilter.value === 'object'
								? 'multiselect'
								: updatedFilter?.searchType || 'singleselect'),
						fieldName: updatedFilter.field,
						filterValues: typeof updatedFilter.value === 'string' ? [updatedFilter.value] : updatedFilter.value,
					};

					const updatedMapViewFilters = [
						...mapViewsFilters.filter(
							({ fieldName, dataSourceName }) =>
								(fieldName?.value || fieldName).replace('.keyword', '') !== updatedFilter.field ||
								dataSourceName !== tableState?.layerDataSourceName
						),
						newFilter,
					];

					viewStateController('MapView').updateState({
						shouldSyncView: true,
						selectedView: {
							...selectedView,
							filters: updatedMapViewFilters,
						},
					});
				}
			}
		}

		this.updateState({
			filters: [...filtersState.filter(({ field }) => field !== updatedFilter.field), updatedFilter],
		});
	}

	getExternalFilter() {
		const filtersState = this.getValue('filters') || [];
		const requiredFields = this.getValue('ExternalFilter')?.map(f => f.replaceAll('.keyword', '')) || [];

		return filtersState.filter(filter => requiredFields.includes(filter.field.replaceAll('.keyword', '')));
	}

	clearFilter(field, updateMapView = true, shouldSyncView = true) {
		const filtersState = this.getValue('filters') || [];
		const selectedView = viewStateController('MapView').getValue('selectedView');
		const mapViewsFitlers = selectedView?.filters || [];

		if (
			mapViewsFitlers.find(({ fieldName }) => (fieldName?.value || fieldName)?.replace('.keyword', '') === field) &&
			updateMapView
		) {
			const tableState = this.getAllValues();

			if (tableState?.layerDataSourceName) {
				viewStateController('MapView').updateState({
					shouldSyncView,
					selectedView: {
						...selectedView,
						filters: [
							...mapViewsFitlers.filter(
								({ dataSourceName, fieldName }) =>
									(fieldName?.value || fieldName)?.replace('.keyword', '') !== field ||
									dataSourceName !== tableState?.layerDataSourceName
							),
						],
					},
				});
			}
		}

		if (!filtersState.find(filter => filter.field === field)) {
			return;
		}

		this.updateState({
			filters: filtersState.filter(filter => filter.field !== field),
		});
	}

	clearFilters() {
		const tableKey = this.getValue('tableKey');
		const filtersState = this.getValue('filters') || [];

		if (filtersState.length === 0) {
			return;
		}

		filtersState.forEach(filter => {
			tableController(tableKey).clearFilter(filter?.field);
			tableController(tableKey).setFilterMode(filter?.field?.replace('.keyword', ''), 'singleselect', false);
		});
	}

	syncFilters(filters) {
		const filtersState = this.getValue('filters') || [];

		if (filtersState.length <= filters.length) {
			return;
		}

		const filterKeys = filters.map(filter => filter.id);

		const selectedView = viewStateController('MapView').getValue('selectedView');
		const mapViewsFitlers = selectedView?.filters || [];

		const tableState = this.getAllValues();

		const keysToClear = filtersState
			.filter(filter => !filterKeys.includes(filter.field.replace(/.keyword/, 'g', '')))
			.map(filter => filter.field);

		if (tableState?.layerDataSourceName) {
			viewStateController('MapView').updateState({
				shouldSyncView: true,
				selectedView: {
					...selectedView,
					filters: [
						...mapViewsFitlers.filter(
							({ dataSourceName, fieldName }) =>
								!keysToClear?.includes((fieldName?.value || fieldName)?.replace('.keyword', '')) ||
								dataSourceName !== tableState?.layerDataSourceName
						),
					],
				},
			});
		}

		this.updateState({
			filters: filtersState.filter(filter => !keysToClear.includes(filter.field)),
		});
	}

	setIsAllRowsSelected(value) {
		if (!this.getValue('isSelectAllAllowed')) {
			return;
		}

		if (!isEqual(value, this.getValue('isAllRowsSelected'))) {
			this.updateState({ isAllRowsSelected: value });
		}
	}

	setShowColumnFilters(value) {
		if (!isEqual(value, this.getValue('showColumnFilters'))) {
			this.updateState({ showColumnFilters: value });
		}
	}

	setSorting(sorting) {
		this.updateState({ sorting: sorting });
	}

	setFilters(filters) {
		const tableKey = this.getValue('tableKey');
		filters.forEach(filter => {
			const searchType = Array.isArray(filter?.value) ? 'multiselect' : 'singleselect';
			tableController(tableKey).setFilterMode(filter?.field?.replace('.keyword', ''), filter?.searchType || searchType);
			tableController(tableKey).setFilter(filter);
		});
	}

	setIncludeInactive(isIncludeInactive) {
		this.updateState({ isIncludeInactive: isIncludeInactive });
	}

	setMrtTableRef(mrtTableRef) {
		if (!deepEqual(this.getValue('mrtTableRef'), mrtTableRef)) {
			this.updateState({ mrtTableRef: mrtTableRef });
		}
	}

	setAdvanceSearch(value, otherState) {
		if (!isEqual(value, this.getValue('advanceSearch'))) {
			this.mergeState({
				advanceSearch: value,
				...(otherState && { globalFilter: otherState.globalFilter || '' }),
			});
		}
	}

	getGenericState(rows) {
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

				if (aIndex !== -1 && bIndex !== -1) {
					return aIndex - bIndex;
				}

				if (aIndex !== -1) {
					return -1;
				}

				if (bIndex !== -1) {
					return 1;
				}

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
			layerDataSourceName,
		} = this.getValues([
			'isGeneric',
			'orderKeys',
			'excludedKeys',
			'nestedKey',
			'generateSchema',
			'tableKey',
			'esIndex',
			'defaultFlterMode',
			'search',
			'columnVirtualization',
			'layerDataSourceName',
		]);

		if (!isGeneric || rows?.length === 0) {
			return genericState;
		}

		const keys = getGenericKeys(orderKeys, excludedKeys, nestedKey);

		const {
			_TableSchema,
			tableCss,
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
			layerDataSourceName,
		});

		genericState.TableSchema = _TableSchema;
		genericState.tableCss = tableCss;
		genericState.groupedField = groupedField;
		genericState.ExternalFilter = ExternalFilter;
		genericState.columnVisibility = columnVisibility;
		genericState.filterModes = filterModes;
		genericState.columnOrder = columnOrder;
		genericState.pinnedFields = pinnedFields;

		return genericState;
	}

	setEditedData(rowId, editedRow) {
		const { tableKey, data, editedData } = this.getValues(['tableKey', 'data', 'editedData']);

		const currentRow = data.rows.find(r => r._id === rowId);
		const changed = compareObjects(editedRow, currentRow);

		if (changed) {
			this.updateState({
				editedData: {
					...editedData,
					[rowId]: editedRow,
				},
			});
		} else {
			tableController(tableKey).clearEditedRow(rowId);
		}
	}

	setValidationErrors(rowId, columnId, validationError) {
		const { validationErrors } = this.getValues(['validationErrors']);

		this.updateState({
			validationErrors: {
				...validationErrors,
				[rowId]: {
					...validationErrors[rowId],
					[columnId]: validationError,
				},
			},
		});
	}

	clearEditedRow(rowId) {
		const { editedData, validationErrors } = this.getValues(['editedData', 'validationErrors']);

		this.updateState({
			editedData: {
				...editedData,
				[rowId]: undefined,
			},
			validationErrors: {
				...validationErrors,
				[rowId]: undefined,
			},
		});
	}

	clearEditing() {
		const validationErrors = this.getValue('validationErrors');

		this.updateState({
			editedData: {},
			validationErrors: { ...validationErrors },
			isCreateMode: false,
		});
	}

	applyGridView(selectedView) {
		const tableKey = this.getValue('tableKey');
		const Controller = tableController(tableKey);

		const TableSchema = Controller.getValue('TableSchema');
		const columnPinning = Controller.getValue('columnPinning');

		const columnVisibility =
			selectedView?.columns?.reduce((acc, obj) => {
				acc[obj.name] = obj.display;
				return acc;
			}, {}) || TableSchema?.reduce((acc, cur) => ({ ...acc, [cur.accessorKey || cur.id]: !cur?.hidden }), {});
		Controller.setColumnVisibility(columnVisibility);

		if (selectedView?.filters?.length) {
			Controller.setShowColumnFilters(true);
			Controller.clearFilters();
			Controller.setFilters(selectedView?.filters);
		} else {
			Controller.setShowColumnFilters(false);
			Controller.clearFilters();
		}

		Controller.setSorting(selectedView?.sorting || []);

		if (selectedView?.columnPinning?.left?.length) {
			const filterLeftPinning = selectedView.columnPinning.left.map(col =>
				col === 'mrt-row-select' ? 'over-ride-checkbox' : col
			);
			Controller.setColumnPinning({ left: filterLeftPinning }, columnPinning, TableSchema);
		} else {
			const pinnedFields = TableSchema?.filter(col => col.isPinned)?.map(col => col.id || col.accessorKey);
			Controller.setColumnPinning(columnPinning, pinnedFields, TableSchema);
		}

		const columnOrder =
			selectedView?.columnOrdering?.map(col => (col === 'mrt-row-select' ? 'over-ride-checkbox' : col)) ||
			_.concat(
				['over-ride-checkbox', 'mrt-row-numbers'],
				_.slice(
					TableSchema.map(col => col.accessorKey || col.id),
					1
				)
			);

		Controller.setColumnOrdering(columnOrder);
	}

	getGridViewProperties() {
		const tableKey = this.getValue('tableKey');
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
	}

	getModuleName() {
		const tableKey = this.getValue('tableKey');
		return tableController(tableKey).getValue('gridViewSettings')?.module;
	}
}

export const tableController = TableKey => {
	if (!tableESState[TableKey]) {
		tableESState[TableKey] = new TableESStateControllerHandler(tableInitialState);
	}

	return tableESState[TableKey];
};

class TableGlobalController extends StateController {
	constructor(initialState) {
		super(initialState, TableGlobalController.name);
		this.autoBind(this);
	}

	refetch() {
		this.updateState({ refetch: !this.getValue('refetch') });
	}
	refetchAdditionalQueries() {
		this.updateState({ refetchAdditionalQueries: !this.getValue('refetchAdditionalQueries') });
	}
	reInitialized() {
		this.updateState({ reInitialized: !this.getValue('reInitialized') });
	}

	async initializeGlobalStates(client) {
		const users = this.getValue('users');
		if (users && users.length > 0) {
			return;
		}
		const result = await client.query({
			variables: {},
			query: GETMONGOUSERS,
		});
		this.updateState({ users: result?.data?.allMongoUsers || [] });
	}

	setSelectedTab(tab) {
		if (tab !== this.getValue('tabKey')) {
			this.updateState({ tabKey: tab });
		}
	}
}

export const tableGlobalController = new TableGlobalController(tableGlobalState);
