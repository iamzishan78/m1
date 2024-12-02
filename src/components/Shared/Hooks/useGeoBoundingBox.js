import { useEffect, useRef, useState } from 'react';
import { mapStateController } from 'hookstate/mapStateController';

const checkIfNewBoundsIsWithinOld = (newBounds, oldBounds) => {
	const innerBounds = newBounds;
	// Assuming `corner1` and `corner2` are the opposite corners of a bounding box
	const isWithinBounds = (point, bounds) => {
		const { lng, lat } = point;
		const { _ne, _sw } = bounds;

		return lng >= _sw.lng && lng <= _ne.lng && lat >= _sw.lat && lat <= _ne.lat;
	};

	// Check if each corner of the innerBounds is within the outerBounds
	const innerCorners = [
		innerBounds.getNorthEast(),
		innerBounds.getNorthWest(),
		innerBounds.getSouthEast(),
		innerBounds.getSouthWest(),
	];

	let isInnerWithinOuter;
	if (oldBounds) {
		isInnerWithinOuter = innerCorners.every(corner => isWithinBounds(corner, oldBounds));
	}
	return isInnerWithinOuter;
};

const useGeoBoundingBox = (map, minZoomLevel = 7) => {
	const [geoBoundingBox, setGeoBoundingBox] = useState(null);
	const previousBounds = useRef();

	const { moved } = mapStateController.useState(['moved']);

	const moveend = () => {
		const zoom = map.getZoom();
		let bounds = map.getBounds().toArray();

		let isInnerWithinOuter = checkIfNewBoundsIsWithinOld(map?.getBounds(), previousBounds.current);
		if (zoom > minZoomLevel) {
			if (!isInnerWithinOuter) {
				const mapBounds = [...bounds[0], ...bounds[1]];
				setGeoBoundingBox({
					top_left: {
						lat: mapBounds[3],
						lon: mapBounds[0],
					},
					bottom_right: {
						lat: mapBounds[1],
						lon: mapBounds[2],
					},
				});
				previousBounds.current = map?.getBounds();
			}
		} else {
			setGeoBoundingBox(null);
			previousBounds.current = null;
		}
	};

	useEffect(() => {
		moveend();
	}, [moved]);

	useEffect(() => {
		map?.on?.('moveend', moveend);

		return () => {
			map?.off('moveend', moveend);
		};
	}, [map]);

	return geoBoundingBox;
};

export default useGeoBoundingBox;
