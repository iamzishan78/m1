import React, { memo, useContext } from 'react';
import { Button } from '@material-ui/core';
import { AppContext } from 'AppContext';
import { useDispatch } from 'react-redux';
import { useMutation } from '@apollo/client';
import { showErrorMessage, showSuccessMessage } from 'actions';
import { ADD_MULTI_WELLINTEREST_TO_CONTACT } from 'graphQL/useMutationAddMultiWellInterestToContact';
import { tableController } from 'hookstate/tableController';

function ContactTaxRollInterestToolbar({ table, tableKey }) {
	const dispatch = useDispatch();
	const [stateApp] = useContext(AppContext);

	const Controller = tableController(tableKey);
	const tableState = Controller.useState(['rowSelection']);
	const tableStateValues = tableState.stateValues;

	const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);

	const isSomeRowsSelected =
		table.getIsSomeRowsSelected() || Object.keys(tableStateValues?.rowSelection)?.length ? true : false;
	const isAllRowsSelected = table.getIsAllRowsSelected();
	const isSomethingSelected = isSomeRowsSelected || isAllRowsSelected;

	const [addMultiWellInterestToContact, { data }] = useMutation(ADD_MULTI_WELLINTEREST_TO_CONTACT, {
		refetchQueries: ['getContactWells'],
		awaitRefetchQueries: true,
	});

	const addWellInterestToContact = async e => {
		e.stopPropagation();
		const { contactId } = Controller.getValue('customProps');

		table.resetRowSelection();
		tableController(tableKey).updateState({
			isLoading: true,
		});

		await addMultiWellInterestToContact({
			variables: { wells: selectedRows, contactId: contactId, userId: stateApp.user.mongoId },
		});

		if (data?.addMultiWellInterestToContact?.success) {
			dispatch(showSuccessMessage(data?.addMultiWellInterestToContact?.message));
		} else {
			dispatch(showErrorMessage(data?.addMultiWellInterestToContact?.message));
		}

		tableController(tableKey).updateState({
			isLoading: false,
		});
	};

	return (
		<Button
			variant="contained"
			color="primary"
			style={{ height: '30px', marginBottom: '8px' }}
			disabled={!isSomethingSelected}
			onClick={addWellInterestToContact}
		>
			+ ADD TO CONTACT
		</Button>
	);
}

export default memo(ContactTaxRollInterestToolbar);
