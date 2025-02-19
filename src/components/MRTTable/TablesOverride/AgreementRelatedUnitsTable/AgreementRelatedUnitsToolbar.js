import React, { memo } from 'react';

import { Button } from '@material-ui/core';

import AgreementRelatedUnitDialog from 'components/MRTTable/TablesOverride/AgreementRelatedUnitsTable/RightDialog';

import { tableController, tableGlobalController } from 'controllers/tableController';

// Overridden Tootlbar for AgreementRelatedUnitsToolbar
function AgreementRelatedUnitsToolbar({ table, tableKey }) {
	const Controller = tableController(tableKey);
	const { customLayer } = Controller.getValue('customProps');
	const { stateValues } = tableGlobalController.useState(['AgmtRelatedUnitDialog']);
	const { type } = stateValues.AgmtRelatedUnitDialog || {};

	// for openeing slideout by setting state
	const addRelatedUnit = () => {
		tableGlobalController.updateState({
			AgmtRelatedUnitDialog: {
				type: 'addAgreementUnit',
			},
		});
	};
	return (
		<>
			{type === 'addAgreementUnit' && (
				<AgreementRelatedUnitDialog
					open={type === 'addAgreementUnit' ? true : false}
					width="450px"
					shapeId={customLayer._id}
					onClose={() => {
						tableGlobalController.updateState({
							AgmtRelatedUnitDialog: {},
						});
					}}
				/>
			)}
			<Button variant="contained" color="primary" onClick={addRelatedUnit}>
				+ ADD UNIT TO AGMT
			</Button>
		</>
	);
}

export default memo(AgreementRelatedUnitsToolbar);
