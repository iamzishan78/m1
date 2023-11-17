import { useRef } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { tableController } from 'hookstate/tableController';
import useHandleQuery from './useHandleQuery';
import ToolbarActions from '../Common/ToolbarActions';
import { tableESSimpleFilterModeOtions } from '../utils/data';

const useTableESSimple = tableKey => {
	const tableContainerRef = useRef(null); // access the MUI TableContainer element
	const rowVirtualizerInstanceRef = useRef(null); // access the MUI TableContainer element
	const tableRef = useRef(null); // access the MUI Table element
	const Controller = tableController(tableKey);
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

	localizationOptions.selectedCountOfRowCountRowsSelected = `${Object.keys(tableStateValues?.rowSelection)?.length} of ${tableStateValues?.data.total} row(s) selected`;

	const { CustomToolBar } = tableStateValues;
	return {
		classes,
		initialized: !!tableStateValues,
		tablePropsState: {
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
			...(tableState?.groupedField?.get() && { grouping: tableStateValues.grouping }),
			isLoading: tableStateValues?.isLoading,
			showAlertBanner: tableStateValues?.isError,
			showProgressBars: tableStateValues?.isFetching,
			rowSelection: tableStateValues?.rowSelection,
		},
		tableProps: {
			initialState: {
				columnVisibility: tableStateValues?.columnVisibility,
				columnOrder: tableStateValues?.columnOrdering,
				expanded: true,
				grouping: tableStateValues?.groupedField ? [tableStateValues?.groupedField] : [],
				showColumnFilters: tableStateValues?.showColumnFilters,
				rowSelection: tableStateValues?.rowSelection,
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
			...(!tableStateValues?.isInFiniteScroll && {
				manualPagination: true,
				onPaginationChange: paginationFunc => {
					const newPagination = paginationFunc(tableStateValues.pagination);
					tableState.pagination.set(newPagination);
					return newPagination;
				},
			}),
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
			enableFullScreenToggle: false,
			// enableMultiRowSelection: true,
			// enableSelectAll: true,
			enableStickyHeader: true,
			enableStickyFooter: true,
			enableSorting: tableStateValues?.grouping.length === 0,
			manualSorting: true,
			manualFiltering: true,
			onGlobalFilterChange: globalFilter => {
				Controller.setGlobalFilter(globalFilter);
			},
			onColumnPinningChange: pinningFunc => {
				const newPinning =
					pinningFunc.left || pinningFunc.right ? pinningFunc : pinningFunc(tableStateValues?.columnPinning);

				Controller.setColumnPinning(newPinning, tableStateValues?.columnPinning, tableStateValues.TableSchema);
			},
			onRowSelectionChange: (checkFunc) => {
				if (typeof checkFunc !== 'function') {
					Controller.setIsAllRowsSelected(false)
					Controller.setColumnCheck(checkFunc)
					return
				}

				let newstate = checkFunc(tableStateValues?.rowSelection)
				const selectAll = tableStateValues.data?.rows?.length === Object.keys(newstate)?.length;
				if (selectAll) {
					for (let i = 0; i < tableStateValues.data?.total; i++) {
						newstate[i] = true
					}
				}
				let unselectAll = true;

				for (let i = 0; i < tableStateValues?.pageSize; i++) {
					if (!!newstate[i]) {
						unselectAll = false;
						break;
					}
				}

				if (unselectAll) {
					Controller.setIsAllRowsSelected(false)
					newstate = {}
				}
				Controller.setColumnCheck(newstate)
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
					const { mode, isKeyword } = tableState?.filterModes?.get({ noproxy: true })?.[filter.id] || {};

					let { value } = filter;
					const { type } = filter;
					const { oRFilter } = filter;
					if (mode && typeof filter.value === 'string') value = isKeyword ? filter.value : +filter.value || 0;
					if (mode && tableESSimpleFilterModeOtions.inclusive.includes(mode))
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

			onColumnOrderChange: (ordering) => {
				Controller.setColumnOrdering(ordering);
			},

			muiTableBodyRowProps: row => ({
				onClick: e => {
					const { className } = e.target;
					if (
						tableStateValues?.onClickedRow &&
						(typeof className === 'object' || className?.includes('MuiTableCell-root') || className?.includes('row-click'))
					) {
						tableStateValues?.onClickedRow(row?.row?.original);
					}
				},
				sx: {
					cursor: 'pointer',
				},
			}),

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
					minHeight: tableStateValues?.maxTableHeight,
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
						{' '}
						<CustomToolBar {...props} tableKey={tableKey} />
					</ToolbarActions>
				) : (
					<ToolbarActions {...props} tableKey={tableKey} />
				),
		},
	};
};

export default useTableESSimple;
