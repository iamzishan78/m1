import React, { useEffect, memo, useRef } from 'react';

import { useApolloClient } from '@apollo/client';

import GridViewComponent from 'components/MRTTable/Common/GridView/GridViewComponent';
import { gridViewStateController } from 'components/MRTTable/Common/GridView/GridViewController';
import GridViewOptions from 'components/MRTTable/Common/GridView/GridViewOptions';

import { GET_GRID_VIEWS } from 'graphQL/useQueryGetGridViews';

import { globalStateController } from 'hookstate/globalStateController';
import { tableController } from 'hookstate/tableController';

function GridView({ tableKey, defaultView, handleDefaultView, Icon, label, module }) {
	const { user } = globalStateController.useState(['user']);
	const getUser = user.get({ noproxy: true });
	const client = useApolloClient();
	const buttonRef = useRef(null);

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
		gridViewStateController(tableKey).gridViewApply(selectedGridView);
	}, [tableState.stateValues?.gridView?.selectedGridView]);

	async function fetchGridViews() {
		const result = await client.query({
			variables: {
				module,
				userId: getUser._id,
			},
			query: GET_GRID_VIEWS,
		});
		const allGridViews = result?.data?.getGridViews?.gridViews;
		const gridViewController = gridViewStateController(tableKey);
		gridViewController?.updateState({ allGridViews });
	}

	return (
		<div>
			<GridViewComponent
				Icon={Icon}
				buttonRef={buttonRef}
				label={label}
				tableKey={tableKey}
				fetchGridViews={fetchGridViews}
			/>

			{tableStateValues?.gridView?.showViewModal && (
				<GridViewOptions
					module={module}
					buttonRef={buttonRef}
					handleDefaultView={handleDefaultView}
					tableKey={tableKey}
					allGridViews={gridViewStateValues?.allGridViews || []}
					defaultView={defaultView}
					fetchGridViews={fetchGridViews}
				/>
			)}
		</div>
	);
}

export default memo(GridView);
