import React, { memo } from 'react';
import { tableGlobalController } from 'hookstate/tableController';
import AddUnitOwnerDialogContent from 'components/MRTTable/TablesOverride/OwnersPerUnit/RightDialogs/AddUnitOwnerDialogContent';
import RecalculateSlideout from 'components/Table/Shape/RecalculateSlideout';

function OwnerPerUnitTableDialogs() {
	const { stateValues } = tableGlobalController.useState(['dialog']);
	const { type, ...rest } = stateValues.dialog || {};

	const handleCloseDialog = () => {
		tableGlobalController.updateState({
			dialog: {},
		});
	};

	const updateRows = rows => {
		tableGlobalController.updateState({
			dialog: {
				type,
				selectedRows: rows,
			},
		});
	};

	return (
		<>
			{type === 'addOwnerToUnit' && (
				<AddUnitOwnerDialogContent
					open
					width="450px"
					shapeId={rest?.shapeId}
					uAcres={rest?.uAcres}
					uUnitPricing={rest?.uUnitPricing}
					uMaxUnitPricing={rest?.uMaxUnitPricing}
					shapeType={rest?.shapeType}
					selectedRow={rest?.selectedRow}
					onClose={handleCloseDialog}
				/>
			)}

			{type === 'recalculate' && (
				<RecalculateSlideout onClose={handleCloseDialog} rows={rest?.selectedRows} setRows={updateRows} />
			)}
		</>
	);
}

export default memo(OwnerPerUnitTableDialogs);
