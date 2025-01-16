import React, { memo } from 'react';
import { tableGlobalController } from 'hookstate/tableController';
import CustomAssetEntityDialog from '../Popups/CustomAssetEntityDialog';
import PropTypes from 'prop-types';
import ToolbarButton from 'components/Shared/ui/ToolbarButton';

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
