import React from 'react';

import { mapControlsController } from 'stateManagement/mapControlsController';

import MapGridCard from './MapGridCard';
import { MapGridContextProvider } from './MapGridContext';

export default function MapGridProvider(props) {
	const { stateValues } = mapControlsController.useState(['mapGridCardActivated']);

	if (!stateValues.mapGridCardActivated) {
		return null;
	}

	return (
		<MapGridContextProvider>
			<MapGridCard>{props.children}</MapGridCard>
		</MapGridContextProvider>
	);
}
