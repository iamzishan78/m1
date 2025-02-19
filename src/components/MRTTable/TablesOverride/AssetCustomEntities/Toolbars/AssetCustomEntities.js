import React, { memo } from 'react';

import PropTypes from 'prop-types';

import ToolbarButton from 'components/Shared/ui/ToolbarButton';

import { tableGlobalController } from 'controllers/tableController';

import CustomAssetEntityDialog from '../Popups/CustomAssetEntityDialog';

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
			<ToolbarButton label={'+ ADD NEW ASSET'} onClick={addCustomAssetHandler} />

			<CustomAssetEntityDialog />
		</>
	);
}

AssetCustomEntitiesToolbar.propTypes = {
	tableKey: PropTypes.string.isRequired,
};

export default memo(AssetCustomEntitiesToolbar);
