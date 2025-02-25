import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';

import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';

import ToolbarButton from 'components/Shared/ui/ToolbarButton';

import { ADD_MULTI_WELLINTEREST_TO_CONTACT } from 'graphQL/useMutationAddMultiWellInterestToContact';

import { tableController } from 'stateManagement/tableController';

import { showErrorMessage, showSuccessMessage } from 'actions';
import { AppContext } from 'AppContext';

function ContactTaxRollInterestToolbar({ table, tableKey }) {
	const dispatch = useDispatch();
	const [stateApp] = useContext(AppContext);

	const Controller = tableController(tableKey);
	const { tableStateValues } = Controller.useState(['customProps'], 'tableStateValues');
	const isSomeRowsSelected = table.getIsSomeRowsSelected();
	const isAllRowsSelected = table.getIsAllRowsSelected();
	const isSomethingSelected = isSomeRowsSelected || isAllRowsSelected;
	const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);

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
		const { contactId } = tableStateValues.customProps;

		table.resetRowSelection();
		tableController(tableKey).updateState({
			isFetching: true,
		});

		addMultiWellInterestToContact({
			variables: { wells: selectedRows, contactId: contactId, userId: stateApp.user.mongoId },
		});
	};

	return (
		<div style={{ display: 'flex', alignItems: 'center' }}>
			{isSomethingSelected && (
				<ToolbarButton label="+ ADD TO CONTACT" disabled={!isSomethingSelected} onClick={addWellInterestToContact} />
			)}
		</div>
	);
}

ContactTaxRollInterestToolbar.propTypes = {
	table: PropTypes.object.isRequired,
	tableKey: PropTypes.string.isRequired,
};

export default ContactTaxRollInterestToolbar;
