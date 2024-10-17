import React, { memo } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import { tableGlobalController } from 'hookstate/tableController';
import CustomAssetEntityDialog from './Popups/CustomAssetEntityDialog';
import { IconButton, Tooltip } from '@material-ui/core';

function AssetEntityToolbar({ tableKey }) {
	const editCustomAssetHandler = () => {
		tableGlobalController.updateState({
			AssetCustomEntityDialog: {
				type: 'editCustomAsset',
				isOpen: true,
				tableKey,
			},
		});
	};

	return (
		<>
			<Tooltip title="Edit Custom Asset">
				<IconButton onClick={editCustomAssetHandler}>
					<EditIcon />
				</IconButton>
			</Tooltip>

			<CustomAssetEntityDialog />
		</>
	);
}

export default memo(AssetEntityToolbar);
