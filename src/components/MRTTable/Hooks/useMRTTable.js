import React, { useRef, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import _ from 'lodash';

import useHandleAdditionalQueries from 'components/MRTTable/Hooks/useHandleAdditionalQueries';

import { tableController } from 'stateManagement/tableController';

import useHandleQuery from './useHandleQuery';
import EditRowActions from '../Common/EditTable/EditRowActions';
import ToolbarActions from '../Common/ToolbarActions';
import ToolbarInternalActions from '../Common/ToolbarInternalActions';
import { tableESSimpleFilterModeOtions } from '../utils/data';

const useMRTTable = tableKey => {
	const tableContainerRef = useRef(null); // access the MUI TableContainer element
	const rowVirtualizerInstanceRef = useRef(null); // access the MUI TableContainer element
	const tableRef = useRef(null); // access the MUI Table element
	const Controller = tableController(tableKey);
	const tableState = Controller.useCompleteState();
	const tableStateValues = tableState?.get({ noproxy: true });

	const { isClientSide } = tableStateValues;

	const { fetchMoreOnBottomReached } = useHandleQuery({
		tableRef: tableStateValues?.isInFiniteScroll ? rowVirtualizerInstanceRef : tableRef,
		tableKey,
		tableState,
		tableStateValues,
	});

	const [rowId, setRowId] = useState(null);

	useHandleAdditionalQueries({ Controller, tableKey, tableState, tableStateValues });

	const useStyles = makeStyles(() => ({
		table: tableStateValues?.tableCss || {},
	}));
	const classes = useStyles();

	const localizationOptions = {
		filterCustomFilterFn: 'AutoComplete',
		...(!isClientSide && {
			selectedCountOfRowCountRowsSelected: `${Object.keys(tableStateValues?.rowSelection || {})?.length} of ${tableStateValues?.data.total} row(s) selected`,
		}),
		...(isClientSide && {
			filterSingleselect: 'Single Select', // adding label custom for filter mode
			filterDateGreaterThanOrEqualTo: 'Greater Than or Equal To',
			filterDateLessThanOrEqualTo: 'Less Than or Equal To',
		}),
	};

	const filterFns = {
		// custom implementation for Single Select
		singleselect: (row, id, filterValue) => {
			return row.getValue(id) === filterValue;
		},
		// custom implementation for date comparison
		dateGreaterThanOrEqualTo: (row, id, filterValue) => {
			const rowValue = row.getValue(id);

			const rowDate = new Date(rowValue);
			const filterDate = new Date(filterValue);

			return rowDate >= filterDate;
		},
		// custom implementation for date comparison
		dateLessThanOrEqualTo: (row, id, filterValue) => {
			const rowValue = row.getValue(id);

			const rowDate = new Date(rowValue);
			const filterDate = new Date(filterValue);

			return rowDate <= filterDate;
		},
	};

	if (tableStateValues.asyncRowSelection && !tableStateValues.isSubSetSelect && !isClientSide) {
		localizationOptions.selectedCountOfRowCountRowsSelected = `${tableStateValues?.data.total} of ${tableStateValues?.data.total} row(s) selected`;
	}

	const { CustomToolBar } = tableStateValues;

	return {
		classes,
		initialized: !!tableStateValues,
		tablePropsState: {
			isLoading: tableStateValues?.isLoading,
			showAlertBanner: tableStateValues?.isError,
			showProgressBars: tableStateValues?.isFetching,
			...(!isClientSide && {
				columnFilters: (tableStateValues?.filters || []).map(filter => ({
					...filter,
					id: filter.field,
				})),
				columnPinning: tableStateValues?.columnPinning,
				columnOrder: tableStateValues?.columnOrdering,
				globalFilter: tableStateValues?.globalFilter || '',
				columnVisibility: tableStateValues?.columnVisibility,
				showColumnFilters: tableStateValues?.showColumnFilters,
				sorting: tableStateValues.sorting,
				...(!tableStateValues?.isInFiniteScroll && { pagination: tableStateValues.pagination }),
				grouping: tableStateValues.grouping,
				rowSelection: tableStateValues?.rowSelection,
				density: tableStateValues?.density,
			}),
		},
		tableProps: {
			initialState: {
				columnVisibility: tableStateValues?.columnVisibility,
				expanded: true,
				showColumnFilters: tableStateValues?.showColumnFilters,
				...(isClientSide
					? {
							columnFilters: (tableStateValues?.filters || []).map(filter => ({
								...filter,
								id: filter.field,
							})),
							columnPinning: tableStateValues?.columnPinning,
							globalFilter: tableStateValues?.globalFilter || '',
							sorting: tableStateValues.sorting,
							...(!tableStateValues?.isInFiniteScroll && {
								pagination: tableStateValues.pagination,
							}),
							grouping: tableStateValues.grouping,
						}
					: {
							grouping: tableStateValues?.groupedField ? [tableStateValues?.groupedField] : [],
							columnOrder: tableStateValues?.columnOrdering,
							rowSelection: tableStateValues?.rowSelection,
						}),
			},
			enableRowVirtualization: !!tableStateValues?.isInFiniteScroll,
			enableColumnVirtualization: !!tableStateValues?.columnVirtualization,
			rowVirtualizerInstanceRef, // get access to the virtualizer instance
			enableDensityToggle: false,
			enableColumnFilterModes: true,
			// enableColumnOrdering: true,
			enableColumnOrdering: tableStateValues?.enableColumnOrdering ?? true,
			enableGrouping: tableStateValues?.enableGrouping ?? true,
			enableColumnResizing: true,
			enableRowSelection: !tableStateValues?.disableRowSelection,
			enableColumnPinning: true,
			// enableMultiRowSelection: true,
			// enableSelectAll: true,
			enableStickyHeader: true,
			enableStickyFooter: true,
			enableSorting: tableStateValues?.grouping.length === 0,
			enableFullScreenToggle: false,

			...(tableStateValues.enableEditing && {
				createDisplayMode: tableStateValues.createDisplayMode,
				editDisplayMode: tableStateValues.editDisplayMode,
				enableEditing: tableStateValues.enableEditing,
				enableRowActions: tableStateValues.enableRowActions,
				positionActionsColumn: tableStateValues.positionActionsColumn,
				getRowId: tableStateValues.getRowId,
				onCreatingRowCancel: tableStateValues.onCreatingRowCancel,
				onCreatingRowSave: tableStateValues.onCreatingRowSave,
				renderRowActions: EditRowActions(tableStateValues.onDelete),
				enableSorting: false, // Disable sorting
				enableFilters: false, // Disable filtering
				enableColumnActions: false, // Disable column actions menu
				enableGlobalFilter: false, // Disable global filtering (search)
				enableRowSelection: false, // Disable row selection
				enableColumnDragging: false, // Disable row ordering
			}),

			muiTableBodyRowProps: row => {
				const { enableRowSelected } = tableState.get({ noproxy: true });

				return {
					onClick: e => {
						const { onClickedRow, enableRowSelected } = tableState.get({ noproxy: true });

						const { className } = e.target;
						if (
							onClickedRow &&
							(typeof className === 'object' ||
								className?.includes('MuiTableCell-root') ||
								className?.includes('row-click'))
						) {
							onClickedRow(row?.row?.original);

							// set rowId to apply styling based on row selection
							if (rowId && rowId === row?.row?.original._id) {
								setRowId(null);
							} else {
								enableRowSelected && setRowId(row?.row?.original._id);
							}
						}
					},
					sx: {
						cursor: 'pointer',
						...(rowId && enableRowSelected && rowId === row?.row?.original._id
							? { border: '5px solid rgb(128 128 128 / 40%)' }
							: {}),
					},
				};
			},
			memoMode: 'cells',
			columns: tableStateValues?.TableSchema,
			data: tableStateValues?.data?.rows || [],
			enableRowNumbers: true,
			rowNumberDisplayMode: 'static',
			muiToolbarAlertBannerProps: tableStateValues?.isError
				? {
						color: 'error',
						children: 'Error loading data',
					}
				: undefined,
			muiTableContainerProps: {
				ref: tableContainerRef, // get access to the table container element
				sx: {
					maxHeight: tableStateValues?.maxTableHeight,
					minHeight: tableStateValues?.maxTableHeight,
					height: tableStateValues?.height,
				},
				onScroll: e => fetchMoreOnBottomReached?.(e.target),
			},
			localization: localizationOptions,
			muiTableProps: {
				ref: tableRef, // get access to the table element
			},
			renderTopToolbarCustomActions: props =>
				CustomToolBar ? (
					<ToolbarActions {...props} tableKey={tableKey}>
						<CustomToolBar {...props} tableKey={tableKey} />
					</ToolbarActions>
				) : (
					<ToolbarActions {...props} tableKey={tableKey} />
				),

			...(isClientSide
				? {
						...(tableStateValues?.isInFiniteScroll && { enablePagination: false }),
						selectAllMode: tableStateValues?.isSelectAllAllowed ? 'all' : 'page',
						enableFacetedValues: tableStateValues?.enableFacetedValues,
						filterFns, // adding label custom for filter mode
					}
				: {
						onGroupingChange: groupingFunc => {
							const grouping = tableState.grouping.get({ noproxy: true });

							const newGrouping = groupingFunc(grouping);
							tableState.grouping.set(newGrouping);

							if (newGrouping.length > 0) {
								return tableState.sorting.set([
									{
										id: newGrouping[0],
										desc: false,
									},
								]);
							}

							return newGrouping;
						},
						...(tableStateValues?.isInFiniteScroll && { enablePagination: false }),
						...(!tableStateValues?.isInFiniteScroll && {
							manualPagination: true,
							onPaginationChange: paginationFunc => {
								const pagination = tableState.pagination.get({ noproxy: true });

								const newPagination = paginationFunc(pagination);
								tableState.pagination.set(newPagination);
								return newPagination;
							},
						}),
						manualSorting: true,
						enableHiding: tableStateValues?.enableHiding,
						manualFiltering: true,
						onGlobalFilterChange: globalFilterFunc => {
							const globalFilter = tableState.globalFilter.get({ noproxy: true });

							const newGlobalFilter =
								typeof globalFilterFunc === 'function' ? globalFilterFunc(globalFilter) : globalFilterFunc;

							Controller.setGlobalFilter(newGlobalFilter);

							return newGlobalFilter;
						},
						onColumnPinningChange: pinningFunc => {
							const { columnPinning, TableSchema } = tableState.get({ noproxy: true });

							const newPinning = typeof pinningFunc === 'function' ? pinningFunc(columnPinning) : pinningFunc;

							Controller.setColumnPinning(newPinning, columnPinning, TableSchema);

							return newPinning;
						},
						onRowSelectionChange: checkFunc => {
							if (typeof checkFunc !== 'function') {
								Controller.setIsAllRowsSelected(false);
								Controller.setColumnCheck(checkFunc);
								return;
							}

							const { rowSelection, pageSize, data, asyncRowSelection, isSubSetSelect } = tableState.get({
								noproxy: true,
							});

							let newstate = checkFunc(rowSelection);
							const allNumbers = _.range(0, pageSize);
							const missingNumbers = _.difference(allNumbers, _.keys(newstate).map(Number));
							const selectAll = data?.rows?.length === Object.keys(newstate)?.length && !missingNumbers.length;
							if (selectAll) {
								if (asyncRowSelection) {
									for (let i = 0; i < data?.rows?.length; i++) {
										newstate[i] = true;
									}
									Controller.setColumnCheck(newstate);
									Controller.updateState({
										onScrollCheck: true,
										isSubSetSelect: null,
									});
									return;
								}
								for (let i = 0; i < data?.total; i++) {
									newstate[i] = true;
								}
							}
							let unselectAll = true;

							for (let i = 0; i < data?.rows?.length; i++) {
								if (newstate[i]) {
									unselectAll = false;
									break;
								}
							}

							if (unselectAll) {
								Controller.setIsAllRowsSelected(false);
								newstate = {};
								if (isSubSetSelect) {
									Controller.updateState({
										isSubSetSelect: null,
									});
								}
								Controller.updateState({
									onScrollCheck: false,
								});
							}
							Controller.setColumnCheck(newstate);
						},
						onColumnFiltersChange: filtersFunc => {
							const columnFilters = tableState.filters.get({ noproxy: true });
							const TableSchema = tableState.TableSchema.get({ noproxy: true });
							const emptyFilters = ['empty', 'notEmpty'];

							const formattedColumnFilters = (columnFilters || []).map(filter => ({
								...filter,
								id: filter.field,
								value:
									filter?.columnType === 'number' && emptyFilters.includes(filter?.searchType) ? ' ' : filter.value,
							}));

							const _newFilters = filtersFunc(formattedColumnFilters);

							const newFilters = _newFilters.map(filter => ({
								...filter,
								value:
									filter?.columnType === 'number' && emptyFilters.includes(filter?.searchType) ? '0' : filter.value,
							}));

							const result = [];
							newFilters.forEach(item => {
								const column = TableSchema.find(column => column.id === item.id || column.accessorKey === item.id);
								const idArray = item?.id?.split(',');
								idArray.forEach(idValue => {
									const newItem = {
										id: idValue,
										value: item?.value,
										type: item?.type,
										field: item?.field,
										searchType: item?.searchType,
										isMapViewFilter: item?.isMapViewFilter,
										columnType: column?.type,
									};

									const { mode } = tableState?.filterModes?.get({ noproxy: true })?.[idValue] || {};

									// Ignore "between" filters if both values are empty to prevent unnecessary backend calls
									const areBothValuesEmpty = item?.value?.every?.(v => v === '');
									if (!mode?.includes('between') || !areBothValuesEmpty) {
										result.push(newItem);
									}
								});
							});

							Controller.syncFilters(result);

							result.forEach(filter => {
								const { mode } = tableState?.filterModes?.get({ noproxy: true })?.[filter.id] || {};

								let { value } = filter;
								const { type, oRFilter, columnType, searchType, isMapViewFilter } = filter;
								if (mode && typeof filter.value === 'string') {
									value = columnType === 'number' ? +filter.value || 0 : filter.value;
								}
								if (mode && tableESSimpleFilterModeOtions.inclusive.includes(mode)) {
									value = filter.value.map(value => +value || 0);
								}
								if (columnType === 'date') {
									value = filter.value;
								}

								Controller.setFilter({
									field: filter.id,
									columnType,
									searchType,
									value,
									type,
									isMapViewFilter,
									oRFilter,
									...(mode &&
										!['multiselect', 'singleselect'].includes(mode) && {
											type: 'advanced',
											searchType: mode,
										}),
								});
							});
						},

						onColumnOrderChange: orderingFunc => {
							const ordering = tableState.ordering.get({ noproxy: true });

							const newOrder = typeof orderingFunc === 'function' ? orderingFunc(ordering || []) : orderingFunc;

							Controller.setColumnOrdering(newOrder);

							return newOrder;
						},

						onColumnVisibilityChange: visibilityFunc => {
							let showColumns;
							const { columnVisibility, TableSchema } = tableState.get({ noproxy: true });
							if (typeof visibilityFunc === 'function') {
								showColumns = visibilityFunc(columnVisibility);
							} else if (typeof visibilityFunc === 'object') {
								showColumns = visibilityFunc;
							}

							// Iterate over columns and ensure columns marked as `isAlwaysHidden` remain hidden
							TableSchema.forEach(column => {
								if (column.isAlwaysHidden) {
									showColumns[column.accessorKey || column.id] = false;
								}
							});

							Controller.setColumnVisibility(showColumns);
						},
						onShowColumnFiltersChange: showColumnFilterFunc => {
							const showColumnFilters = tableState.showColumnFilters.get({ noproxy: true });

							const newShowColumnFilters =
								typeof showColumnFilterFunc === 'function'
									? showColumnFilterFunc(showColumnFilters)
									: showColumnFilterFunc;

							tableState.showColumnFilters.set(newShowColumnFilters);

							return newShowColumnFilters;
						},
						onSortingChange: sortingFunc => {
							const sorting = tableState.sorting.get({ noproxy: true });

							const newSorting = sortingFunc(sorting);
							tableState.sorting.set(newSorting);
							return newSorting;
						},
						rowCount: tableStateValues?.data?.total,
						renderToolbarInternalActions: tableStateValues.toolbarInternalActions
							? ({ table }) => {
									const { toolbarInternalActions, enableHiding } = tableState.get({ noproxy: true });

									return (
										<ToolbarInternalActions
											table={table}
											toolbarInternalActions={toolbarInternalActions}
											enableHiding={enableHiding}
										/>
									);
								}
							: undefined,
					}),
		},
	};
};

export default useMRTTable;
