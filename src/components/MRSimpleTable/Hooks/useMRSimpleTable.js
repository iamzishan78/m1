import { useRef } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { simpleTableController } from 'hookstate/simpleTableController';
import useHandleQuery from './useHandleQuery';
import ToolbarActions from '../Common/ToolbarActions';
import { tableSimpleFilterModeOtions } from '../utils/data';

const useMRSimpleTable = tableKey => {
	const tableContainerRef = useRef(null); // access the MUI TableContainer element
	const rowVirtualizerInstanceRef = useRef(null); // access the MUI TableContainer element
	const tableRef = useRef(null); // access the MUI Table element
	const Controller = simpleTableController(tableKey);
	const tableState = Controller.useCompleteState();
	const tableStateValues = tableState?.get({ noproxy: true });
	const { fetchMoreOnBottomReached } = useHandleQuery({
		tableRef: tableStateValues?.isInFiniteScroll ? rowVirtualizerInstanceRef : tableRef,
		tableKey,
		tableState,
		tableStateValues,
	});

	const useStyles = makeStyles(() => ({
		table: tableStateValues?.tableCss || {},
	}));
	const classes = useStyles();

	const localizationOptions = {
		filterCustomFilterFn: 'AutoComplete',
	};
	if (tableStateValues?.isSelectall) {
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
			...(tableStateValues.isServerSide
				? {
					columnFilters: (tableStateValues?.filters || []).map(filter => ({
						...filter,
						id: filter.field,
					})),
					columnPinning: tableStateValues?.columnPinning,
					globalFilter: tableStateValues?.globalFilter || '',
					columnVisibility: tableStateValues?.columnVisibility,
					showColumnFilters: tableStateValues?.showColumnFilters,
					sorting: tableStateValues.sorting,
					...(!tableStateValues?.isInFiniteScroll && {
						pagination: tableStateValues.pagination,
					}),
					...(tableState?.groupedField?.get() && {
						grouping: tableStateValues.grouping,
					}),
				}
				: {}),
		},
		tableProps: {
			initialState: {
				columnVisibility: tableStateValues?.columnVisibility,
				expanded: true,
				grouping: tableStateValues?.groupedField ? [tableStateValues?.groupedField] : [],
				showColumnFilters: tableStateValues?.showColumnFilters,
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
				...(tableState?.groupedField?.get() && { grouping: tableStateValues.grouping }),
			},
			...(tableStateValues?.groupedField && {
				enableGrouping: true,
				manualGroupinng: true,
				onGroupingChange: groupingFunc => {
					const newGrouping = groupingFunc(tableStateValues.grouping);
					tableState.grouping.set(newGrouping);

					if (newGrouping.length === 1)
						return tableState.sorting.set([
							{
								id: newGrouping[0],
								desc: false,
							},
						]);

					if (newGrouping.length > 0) tableState.sorting.set([]);
					return newGrouping;
				},
			}),
			...(tableStateValues?.isInFiniteScroll && { enablePagination: false }),
			enableRowVirtualization: !!tableStateValues?.isInFiniteScroll,
			enableColumnVirtualization: !!tableStateValues?.columnVirtualization,
			rowVirtualizerInstanceRef, // get access to the virtualizer instance
			// rowVirtualizerProps: { overscan: 5 },
			enableDensityToggle: false,
			enableColumnFilterModes: true,
			enableColumnOrdering: true,
			enableColumnResizing: true,
			enableRowSelection: true,
			enablePinning: true,
			// enableMultiRowSelection: true,
			// enableSelectAll: true,
			enableStickyHeader: true,
			enableStickyFooter: true,
			selectAllMode: tableStateValues?.isSelectall ? 'all' : 'page',
			enableSorting: tableStateValues?.grouping.length === 0,
			muiTableBodyRowProps: row => ({
				onClick: e => {
					const { className } = e.target;
					if (
						tableStateValues?.onClickedRow &&
						(className.includes('MuiTableCell-root') || className.includes('row-click'))
					) {
						tableStateValues?.onClickedRow(row?.row?.original);
					}
				},
				sx: {
					cursor: 'pointer',
				},
			}),
			memoMode: 'cells',
			columns: tableStateValues?.TableSchema,
			data: tableStateValues?.data?.rows || [],
			rowCount: tableStateValues?.data.total,
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
					height: tableStateValues?.height,
				},
				onScroll: e => fetchMoreOnBottomReached(e.target),
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

			...(tableStateValues.isServerSide
				? {
					...(!tableStateValues?.isInFiniteScroll && {
						manualPagination: true,
						onPaginationChange: paginationFunc => {
							const newPagination = paginationFunc(tableStateValues.pagination);
							tableState.pagination.set(newPagination);
							return newPagination;
						},
					}),

					manualSorting: true,
					manualFiltering: true,
					onGlobalFilterChange: globalFilter => {
						Controller.setGlobalFilter(globalFilter);
					},
					onColumnPinningChange: pinningFunc => {
						const newPinning =
							pinningFunc.left || pinningFunc.right
								? pinningFunc
								: pinningFunc(tableStateValues?.columnPinning);

						Controller.setColumnPinning(
							newPinning,
							tableStateValues?.columnPinning,
							tableStateValues.TableSchema
						);
					},
					onColumnFiltersChange: filtersFunc => {
						const newFilters = filtersFunc(
							(tableStateValues?.filters || []).map(filter => ({
								...filter,
								id: filter.field,
							}))
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
									value: item.value,
									type: item?.type,
								};
								result.push(newItem);
							});
						});

						Controller.syncFilters(result);

						result.forEach(filter => {
							const { mode, isKeyword } =
								tableState?.filterModes?.get({ noproxy: true })?.[filter.id] || {};

							let { value } = filter;
							const { type } = filter;
							const { oRFilter } = filter;
							if (mode && typeof filter.value === 'string')
								value = isKeyword ? filter.value : +filter.value || 0;
							if (mode && tableSimpleFilterModeOtions.inclusive.includes(mode))
								value = filter.value.map(value => +value || 0);

							Controller.setFilter({
								field: filter.id,
								value,
								type,
								oRFilter,
								...(mode &&
									!['multiselect', 'singleselect'].includes(mode) && {
									type: 'advanced',
									searchType: mode,
									isKeyword,
								}),
							});
						});
					},
					onColumnVisibilityChange: visibilityFunc => {
						let showColumns;
						if (typeof visibilityFunc === 'function') {
							showColumns = visibilityFunc(tableStateValues?.columnVisibility);
						} else if (typeof visibilityFunc === 'object') {
							showColumns = visibilityFunc;
						}
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
				}
				: {}),
		},
	};
};

export default useMRSimpleTable;
