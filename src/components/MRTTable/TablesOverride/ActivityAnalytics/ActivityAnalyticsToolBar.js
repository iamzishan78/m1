import get from 'lodash/get';
import React, { memo, useState, useEffect } from 'react';

import ActivitiesModal from 'components/Activities/components/ActivitiesModal';

import { tableGlobalController } from 'hookstate/tableController';

import { activityTypes } from 'utils/data';

function ActivityAnalyticsToolBar({ table, tableKey }) {
	const { stateValues } = tableGlobalController.useState(['dialog']);
	const { type, ...rest } = stateValues.dialog || {};

	const [events] = useState([]);

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
			window.setStateApp(stateApp => ({
				...stateApp,
				selectedActivityId: rest?.selectedRow?._id,
				selectedActivity: activity,
			}));

			onModalOpen('activityDialog');
		}
	}, [stateValues.dialog]);

	const onModalOpen = (type = 'activityDialog') => {
		window.setStateApp(stateApp => ({
			...stateApp,
			[type]: true,
		}));
	};

	const setSelectedActivityId = id => {
		window.setStateApp(stateApp => ({
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
