import React, { memo } from 'react';

import Button from '@material-ui/core/Button';

import PropTypes from 'prop-types';

import { tableController, tableGlobalController } from 'controllers/tableController';
import AddCustomAssetDialog from 'components/Shared/components/common/DetailCard/RightDialogs/AddCustomAssetDialog';

function DynamicAssetGridToolBar({ tableKey }) {
	const Controller = tableController(tableKey);
	const tableState = Controller.useState(['fetchDynamicSchema']);
	const tableStateValues = tableState.stateValues;

	const { name, tableName } = tableStateValues.fetchDynamicSchema || {};

	const { stateValues } = tableGlobalController.useState(['dialog']);
	const { type, isOpen } = stateValues.dialog || {};

	const handleClick = () => {
		tableGlobalController.updateState({
			dialog: {
				type: 'addCustomAsset',
				tableName,
				isOpen: true,
			},
		});
	};

	const onClose = () => {
		tableGlobalController.updateState({
			dialog: {
				type: 'addCustomAsset',
				isOpen: false,
			},
		});
	};
	return (
		<>
			<Button variant="contained" color="primary" onClick={handleClick}>
				{`+ ADD ${name}`}
			</Button>

			{type === 'addCustomAsset' && isOpen && <AddCustomAssetDialog onClose={onClose} />}
		</>
	);
}

DynamicAssetGridToolBar.propTypes = {
	tableKey: PropTypes.string.isRequired,
};

export default memo(DynamicAssetGridToolBar);
