import React from 'react';

import PropTypes from 'prop-types';

import ToolbarButton from 'components/Shared/ui/ToolbarButton';

import { tableController } from 'hookstate/tableController';

const InputModeButton = ({ tableKey, onClick, label = 'INPUT MODE' }) => {
	const Controller = tableController(tableKey);
	const { tableStateValues } = Controller.useState(['enableEditing'], 'tableStateValues');

	if (tableStateValues.enableEditing) {
		return null;
	}

	return <ToolbarButton label={label} onClick={onClick} />;
};

InputModeButton.propTypes = {
	tableKey: PropTypes.string.isRequired,
	label: PropTypes.string,
	onClick: PropTypes.func.isRequired,
};

export default InputModeButton;
