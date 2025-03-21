import { memo, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useApolloClient } from '@apollo/client';
import { debounce } from 'lodash';

import { deepEqual } from 'components/Shared/functions';
import { convertBBoxToPolygon } from 'components/Shared/Hooks/useOnMouseMoveWells';

import { drawController } from 'stateManagement/drawStateController';
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

	const { bbox, recalculate } = layerController.useState(['bbox', 'recalculate']);
	const { polygonFilter, polygonsFilter } = layerFiltersController.useState(['polygonFilter', 'polygonsFilter']);
	const { layers, deckLayer, layerStateValues } = layerController.useState(['layers', 'deckLayer'], 'layerStateValues');

	const {
		stateValues: { isDrawing },
	} = drawController.useState(['isDrawing'], 'stateValues');

	useEffect(() => {
		if (!window.mapRef) {
			return;
		}
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
		if (layerStateValues?.layers?.length > 0 && !isReady) {
			setIsReady(true);
		}
	}, [layers]);

	useEffect(() => {
		if (layerStateValues?.deckLayer && layerStateValues?.layers?.length === 0) {
			layerController.handleDeckLayer(layerStateValues?.deckLayer);
		}
	}, [deckLayer]);

	useEffect(() => {
		if (isReady) {
			layerController.handleChange();
		}
	}, [bbox, recalculate, isReady, polygonFilter, polygonsFilter, layers, isDrawing]);

	return null;
}

export default memo(LayerManager);
