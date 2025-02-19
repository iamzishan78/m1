import * as turf from '@turf/turf';
import polylabel from 'polylabel';

import { findBoundsMap } from 'components/MapControls/commonHelper';
import { drawBoundary } from 'components/MapControls/components/DrawShapes/drawShapesHelpers';
import { ifDefaultIdentifier, ifGenericShapeIdentifier } from 'components/Shared/functions/shapeLayer';

import { drawController } from 'controllers/drawStateController';
import { layerController } from 'controllers/layerStateController';
import { popupController } from 'controllers/popupStateController';

const udLayerClickHandler = (feature, stateLayer) => {
	const history = layerController.getValue('history');

	let selectedUserDefinedLayer;
	selectedUserDefinedLayer = {
		...feature,
	};

	const { isDrawing, editDraw, showDrawShapesPopup, shapeEditMode } = drawController.getValues([
		'isDrawing',
		'editDraw',
		'showDrawShapesPopup',
		'shapeEditMode',
	]);

	if (isDrawing) {
		return;
	}

	let popupStateVal;
	let isFileLayer = false;
	const isAoi = ['Interests', 'Area of Interest'].includes(feature.identifier);

	if (ifGenericShapeIdentifier(feature.identifier)) {
		const newPath = `/map/${feature.identifier.toLowerCase()}/${feature.properties.id}`;
		if (history?.location.pathname !== newPath) {
			history?.replace(newPath);
		}

		popupStateVal = {
			expandedCard: true,
			selectedShape: { ...feature.properties, feature: selectedUserDefinedLayer },
		};
	} else if (isAoi) {
		let drawStateVal;

		popupStateVal = {
			selectedUserDefinedLayer,
		};

		// Draw the AOI boundry
		drawBoundary(selectedUserDefinedLayer);

		if (!editDraw) {
			drawStateVal = {
				editDraw: true,
				showShapeActionsPopup: true,
				showDrawShapesPopup: !showDrawShapesPopup,
			};
		} else {
			drawController.reset();
		}

		if (drawStateVal) {
			drawController.updateState(drawStateVal);
		}

		findBoundsMap([feature], window.mapRef, {
			top: 300,
			bottom: 300,
			left: 300,
			right: 300,
		});
		popupController.setState(popupStateVal);

		window.mapRef?.resize();
		return;
	} else {
		// For user defined layers details popup
		let shapeCenter;
		const featureLayer = { ...feature.layer, ...stateLayer };
		if (
			(featureLayer.layerGeometry === 'LineString' && feature.geometry.type === 'LineString') ||
			(featureLayer.layerGeometry === 'MultiLineString' && feature.geometry.type === 'LineString')
		) {
			const lineLength = turf.length(feature.geometry, { units: 'miles' });
			const lineCenterGeometry = turf.along(feature.geometry, lineLength / 2, {
				units: 'miles',
			});
			shapeCenter = lineCenterGeometry.geometry.coordinates;
		} else if (
			(featureLayer.layerGeometry === 'Circle' && feature.geometry.type === 'MultiPolygon') ||
			(featureLayer.layerGeometry === 'Point' && feature.geometry.coordinates.length === 2)
		) {
			shapeCenter = feature.geometry.coordinates;
		} else if (featureLayer.layerGeometry === 'Polygon' && feature.geometry.type === 'Polygon') {
			shapeCenter = polylabel(feature.geometry.coordinates);
		} else {
			shapeCenter = turf.centroid(feature.geometry)?.geometry?.coordinates;
		}
		selectedUserDefinedLayer = {
			...feature,
			properties: {
				...feature.properties,
				shapeCenter,
			},
			layer: featureLayer,
			geometry: feature.geometry || feature._geometry,
		};
		feature = selectedUserDefinedLayer;

		isFileLayer = true;
		popupStateVal = {
			selectedUserDefinedLayer,
		};
	}

	if ((!showDrawShapesPopup || ifDefaultIdentifier(feature.identifier)) && shapeEditMode !== 'redraw') {
		popupController.createUDPopUp(feature.properties);
	}

	if (!isFileLayer) {
		findBoundsMap([feature], window.mapRef);
	}
	popupController.setState(popupStateVal);

	window.mapRef?.resize();
};

export default udLayerClickHandler;
