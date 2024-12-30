import { useEffect, useRef, useState } from 'react';

import { bboxPolygon, booleanWithin, difference, union } from '@turf/turf';

export const convertBBoxToPolygon = bounds => {
	if (!bounds) {
		return null;
	}
	return bboxPolygon([bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()]);
};

const useOnMouseMoveWells = ({ layerState, minZoomLevel = 7 }) => {
	const [mouseMove, setMouseMove] = useState(null);
	const previousBounds = useRef();
	const map = window.mapRef;
	const moveend = () => {
		if (!layerState || !layerState?.layerSettings?.visiable) {
			return;
		}

		const zoom = map?.getZoom();
		let newPolygon = convertBBoxToPolygon(map?.getBounds());

		const isOutside = previousBounds.current ? !booleanWithin(newPolygon, previousBounds.current) : true;
		const show = zoom > minZoomLevel;
		if (isOutside) {
			if (previousBounds.current) {
				newPolygon = difference(newPolygon, previousBounds.current);
			}
			if (show) {
				if (previousBounds.current) {
					previousBounds.current = union(previousBounds.current, newPolygon);
				} else {
					previousBounds.current = newPolygon;
				}
			}
		}

		setMouseMove(state => ({
			polygon: newPolygon,
			show: { current: show, previous: !!state?.show?.current },
			callApi: isOutside && show,
			zoom,
		}));
	};

	useEffect(() => {
		moveend();
	}, [layerState?.layerSettings?.visiable]);

	useEffect(() => {
		map?.on?.('moveend', moveend);
		return () => {
			map?.off('moveend', moveend);
		};
	}, [map, layerState]);

	return mouseMove;
};

export default useOnMouseMoveWells;
