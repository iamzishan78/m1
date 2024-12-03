import React, { memo, useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import get from 'lodash/get';
import { tableController, tableGlobalController } from 'hookstate/tableController';
import { NavigationContext } from 'components/Navigation/NavigationContext';
import { globalStateController } from 'hookstate/globalStateController';
import { useMutation, useApolloClient } from '@apollo/client';
import { useDispatch } from 'react-redux';
import { AppContext } from 'AppContext';
import { activityTypes } from 'utils/data';
import ActivitiesModal from 'components/Activities/components/ActivitiesModal';

function ActivityAnalyticsToolBar({ table, tableKey }) {
	const history = useHistory();
	const client = useApolloClient();
	const Controller = tableController(tableKey);
	const [, setStateNav] = React.useContext(NavigationContext);
	const tableState = Controller.useState([
		'esIndex',
		'globalFilter',
		'searchFields',
		'data',
		'filters',
		'defaultSort',
		'sorting',
		'isAllRowsSelected',
		'rowSelection',
		'defaultFilters',
	]);
	const { stateValues } = tableGlobalController.useState(['dialog']);
	const { type, ...rest } = stateValues.dialog || {};
	const tableStateValues = tableState.stateValues;
	const isSomeRowsSelected =
		table.getIsSomeRowsSelected() || Object.keys(tableStateValues?.rowSelection)?.length ? true : false;
	const isAllRowsSelected = table.getIsAllRowsSelected();
	const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);
	const isSomethingSelected = isSomeRowsSelected || isAllRowsSelected;

	const { globalStateValues } = globalStateController.useState(['showFieldModal'], 'globalStateValues');
	const [events, setEvents] = useState([]);
	const [stateApp, setStateApp] = useContext(AppContext);
	const [activity, setActivity] = useState(null);

	useEffect(() => {
		if (rest?.selectedRow) {
			const activity = {
				...rest?.selectedRow,
				types: get(
					activityTypes.find(types => types.label === rest?.selectedRow.type),
					'value',
					''
				),
			};
			setStateApp(stateApp => ({
				...stateApp,
				selectedActivityId: rest?.selectedRow?._id,
				selectedActivity: activity,
			}));

			onModalOpen('activityDialog');
		}
	}, [stateValues.dialog]);

	const onModalOpen = (type = 'activityDialog') => {
		setStateApp(stateApp => ({
			...stateApp,
			[type]: true,
		}));
	};

	const setSelectedActivityId = id => {
		setStateApp(stateApp => ({
			...stateApp,
			selectedActivityId: id,
		}));
		if (!id) {
			// reset selectedrow on closing activity modal
			tableGlobalController.updateState({
				dialog: {
					type: 'activitydetailmodal',
					selectedRow: null,
				},
			});
		}
	};
	return (
		<>
			<ActivitiesModal setSelectedActivityId={setSelectedActivityId} events={events} />
		</>
	);
}
export default memo(ActivityAnalyticsToolBar);
