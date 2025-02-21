import React, { memo } from 'react';

import { ButtonGroup, Button } from '@material-ui/core';

import AssociationDialog from 'components/Shared/components/common/DetailCard/AssociationDialog';

import { tableGlobalController } from 'controllers/tableController';

function AssetAssociationToolbar() {
	const associatedDataHandler = () => {
		tableGlobalController.updateState({
			AssociateDataDialog: {
				type: 'addAssociatedData',
				isOpen: true,
			},
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
					onClick={associatedDataHandler}
				>
					Associate Data
				</Button>
			</ButtonGroup>

			<AssociationDialog />
		</>
	);
}

export default memo(AssetAssociationToolbar);
