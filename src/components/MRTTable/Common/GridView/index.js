import React, { useEffect, memo } from 'react';
import GridViewComponent from 'components/MRTTable/Common/GridView/GridViewComponent';
import GridViewOptions from 'components/MRTTable/Common/GridView/GridViewOptions';
import { tableController } from 'hookstate/tableController';
import { gridViewStateController } from 'components/MRTTable/Common/GridView/GridViewController'

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
	const gridViewState = gridViewStateController(tableKey).useState(['allGridViews']);
	const gridViewStateValues = gridViewState.stateValues;

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
				Controller.setShowColumnFilters(true);
				Controller.clearFilters();
				selectedGridView?.filters.forEach(filter => {
					Controller.setFilter(filter);
				});
			} else {
				Controller.setShowColumnFilters(false);
				Controller.clearFilters();
			}
			if (selectedGridView?.sorting) {
				Controller.setSorting(selectedGridView?.sorting);
			} else {
				Controller.setSorting([]);
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
				Controller.setColumnOrdering(selectedGridView?.columnOrdering);
			} else {
				const columnOrder = tableStateValues?.TableSchema.map(column => column.accessorKey || column.id);
				const defaultColumnOrder = ['mrt-row-select', 'mrt-row-numbers', ...columnOrder]
				Controller.setColumnOrdering(defaultColumnOrder);
			}
		}
		// for groupedField applying functionality will be done here
	}, [tableState.stateValues?.gridView?.selectedGridView]);

	return (
		<div>
			<GridViewComponent Icon={Icon} label={label} tableKey={tableKey} />

			{tableStateValues?.gridView?.showViewModal && (
				<GridViewOptions
					module={module}
					handleDefaultView={handleDefaultView}
					tableKey={tableKey}
					allGridViews={gridViewStateValues?.allGridViews || []}
					defaultView={defaultView}
				/>
			)}
		</div>
	);
}

export default memo(GridView);
