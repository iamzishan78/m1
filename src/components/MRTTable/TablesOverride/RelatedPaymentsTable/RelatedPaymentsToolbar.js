import React, { memo } from 'react';
import { Button } from '@material-ui/core';
import { detailCardController } from 'hookstate/detailCardController';
import { PaymentRightDialog } from './RightDialog';
import { tableController } from 'hookstate/tableController';

// This component is used in the RelatedPaymentsTable component for the toolbar
function RelatedPaymentsToolbar({ table, tableKey }) {
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
						detailCardController.updateState({ drawer: 'paymentDialog' });
					}}
				>
					+ ADD Payment
				</Button>
				<PaymentRightDialog />
			</>
		)
	);
}

export default memo(RelatedPaymentsToolbar);
