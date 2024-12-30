import React, { memo, useContext } from 'react';
import { useDispatch } from 'react-redux';

import { Button } from '@material-ui/core';

import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';

import { ADD_MULTI_WELLINTEREST_TO_CONTACT } from 'graphQL/useMutationAddMultiWellInterestToContact';

import { tableController } from 'hookstate/tableController';

import { showErrorMessage, showSuccessMessage } from 'actions';
import { AppContext } from 'AppContext';

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

	const [addMultiWellInterestToContact] = useMutation(ADD_MULTI_WELLINTEREST_TO_CONTACT, {
		refetchQueries: ['getContactWells'],
		awaitRefetchQueries: true,
		onCompleted: data => {
			tableController(tableKey).updateState({
				isLoading: false,
				isFetching: false,
			});

			if (data?.addMultiWellInterestToContact?.success) {
				dispatch(showSuccessMessage(data?.addMultiWellInterestToContact?.message));
			} else {
				dispatch(showErrorMessage(data?.addMultiWellInterestToContact?.message));
			}
		},
	});

	const addWellInterestToContact = e => {
		e.stopPropagation();
		const { contactId } = Controller.getValue('customProps');

		table.resetRowSelection();
		tableController(tableKey).updateState({
			isFetching: true,
		});

		addMultiWellInterestToContact({
			variables: { wells: selectedRows, contactId: contactId, userId: stateApp.user.mongoId },
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

ContactTaxRollInterestToolbar.propTypes = {
	table: PropTypes.object.isRequired,
	tableKey: PropTypes.string.isRequired,
};

export default memo(ContactTaxRollInterestToolbar);
