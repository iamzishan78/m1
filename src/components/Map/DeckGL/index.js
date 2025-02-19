import React, { memo } from 'react';

import { globalStateController } from 'controllers/globalStateController';

import LayerManager from './components/LayerManager';
import Portals from './components/portals';

function DeckGLComponent({ hideShape }) {
	return (
		<div>
			<LayerManager />

			<Portals hideShape={hideShape} />
		</div>
	);
}

const DeckGLComponentMemo = React.memo(DeckGLComponent);

function DeckGL({ hideShape }) {
	const { stateValues } = globalStateController.useState(['mapReady']);
	if (!stateValues.mapReady || !window.mapRef) {
		return null;
	}

	return <DeckGLComponentMemo hideShape={hideShape} mapId={window?.mapRef?._mapId} />;
}

export default memo(DeckGL);
