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
		const defaultDisplay = gridViewStateValues.allGridViews.find(obj => obj.isDefaultDisplay === true);
		if (!(!!defaultDisplay)) {
			Controller.updateState({
				gridView: {
					selectedGridView: defaultView,
					showViewModal: false,
					showSaveAsNew: false,
				},
			});
		}
	}, [])
	useEffect(() => {
		const selectedGridView = tableStateValues?.gridView?.selectedGridView;
		gridViewStateController(tableKey).gridViewApply(selectedGridView)
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
