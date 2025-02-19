import React, { memo } from 'react';

import { Button } from '@material-ui/core';

import { detailCardController } from 'controllers/detailCardController';
import { tableController } from 'controllers/tableController';

import { BillingPartiesRightDialog } from './RightDialog';

// This component is used in the RelatedBillingPartiesTable component for the toolbar
function RelatedBillingPartiesToolbar({ table, tableKey }) {
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
						detailCardController.updateState({ drawer: 'billingPartiesDialog' });
					}}
				>
					+ ADD Billing Party
				</Button>
				<BillingPartiesRightDialog />
			</>
		)
	);
}

export default memo(RelatedBillingPartiesToolbar);
