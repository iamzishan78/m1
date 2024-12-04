import React, { memo } from 'react';
import { Button } from '@material-ui/core';
import { tableController, tableGlobalController } from 'hookstate/tableController';
import TractRelatedUnitsTableDialogs from 'components/MRTTable/TablesOverride/TractRelatedUnitsTable/RightDialogs';

function TractRelatedUnitsToolBar({ table, tableKey }) {
	const Controller = tableController(tableKey);
	const { customLayer } = Controller.getValue('customProps');
	const shapeTract = {
		parcelId: customLayer?._id,
		abstract: customLayer?.shapeJson?.properties?.AbstractName,
		altSurvey: customLayer?.shapeJson?.properties?.Grantee,
		block: customLayer?.shapeJson?.properties?.Block,
		county: customLayer?.shapeJson?.properties?.County,
		name: customLayer?.name,
		shapeArea: customLayer?.shapeJson?.properties?.shapeArea,
		sdGrossAcres: customLayer?.shapeJson?.properties?.sdGrossAcres,
		section: customLayer?.shapeJson?.properties?.Section,
		state: customLayer?.state,
		survey: customLayer?.shapeJson?.properties?.Survey,
	};

	const addRelatedUnit = () => {
		tableGlobalController.updateState({
			tractRelatedUnitDialog: {
				type: 'addTractUnit',
				selectedTract: shapeTract,
			},
		});
	};
	return (
		<>
			<TractRelatedUnitsTableDialogs />
			<Button variant="contained" color="primary" onClick={addRelatedUnit}>
				+ ADD RELATED UNIT
			</Button>
		</>
	);
}

export default memo(TractRelatedUnitsToolBar);
