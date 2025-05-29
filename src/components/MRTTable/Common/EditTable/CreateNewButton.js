import React from 'react';

import { createRow } from 'material-react-table';
import PropTypes from 'prop-types';

import ToolbarButton from 'components/Shared/ui/ToolbarButton';

import { tableController } from 'stateManagement/tableController';

const CreateNewButton = ({ table, tableKey, label = 'ADD NEW LINE ITEM' }) => {
	const Controller = tableController(tableKey);

	const { tableStateValues } = Controller.useState(['enableEditing', 'isCreateMode'], 'tableStateValues');

	const disabled = false;

	if (!tableStateValues.enableEditing || tableStateValues.isCreateMode) {
		return null;
	}

	return (
		<ToolbarButton
			label={label}
			disabled={disabled}
			onClick={async () => {
				Controller.clearEditing();

				const { getDefaultValue } = Controller.getAllValues();

				const defaultValue = getDefaultValue?.() || {};

				table.setCreatingRow(createRow(table, defaultValue));

				Controller.updateState({ isCreateMode: true });
			}}
		/>
	);
};

CreateNewButton.propTypes = {
	table: PropTypes.object.isRequired,
	tableKey: PropTypes.string.isRequired,
	label: PropTypes.string,
};

export default CreateNewButton;
