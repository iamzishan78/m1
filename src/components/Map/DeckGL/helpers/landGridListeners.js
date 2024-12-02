import { getPolygonString } from 'components/Shared/functions';
import { createFilterPopup } from './common';
import { navController } from 'hookstate/navStateController';

export const drawUpdateListener = (e, getAbstractGeoContains) => {
	if (
		e.features[0].id.includes('draw_polygon') ||
		e.features[0].id.includes('drag_circle') ||
		e.features[0].id.includes('draw_rectangle')
	) {
		const feature = e.features[0];

		const polygonString = getPolygonString(feature);

		getAbstractGeoContains({
			variables: {
				polygon: polygonString,
			},
		});

		createFilterPopup(feature);

		navController.updateState({ filterDrawing: ['within', feature] });
	}
};
