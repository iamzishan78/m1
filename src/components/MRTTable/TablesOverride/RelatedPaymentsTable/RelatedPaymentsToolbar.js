import React, { memo } from 'react';
import { Button, Typography } from '@material-ui/core';
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
		<>
			<Typography
				variant="h6"
				component="h1"
				style={{ fontWeight: 'bold', margin: '5px 0px 0px 10px', position: 'absolute', left:'0'}}
			>
				RELATED PAYMENTS
			</Typography>
			{!isSomethingSelected && (
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
			)}
		</>
	);
}

export default memo(RelatedPaymentsToolbar);
