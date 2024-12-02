import React from 'react';
import { MapControlsContextProvider } from './MapControlsContext';

import MapControls from './MapControls';

function MapControlsProvider(props) {
	const { changeBaseMap, changeLayers, changeHeatmaps, ...other } = props;

	return (
		<MapControlsContextProvider>
			<MapControls
				changeHeatmaps={changeHeatmaps}
				changeLayers={changeLayers}
				changeBaseMap={changeBaseMap}
				{...other}
			/>
		</MapControlsContextProvider>
	);
}

export default React.memo(MapControlsProvider);
