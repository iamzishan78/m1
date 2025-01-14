import React, { memo } from 'react';
import { tableGlobalController } from 'hookstate/tableController';
import { ButtonGroup, Button } from '@material-ui/core';
import CustomAssetEntityDialog from '../Popups/CustomAssetEntityDialog';
import PropTypes from 'prop-types';

function AssetCustomEntitiesToolbar({ tableKey }) {
	const addCustomAssetHandler = () => {
		tableGlobalController.updateState({
			AssetCustomEntityDialog: {
				type: 'addCustomAsset',
				isOpen: true,
				isAddEditAsset: true,
				tableKey,
			},
			selectedAsset: {},
		});
	};

	return (
		<>
			<ButtonGroup variant="contained" style={{ height: '40px' }} color="primary" aria-label="split button">
				<Button
					id="addCustomAssetEntity"
					color="primary"
					size="small"
					aria-label="select merge strategy"
					aria-haspopup="menu"
					onClick={addCustomAssetHandler}
				>
					Create New Asset
				</Button>
			</ButtonGroup>

			<CustomAssetEntityDialog />
		</>
	);
}

AssetCustomEntitiesToolbar.propTypes = {
	tableKey: PropTypes.string.isRequired,
};

export default memo(AssetCustomEntitiesToolbar);
