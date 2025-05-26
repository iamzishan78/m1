import { memo, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useApolloClient, useMutation } from '@apollo/client';
import { debounce } from 'lodash';

import { deepEqual } from 'components/Shared/functions';
import { convertBBoxToPolygon } from 'components/Shared/Hooks/useOnMouseMoveWells';

import { UPDATELAYERSETTINGS } from 'graphQL/useMutationUpdateLayerSettings';

import { globalStateController } from 'stateManagement/globalStateController';
import { layerFiltersController } from 'stateManagement/layerFiltersController';
import { layerController } from 'stateManagement/layerStateController';

const updateState = debounce((zoom, bbox, center) => {
	layerController.updateState({
		zoom,
		bbox,
		center,
	});
}, 1000);

const move = moveRef => {
	const zoom = window.mapRef?.getZoom();
	const center = window.mapref?.getCenter();
	const bounds = window.mapRef?.getBounds();
	const values = moveRef.current;

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

	const [updateLayerSettings] = useMutation(UPDATELAYERSETTINGS);

	const { bbox, recalculate } = layerController.useState(['bbox', 'recalculate']);
	const { layers, deckLayer, globalStateValues } = globalStateController.useState(
		['layers', 'deckLayer'],
		'globalStateValues'
	);
	const { polygonFilter, polygonsFilter } = layerFiltersController.useState(['polygonFilter', 'polygonsFilter']);

	useEffect(() => {
		if (!window.mapRef) {
			return null;
		}
		move(moveRef);
		window.mapRef?.on?.('move', () => move(moveRef));
		return () => {
			window.mapRef?.off('move', () => move(moveRef));
		};
	}, []);

	useEffect(() => {
		layerController.init(client, history, updateLayerSettings);
	}, [client, history, updateLayerSettings]);

	useEffect(() => {
		if (globalStateValues?.layers?.length > 0 && !isReady) {
			setIsReady(true);
		}
	}, [layers]);

	useEffect(() => {
		if (globalStateValues?.deckLayer && globalStateValues?.layers?.length === 0) {
			layerController.handleDeckLayer(globalStateValues?.deckLayer);
		}
	}, [deckLayer]);

	useEffect(() => {
		if (isReady) {
			layerController.handleChange();
		}
	}, [bbox, recalculate, isReady, polygonFilter, polygonsFilter, layers]);

	return null;
}

export default memo(LayerManager);
