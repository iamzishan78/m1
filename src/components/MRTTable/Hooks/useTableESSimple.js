import { useRef, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import _ from 'lodash';

import useHandleAdditionalQueries from 'components/MRTTable/Hooks/useHandleAdditionalQueries';

import { tableController } from 'hookstate/tableController';

import useHandleQuery from './useHandleQuery';
import ToolbarActions from '../Common/ToolbarActions';
import ToolbarInternalActions from '../Common/ToolbarInternalActions';
import { tableESSimpleFilterModeOtions } from '../utils/data';

const useTableESSimple = tableKey => {
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
			// rowVirtualizerProps: { overscan: 5 },
			enableDensityToggle: false,
			enableColumnFilterModes: true,
			// enableColumnOrdering: true,
			enableColumnOrdering:
				typeof tableStateValues?.columnReordering === 'boolean' ? tableStateValues?.columnReordering : true,
			enableColumnResizing: true,
			enableRowSelection: true,
			enablePinning: true,
			// enableMultiRowSelection: true,
			// enableSelectAll: true,
			enableStickyHeader: true,
			enableStickyFooter: true,
			enableSorting: tableStateValues?.grouping.length === 0,
			muiTableBodyRowProps: row => ({
				onClick: e => {
					const { className } = e.target;
					if (
						tableStateValues?.onClickedRow &&
						(typeof className === 'object' ||
							className?.includes('MuiTableCell-root') ||
							className?.includes('row-click'))
					) {
						tableStateValues?.onClickedRow(row?.row?.original);

						// set rowId to apply styling based on row selection
						if (rowId && rowId === row?.row?.original._id) {
							setRowId(null);
						} else {
							tableStateValues?.enableRowSelected && setRowId(row?.row?.original._id);
						}
					}
				},
				sx: {
					cursor: 'pointer',
					...(rowId && tableStateValues?.enableRowSelected && rowId === row?.row?.original._id
						? { border: '5px solid rgb(128 128 128 / 40%)' }
						: {}),
				},
			}),
			memoMode: 'cells',
			columns: tableStateValues?.TableSchema,
			data: tableStateValues?.data?.rows || [],
			enableRowNumbers: true,
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
						{' '}
						<CustomToolBar {...props} tableKey={tableKey} />
					</ToolbarActions>
				) : (
					<ToolbarActions {...props} tableKey={tableKey} />
				),

			...(isClientSide
				? {
						...(tableStateValues?.groupedField && {
							enableGrouping: true,
							manualGroupinng: true,
							onGroupingChange: groupingFunc => {
								const newGrouping = groupingFunc(tableStateValues.grouping);
								tableState.grouping.set(newGrouping);

								if (newGrouping.length === 1) {
									return tableState.sorting.set([
										{
											id: newGrouping[0],
											desc: false,
										},
									]);
								}

								if (newGrouping.length > 0) {
									tableState.sorting.set([]);
								}
								return newGrouping;
							},
						}),
						...(tableStateValues?.isInFiniteScroll && { enablePagination: false }),
						selectAllMode: tableStateValues?.isSelectAllAllowed ? 'all' : 'page',
						enableFacetedValues: tableStateValues?.enableFacetedValues,
					}
				: {
						enableGrouping:
							typeof tableStateValues?.columnReordering === 'boolean' ? tableStateValues?.columnReordering : true,
						manualGroupinng:
							typeof tableStateValues?.columnReordering === 'boolean' ? tableStateValues?.columnReordering : true,
						onGroupingChange: groupingFunc => {
							const newGrouping = groupingFunc(tableStateValues.grouping);
							tableState.grouping.set(newGrouping);

							if (newGrouping.length === 1) {
								return tableState.sorting.set([
									{
										id: newGrouping[0],
										desc: false,
									},
								]);
							}

							if (newGrouping.length > 0) {
								tableState.sorting.set([]);
							}
							return newGrouping;
						},
						...(tableStateValues?.isInFiniteScroll && { enablePagination: false }),
						...(!tableStateValues?.isInFiniteScroll && {
							manualPagination: true,
							onPaginationChange: paginationFunc => {
								const newPagination = paginationFunc(tableStateValues.pagination);
								tableState.pagination.set(newPagination);
								return newPagination;
							},
						}),
						enableFullScreenToggle: false,
						manualSorting: true,
						enableHiding: tableStateValues?.enableHiding,
						manualFiltering: true,
						onGlobalFilterChange: globalFilter => {
							Controller.setGlobalFilter(globalFilter);
						},
						onColumnPinningChange: pinningFunc => {
							const newPinning =
								pinningFunc.left || pinningFunc.right ? pinningFunc : pinningFunc(tableStateValues?.columnPinning);

							Controller.setColumnPinning(newPinning, tableStateValues?.columnPinning, tableStateValues.TableSchema);
						},
						onRowSelectionChange: checkFunc => {
							if (typeof checkFunc !== 'function') {
								Controller.setIsAllRowsSelected(false);
								Controller.setColumnCheck(checkFunc);
								return;
							}

							let newstate = checkFunc(tableStateValues?.rowSelection);
							const allNumbers = _.range(0, tableStateValues?.pageSize);
							const missingNumbers = _.difference(allNumbers, _.keys(newstate).map(Number));
							const selectAll =
								tableStateValues.data?.rows?.length === Object.keys(newstate)?.length && !missingNumbers.length;
							if (selectAll) {
								if (tableStateValues.asyncRowSelection) {
									for (let i = 0; i < tableStateValues?.data?.rows?.length; i++) {
										newstate[i] = true;
									}
									Controller.setColumnCheck(newstate);
									Controller.updateState({
										onScrollCheck: true,
										isSubSetSelect: null,
									});
									return;
								}
								for (let i = 0; i < tableStateValues.data?.total; i++) {
									newstate[i] = true;
								}
							}
							let unselectAll = true;

							for (let i = 0; i < tableStateValues?.data?.rows?.length; i++) {
								if (newstate[i]) {
									unselectAll = false;
									break;
								}
							}

							if (unselectAll) {
								Controller.setIsAllRowsSelected(false);
								newstate = {};
								if (tableStateValues?.isSubSetSelect) {
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

							const formattedColumnFilters = (columnFilters || [])
								.map(filter => ({
									...filter,
									id: filter.field,
								}))
								.filter(filter => !['empty', 'notEmpty'].includes(filter?.searchType));

							const _newFilters = filtersFunc(formattedColumnFilters);

							const newFilters = _.values(
								_.merge(
									_.keyBy(
										formattedColumnFilters.filter(filter => filter.isMapViewFilter),
										'id'
									),
									_.keyBy(_newFilters, 'id')
								)
							);

							const result = [];
							newFilters.forEach(item => {
								const column = tableStateValues.TableSchema.find(
									column => column.id === item.id || column.accessorKey === item.id
								);
								const idArray = item?.id?.split(',');
								idArray.forEach(idValue => {
									const newItem = {
										id: idValue,
										value: item?.value,
										type: item?.type,
										field: item?.field,
										searchType: item?.searchType,
										columnType: column?.type,
									};
									result.push(newItem);
								});
							});

							Controller.syncFilters(result);

							result.forEach(filter => {
								const { mode, isKeyword } = tableState?.filterModes?.get({ noproxy: true })?.[filter.id] || {};

								let { value } = filter;
								const { type, oRFilter, columnType, searchType } = filter;
								if (mode && typeof filter.value === 'string' && columnType !== 'date') {
									value = isKeyword ? filter.value : +filter.value || 0;
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
									isKeyword,
									value,
									type,
									oRFilter,
									...(mode &&
										!['multiselect', 'singleselect'].includes(mode) && {
											type: 'advanced',
											searchType: mode,
											isKeyword,
											columnType,
										}),
								});
							});
						},

						onColumnOrderChange: ordering => {
							Controller.setColumnOrdering(ordering);
						},

						onColumnVisibilityChange: visibilityFunc => {
							let showColumns;
							const { columnVisibility, TableSchema } = tableStateValues;
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
							tableState.showColumnFilters.set(showColumnFilterFunc);
						},
						onSortingChange: sortingFunc => {
							const newSorting = sortingFunc(tableStateValues.sorting);
							tableState.sorting.set(newSorting);
							return newSorting;
						},
						rowCount: tableStateValues?.data?.total,
						renderToolbarInternalActions: tableStateValues.toolbarInternalActions
							? ({ table }) => (
									<ToolbarInternalActions
										table={table}
										toolbarInternalActions={tableStateValues.toolbarInternalActions}
										enableHiding={tableStateValues.enableHiding}
									/>
								)
							: undefined,
					}),
		},
	};
};

export default useTableESSimple;
