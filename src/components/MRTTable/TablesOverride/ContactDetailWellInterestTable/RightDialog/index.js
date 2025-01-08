import React, { memo, useEffect } from 'react';

import { tableGlobalController } from 'hookstate/tableController';

import AddWellInterestDialog from './AddWellInterestDialog';

function CotactDetailWellInterestTableDialogs() {
	const { stateValues } = tableGlobalController.useState(['dialog']);
	const { type, contactId, activeWellInterest } = stateValues.dialog || {};

	const handleCloseDialog = () => {
		tableGlobalController.updateState({
			dialog: {},
		});
	};

	useEffect(() => {
		if (activeWellInterest) {
			window.setStateApp(stateApp => ({
				...stateApp,
				activeWellInterest: activeWellInterest,
			}));
		}
	}, [activeWellInterest]);
	return (
		<>
			{type === 'addAndUpdateWell' && (
				<AddWellInterestDialog open={true} width="700px !important" onClose={handleCloseDialog} contactId={contactId} />
			)}
		</>
	);
}

export default memo(CotactDetailWellInterestTableDialogs);
