import React, { useEffect } from 'react';

import { Button, Typography } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

import PropTypes from 'prop-types';

import { detailCardController } from 'stateManagement/detailCardController';
import { tableGlobalController } from 'stateManagement/tableController';

import { PaymentRightDialog } from './RightDialog';

// This component is used in the RelatedPaymentsTable component for the toolbar
function RelatedPaymentsToolbar({ table }) {
	const paymentMultiGrid = tableGlobalController.getValue('paymentMultiGrid');

	const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);

	useEffect(() => {
		if (selectedRows.length === 1) {
			tableGlobalController.updateState({
				paymentMultiGrid: {
					...paymentMultiGrid,
					paymentData: selectedRows[0],
				},
			});
		} else {
			tableGlobalController.updateState({
				paymentMultiGrid: {
					...paymentMultiGrid,
					paymentData: null,
				},
			});
		}
	}, [selectedRows]);

	return (
		<>
			<Typography
				variant="h6"
				component="h1"
				style={{ fontWeight: 'bold', margin: '5px 0px 0px 10px', position: 'absolute', left: '0' }}
			>
				RELATED PAYMENTS
			</Typography>
			<>
				<Button
					variant="contained"
					color="primary"
					onClick={() => {
						detailCardController.updateState({ drawer: 'paymentDialog' });
					}}
					disabled={selectedRows.length}
				>
					+ ADD Payment
				</Button>
				<PaymentRightDialog />
				<Button
					variant="contained"
					color="primary"
					startIcon={<EditIcon />}
					disabled={!selectedRows.length || !selectedRows.length === 1 || selectedRows.length > 1}
					onClick={() => {
						detailCardController.updateState({ drawer: 'paymentDialog' });
					}}
				>
					Edit Payment
				</Button>
			</>
		</>
	);
}

RelatedPaymentsToolbar.propTypes = {
	table: PropTypes.object.isRequired,
	tableKey: PropTypes.string.isRequired,
};

export default RelatedPaymentsToolbar;
