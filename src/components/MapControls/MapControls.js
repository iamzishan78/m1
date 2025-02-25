import React, { memo } from 'react';

import { mapControlsController } from 'stateManagement/mapControlsController';

import DrawShapes from './components/DrawShapes/DrawShapes';
import SidePanel from '../Shared/SidePanel/SidePanel';
import CreateLayerDialog from './components/SourceLayerManager/CreateLayerDialog';
import FileUploadDialog from './components/SourceLayerManager/FileUploadDialog';

const MapControls = () => {
	const { mapControlsStateValues } = mapControlsController.useState(
		['selectedMapControl', 'layerAddControl'],
		'mapControlsStateValues'
	);

	return (
		<div>
			<SidePanel />
			{mapControlsStateValues.selectedMapControl === 'draw' ? <DrawShapes /> : null}
			{mapControlsStateValues.layerAddControl === 'addGroup' ? <FileUploadDialog /> : null}
			{mapControlsStateValues.layerAddControl === 'addLayers' ? <CreateLayerDialog /> : null}
		</div>
	);
};

export default memo(MapControls);
