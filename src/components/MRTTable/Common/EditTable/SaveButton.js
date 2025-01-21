import React, { useMemo } from 'react';

import { useApolloClient } from '@apollo/client';
import { merge } from 'lodash';
import PropTypes from 'prop-types';

import ToolbarButton from 'components/Shared/ui/ToolbarButton';

import { tableController, tableGlobalController } from 'hookstate/tableController';

const SaveButton = ({ tableKey }) => {
	const Controller = tableController(tableKey);
	const { tableStateValues } = Controller.useState(
		['editedData', 'validationErrors', 'enableEditing', 'isCreateMode'],
		'tableStateValues'
	);

	const client = useApolloClient();

	const saveable = useMemo(() => {
		const hasEditedData = Object.values(tableStateValues.editedData || {}).some(data => !!data);

		const hasErrors = Object.values(tableStateValues.validationErrors || {}).some(rowErrors =>
			Object.values(rowErrors || {}).some(error => !!error)
		);

		return hasEditedData && !hasErrors;
	}, [tableStateValues.editedData, tableStateValues.validationErrors]);

	if (!tableStateValues.enableEditing || tableStateValues.isCreateMode) {
		return null;
	}

	return (
		<ToolbarButton
			label="Save"
			disabled={!saveable}
			onClick={async () => {
				const { data, handleUpdateData } = Controller.getAllValues();

				const rowsToUpdate = Object.entries(tableStateValues.editedData)
					.filter(([, value]) => !!value)
					.map(([key, value]) => {
						const currentRow = data.rows.find(r => r._id === key);

						return merge(currentRow, value);
					});

				Controller.clearEditing();

				try {
					await handleUpdateData(client, rowsToUpdate);
				} catch {
					//
				}

				tableGlobalController.refetch();
			}}
		/>
	);
};

SaveButton.propTypes = {
	tableKey: PropTypes.string.isRequired,
};

export default SaveButton;
