import React, { memo } from 'react';
import { Button } from '@material-ui/core';
import { detailCardController } from 'hookstate/detailCardController';
import { CostAllocationRightDialog } from './RightDialog';

// This component is used in the RelatedCostAllocationsTable component for the toolbar
function RelatedCostAllocationsToolbar({ table, tableKey }) {
	return (
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
	);
}

export default memo(RelatedCostAllocationsToolbar);
