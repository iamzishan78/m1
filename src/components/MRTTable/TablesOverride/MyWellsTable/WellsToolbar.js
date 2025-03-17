import React, { memo } from 'react';

import { Button } from '@material-ui/core';

import MyWellDialog from 'components/Land/components/Wells/MyWellDialog';

import { globalStateController } from 'stateManagement/globalStateController';
import { tableGlobalController } from 'stateManagement/tableController';

function WellsToolBar() {
	const { stateValues } = tableGlobalController.useState(['addWellDialog']);
	const { stateValues: testCaseStateValues } = globalStateController.useState(['testCase']);
	const addWell = () => {
		tableGlobalController.updateState({
			addWellDialog: {
				type: 'addWell',
				showDialog: true,
			},
		});
	};
	return (
		<>
			{(window.location.pathname.includes('/land/wells') || testCaseStateValues.testCase) && (
				<Button variant="contained" color="primary" onClick={addWell}>
					+ ADD WELL
				</Button>
			)}
			{stateValues?.addWellDialog?.showDialog && <MyWellDialog />}
		</>
	);
}

export default memo(WellsToolBar);
