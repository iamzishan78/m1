import React, { useEffect, memo, useState, useContext } from 'react';
import { useLazyQuery } from '@apollo/client';
// import { CircularProgress } from "@material-ui/core";
import GridViewComponent from 'components/MRTTable/Common/GridView/GridViewComponent';
import GridViewOptions from 'components/MRTTable/Common/GridView/GridViewOptions';
import { tableController } from 'hookstate/tableController';
import { GET_GRID_VIEWS } from 'graphQL/useQueryGetGridViews';
import { AppContext } from 'AppContext';

function GridView({ tableKey, defaultView, handleDefaultView, Icon, label, module }) {
	const Controller = tableController(tableKey);
	const tableState = Controller.useState([
		'TableSchema',
		'gridView',
		'esIndex',
		'columnPinning',
		'sorting',
		'showColumnFilters',
		'columnOrdering',
	]);
	const tableStateValues = tableState.stateValues;

	const [allGridViews, setAllGridViews] = useState([]);
	const [stateApp] = useContext(AppContext);
	const [getGridViews, { data: gridViews, loading }] = useLazyQuery(GET_GRID_VIEWS);

	useEffect(() => {
		getGridViews({
			variables: {
				module,
				userId: stateApp.user.mongoId,
			},
		});
	}, [getGridViews]);

	useEffect(() => {
		if (gridViews?.getGridViews?.gridViews) {
			const data = JSON.parse(JSON.stringify(gridViews.getGridViews.gridViews));
			setAllGridViews(data);
		}
	}, [gridViews]);

	useEffect(() => {
		Controller.updateState({
			gridView: {
				selectedGridView: defaultView,
				showViewModal: false,
				showSaveAsNew: false,
			},
		});
	}, [tableState.stateValues.esIndex]);

	useEffect(() => {
		const selectedGridView = tableStateValues?.gridView?.selectedGridView;
		if (!!(selectedGridView)) {
			if (selectedGridView?.columns) {
				const columnstoShow = selectedGridView?.columns.reduce((acc, obj) => {
					acc[obj.name] = obj.display;
					return acc;
				}, {});

				Controller.setColumnVisibility(columnstoShow);
			} else {
				const defaultVisibility = tableStateValues?.TableSchema?.reduce(
					(acc, cur) => ({ ...acc, [cur.accessorKey || cur.id]: !cur?.hidden }),
					{}
				);
				Controller.setColumnVisibility(defaultVisibility);
			}
			if (selectedGridView?.filters?.length) {
				tableState?.showColumnFilters?.set(true);
				Controller.clearFilters();
				selectedGridView?.filters.forEach(filter => {
					Controller.setFilter(filter);
				});
			} else {
				tableState?.showColumnFilters?.set(false);
				Controller.clearFilters();
			}
			if (selectedGridView?.sorting) {
				tableState?.sorting?.set(selectedGridView?.sorting);
			} else {
				tableState?.sorting?.set([]);
			}
			if (selectedGridView?.columnPinning) {
				Controller.setColumnPinning(
					selectedGridView?.columnPinning,
					tableStateValues?.columnPinning,
					tableStateValues.TableSchema
				);
			} else {
				const pinnedColumns = tableStateValues?.TableSchema?.filter(column => column.isPinned);
				const pinnedFields = pinnedColumns?.map(column => column.id || column.accessorKey);
				Controller.setColumnPinning(tableStateValues?.columnPinning, pinnedFields, tableStateValues.TableSchema);
			}
			if (selectedGridView?.columnOrdering) {
				tableState?.columnOrdering?.set(selectedGridView?.columnOrdering);
			} else {
				const columnOrder = tableStateValues?.TableSchema.map(column => column.accessorKey || column.id);
				tableState?.columnOrdering?.set(['mrt-row-select', 'mrt-row-numbers', ...columnOrder]);
			}
		}
		// for groupedField applying functionality will be done here
	}, [tableState.stateValues?.gridView?.selectedGridView]);

	return (
		<div>
			<GridViewComponent Icon={Icon} label={label} tableKey={tableKey} />

			{tableStateValues?.gridView?.showViewModal && !loading && (
				<GridViewOptions
					module={module}
					handleDefaultView={handleDefaultView}
					tableKey={tableKey}
					allGridViews={allGridViews}
					defaultView={defaultView}
				/>
			)}
		</div>
	);
}

export default memo(GridView);
