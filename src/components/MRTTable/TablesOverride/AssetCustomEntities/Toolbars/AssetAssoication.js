import React, { memo } from 'react';

import AssociationDialog from 'components/Shared/components/common/DetailCard/AssociationDialog';
import ToolbarButton from 'components/Shared/ui/ToolbarButton';

import { tableGlobalController } from 'stateManagement/tableController';

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
			<ToolbarButton label={'+ Associate Data'} onClick={associatedDataHandler} />
			<AssociationDialog />
		</>
	);
}

export default memo(AssetAssociationToolbar);
