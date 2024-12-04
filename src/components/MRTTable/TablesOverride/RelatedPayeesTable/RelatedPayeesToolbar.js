import React, { memo } from 'react';
import { Button } from '@material-ui/core';
import { detailCardController } from 'hookstate/detailCardController';
import { PayeeRightDialog } from './RightDialog';
import { tableController } from 'hookstate/tableController';

// This component is used in the RelatedPayeesTable component for the toolbar
function RelatedPayeesToolbar({ table, tableKey }) {
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
						detailCardController.updateState({ drawer: 'payeeDialog' });
					}}
				>
					+ ADD Payee
				</Button>
				<PayeeRightDialog />
			</>
		)
	);
}

export default memo(RelatedPayeesToolbar);
