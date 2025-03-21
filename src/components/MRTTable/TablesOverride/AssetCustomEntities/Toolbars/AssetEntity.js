import React, { memo } from 'react';

import { Button, ButtonGroup, IconButton, Tooltip } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

import PropTypes from 'prop-types';

import { tableGlobalController } from 'stateManagement/tableController';

import AssetAssociationDialog from '../Popups/AssetAssociationDialog';
import CustomAssetEntityDialog from '../Popups/CustomAssetEntityDialog';

function AssetEntityToolbar({ tableKey }) {
	const editCustomAssetHandler = () => {
		tableGlobalController.updateState({
			AssetCustomEntityDialog: {
				type: 'editCustomAsset',
				isOpen: true,
				isAddEditAsset: true,
				tableKey,
			},
		});
	};

	const addAssetAssociationHandler = () => {
		tableGlobalController.updateState({
			AssetCustomEntityDialog: {},
			AssetAssociationDialog: {
				type: 'addAssetAssociation',
				isOpen: true,
				tableKey,
			},
		});
	};

	return (
		<>
			<ButtonGroup variant="contained" style={{ height: '40px' }} color="primary" aria-label="split button">
				<Button
					id="addAssetAssociation"
					color="primary"
					size="small"
					aria-label="add asset association"
					onClick={addAssetAssociationHandler}
				>
					Add/Edit Association
				</Button>
			</ButtonGroup>

			<Tooltip title="Edit Custom Asset">
				<IconButton onClick={editCustomAssetHandler}>
					<EditIcon />
				</IconButton>
			</Tooltip>

			<CustomAssetEntityDialog />
			<AssetAssociationDialog />
		</>
	);
}

AssetEntityToolbar.propTypes = {
	tableKey: PropTypes.string.isRequired,
};

export default memo(AssetEntityToolbar);
