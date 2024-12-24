import { Button } from '@material-ui/core';
import React, { memo } from 'react';

import { detailCardController } from 'hookstate/detailCardController';
import { tableController } from 'hookstate/tableController';

import { CostAllocationRightDialog } from './RightDialog';

// This component is used in the RelatedCostAllocationsTable component for the toolbar
function RelatedCostAllocationsToolbar({ table, tableKey }) {
	const Controller = tableController(tableKey);
	const tableState = Controller.useState(['rowSelection']);
	const tableStateValues = tableState.stateValues;

	const isSomeRowsSelected =
		table.getIsSomeRowsSelected() || Object.keys(tableStateValues?.rowSelection)?.length ? true : false;
	const isAllRowsSelected = table.getIsAllRowsSelected();
	const isSomethingSelected = isSomeRowsSelected || isAllRowsSelected;

	return (
		!isSomethingSelected && (
			<>
				<Button
					variant="contained"
					color="primary"
					onClick={() => {
						detailCardController.updateState({ drawer: 'costAllocationDialog' });
					}}
				>
					+ ADD Cost Allocation
				</Button>
				<CostAllocationRightDialog />
			</>
		)
	);
}

export default memo(RelatedCostAllocationsToolbar);
