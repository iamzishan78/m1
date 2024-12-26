import React, { memo } from 'react';

import { Button } from '@material-ui/core';

import CotactDetailWellInterestTableDialogs from 'components/MRTTable/TablesOverride/ContactDetailWellInterestTable/RightDialog';

import { tableGlobalController, tableController } from 'hookstate/tableController';

function WellInterestToolBar({ table, tableKey }) {
	const Controller = tableController(tableKey);
	const { contactId } = Controller.getValue('customProps');

	const addRelatedUnit = () => {
		tableGlobalController.updateState({
			dialog: {
				type: 'addAndUpdateWell',
				contactId,
			},
		});
	};

	return (
		<>
			<Button variant="contained" color="primary" onClick={addRelatedUnit}>
				+ ADD INTEREST
			</Button>
			<CotactDetailWellInterestTableDialogs />
		</>
	);
}

export default memo(WellInterestToolBar);
