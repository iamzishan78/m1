import React, { memo } from 'react';
import DrawShapes from './components/DrawShapes/DrawShapes';
import SidePanel from '../Shared/SidePanel/SidePanel';
import { mapControlsController } from 'hookstate/mapControlsController';
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
		</div>
	);
};

export default memo(MapControls);
