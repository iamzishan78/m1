import { hookstate } from '@hookstate/core';
import { copy } from 'components/Shared/functions';
import { hookStateController } from 'hookstate';

const defaultMapVars = {
	zoom: 4.88,
	center: { lng: -98.8, lat: 38 },
	pitch: 0,
	bearing: 0,
	styleId: 'Outdoors',
};

const initialState = {
	// mapStyles: [],
	mapVars: defaultMapVars,
	defaultMapVars,
};

export const mapState = hookstate(copy(initialState));

const mapStateControllerHandler = () => ({});

export const mapStateController = {
	...mapStateControllerHandler(mapState),
	...hookStateController(mapState, initialState),
};
