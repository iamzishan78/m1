import { memo, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useApolloClient } from '@apollo/client';
import { debounce } from 'lodash';

import { deepEqual } from 'components/Shared/functions';
import { convertBBoxToPolygon } from 'components/Shared/Hooks/useOnMouseMoveWells';

import { globalStateController } from 'hookstate/globalStateController';
import { layerFiltersController } from 'hookstate/layerFiltersController';
import { layerController } from 'hookstate/layerStateController';

const updateState = debounce((zoom, bbox, center) => {

	layerController.updateState({
		zoom,
		bbox,
		center,
	});
}, 1000);

const move = (moveRef, isInitialLoad) => {
	if (isInitialLoad) {
		return
	}

	const zoom = window.mapRef?.getZoom();
	const center = window.mapref?.getCenter();
	const bounds = window.mapRef?.getBounds();
	const values = moveRef.current;
	console.log("bbox", bounds)
	console.log("center", center)
	console.log("zoom", zoom)
	debugger

	const ne = bounds?.getNorthEast();
	const sw = bounds?.getSouthWest();

	const url = new URL(window.location);

	// Create an object to hold all parameters
	const params = {
		_neLng: ne?.lng,
		_neLat: ne?.lat,
		_swLng: sw.lng,
		_swLat: sw?.lat,
		zoom: zoom
	};

	// Iterate over the object and set all parameters at once
	Object.entries(params).forEach(([key, value]) => {
		url.searchParams.set(key, value);
	});

	// Update the browser's URL
	window.history.pushState({}, '', url);
	const mapBounds = {
		zoom: parseFloat(params.zoom),
		bbox: {
			_ne: {
				lng: parseFloat(params._neLng),
				lat: parseFloat(params._neLat),
			},
			_sw: {
				lng: parseFloat(params._swLng),
				lat: parseFloat(params._swLat),
			},
		}
	};
	globalStateController.updateState({ mapBounds: mapBounds });

	if (deepEqual(values.bounds, bounds) && zoom === values.zoom && center === values.center) {
		return;
	}
	moveRef.current = { zoom, bounds, center };

	const bbox = convertBBoxToPolygon(window.mapRef?.getBounds());
	updateState(zoom, bbox, center);
};

function LayerManager() {
	const history = useHistory();
	const client = useApolloClient();
	const moveRef = useRef({});
	const [isReady, setIsReady] = useState(false);

	const { bbox, recalculate } = layerController.useState(['bbox', 'recalculate']);
	const { layers, deckLayer, globalStateValues } = globalStateController.useState(
		['layers', 'deckLayer', 'isInitialLoad'],
		'globalStateValues'
	);
	const { polygonFilter, polygonsFilter } = layerFiltersController.useState(['polygonFilter', 'polygonsFilter']);

	useEffect(() => {
		if (!window.mapRef) {
			return;
		}
		move(moveRef, globalStateValues?.isInitialLoad);
		window.mapRef?.on?.('move', () => move(moveRef, globalStateValues?.isInitialLoad));
		return () => {
			window.mapRef?.off('move', () => move(moveRef, globalStateValues?.isInitialLoad));
		};
	}, []);

	useEffect(() => {
		layerController.init(client, history);
	}, [client, history]);

	useEffect(() => {
		if (globalStateValues?.layers?.length > 0 && !isReady) {
			setIsReady(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [layers]);

	useEffect(() => {
		if (globalStateValues?.deckLayer && globalStateValues?.layers?.length === 0) {
			layerController.handleDeckLayer(globalStateValues?.deckLayer);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [deckLayer]);

	useEffect(() => {
		debugger
		if (isReady) {
			layerController.handleChange();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [bbox, recalculate, isReady, polygonFilter, polygonsFilter, layers]);

	return null;
}

export default memo(LayerManager);
