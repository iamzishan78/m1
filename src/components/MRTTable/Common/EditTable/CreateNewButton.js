import React from 'react';

import { get, set } from 'lodash';
import { createRow } from 'material-react-table';
import PropTypes from 'prop-types';

import ToolbarButton from 'components/Shared/ui/ToolbarButton';

import { tableController } from 'hookstate/tableController';

const CreateNewButton = ({ table, tableKey, label = 'Create New' }) => {
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

				const data = Controller.getValue('data');

				const row = data?.rows?.[0] || {};

				const defaultValue = {};

				console.log(row);

				const keys = ['property', 'check'];

				keys.forEach(key => {
					set(defaultValue, key, get(row, key));
				});

				// table.setCreatingRow(true);
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
