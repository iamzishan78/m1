import { useApolloClient } from '@apollo/client';
import { convertBBoxToPolygon } from 'components/Shared/Hooks/useOnMouseMoveWells';
import { deepEqual } from 'components/Shared/functions';
import { globalStateController } from 'hookstate/globalStateController';
import { layerFiltersController } from 'hookstate/layerFiltersController';
import { layerController } from 'hookstate/layerStateController';
import { debounce } from 'lodash';
import { memo, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

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

	const { bbox, recalculate } = layerController.useState(['bbox', 'recalculate']);
	const { layers, deckLayer, globalStateValues } = globalStateController.useState(
		['layers', 'deckLayer'],
		'globalStateValues'
	);
	const { polygonFilter, polygonsFilter } = layerFiltersController.useState(['polygonFilter', 'polygonsFilter']);

	useEffect(() => {
		if (!window.mapRef) return;
		move(moveRef);
		window.mapRef?.on?.('move', () => move(moveRef));
		return () => {
			window.mapRef?.off('move', () => move(moveRef));
		};
	}, []);

	useEffect(() => {
		layerController.init(client, history);
	}, [client, history]);

	useEffect(() => {
		if (globalStateValues?.layers?.length > 0 && !isReady) setIsReady(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [layers]);

	useEffect(() => {
		if (globalStateValues?.deckLayer && globalStateValues?.layers?.length === 0)
			layerController.handleDeckLayer(globalStateValues?.deckLayer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [deckLayer]);

	useEffect(() => {
		if (isReady) layerController.handleChange();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [bbox, recalculate, isReady, polygonFilter, polygonsFilter, layers]);

	return null;
}

export default memo(LayerManager);
