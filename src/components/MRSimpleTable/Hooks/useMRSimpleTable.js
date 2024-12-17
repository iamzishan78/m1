import { useRef } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { simpleTableController } from 'hookstate/simpleTableController';
import useHandleQuery from './useHandleQuery';
import useHandleAdditionalQueries from 'components/Common/MRTable/Hooks/useHandleAdditionalQueries';
import ToolbarActions from '../Common/ToolbarActions';

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

	useHandleAdditionalQueries({
		Controller,
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
	// if (tableStateValues?.isAllRowsSelected && tableStateValues?.isSelectAllAllowed) {
	// 	localizationOptions.selectedCountOfRowCountRowsSelected = `${tableStateValues?.data.total} of ${tableStateValues?.data.total} row(s) selected`;
	// }

	const { CustomToolBar } = tableStateValues;
	return {
		classes,
		initialized: !!tableStateValues,
		tablePropsState: {
			isLoading: tableStateValues?.isLoading,
			showAlertBanner: tableStateValues?.isError,
			showProgressBars: tableStateValues?.isFetching,
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
			selectAllMode: tableStateValues?.isSelectAllAllowed ? 'all' : 'page',
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
			enableFacetedValues: tableStateValues?.enableFacetedValues,
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
		},
	};
};

export default useMRSimpleTable;
