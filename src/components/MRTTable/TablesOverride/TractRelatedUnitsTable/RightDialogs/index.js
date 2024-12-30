import React, { memo } from 'react';

import AddTractUnitDialog from 'components/MRTTable/TablesOverride/TractRelatedUnitsTable/Dialog/AddTractUnitDialog';

import { tableGlobalController } from 'hookstate/tableController';

function TractRelatedUnitsTableDialogs() {
	const { stateValues } = tableGlobalController.useState(['tractRelatedUnitDialog']);
	const { type, selectedTract } = stateValues.tractRelatedUnitDialog || {};

	const handleCloseDialog = () => {
		tableGlobalController.updateState({
			tractRelatedUnitDialog: {},
		});
	};

	return (
		<>
			{type === 'addTractUnit' && (
				<AddTractUnitDialog open={true} onClose={handleCloseDialog} selectedTract={selectedTract} />
			)}
		</>
	);
}

export default memo(TractRelatedUnitsTableDialogs);
