import React from 'react';
import { MapGridContextProvider } from './MapGridContext';
import MapGridCard from './MapGridCard';
import { mapControlsController } from 'hookstate/mapControlsController';

export default function MapGridProvider(props) {
	const { stateValues } = mapControlsController.useState(['mapGridCardActivated']);

	if (!stateValues.mapGridCardActivated) return null;

	return (
		<MapGridContextProvider>
			<MapGridCard>{props.children}</MapGridCard>
		</MapGridContextProvider>
	);
}
