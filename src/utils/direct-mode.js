const MapboxDraw = require('@mapbox/mapbox-gl-draw');
const Constants = require('@mapbox/mapbox-gl-draw/src/constants');
const distance = require('@turf/distance').default;
const turfHelpers = require('@turf/helpers');
const circle = require('@turf/circle').default;

// eslint-disable-next-line import/order
import constrainFeatureMovement from '@mapbox/mapbox-gl-draw/src/lib/constrain_feature_movement';
import createSupplementaryPoints from '@mapbox/mapbox-gl-draw/src/lib/create_supplementary_points';
import doubleClickZoom from '@mapbox/mapbox-gl-draw/src/lib/double_click_zoom';
import moveFeatures from '@mapbox/mapbox-gl-draw/src/lib/move_features';

function createVertex(parentId, coordinates, path, selected) {
	return {
		type: Constants.geojsonTypes.FEATURE,
		properties: {
			meta: Constants.meta.VERTEX,
			parent: parentId,
			coord_path: path,
			active: selected ? Constants.activeStates.ACTIVE : Constants.activeStates.INACTIVE,
		},
		geometry: {
			type: Constants.geojsonTypes.POINT,
			coordinates,
		},
	};
}

const createSupplementaryPointsForCircle = geojson => {
	const { properties, geometry } = geojson;

	if (!properties.user_isCircle) return null;

	const supplementaryPoints = [];
	const vertices = geometry.coordinates[0].slice(0, -1);
	for (let index = 0; index < vertices.length; index += Math.round(vertices.length / 4)) {
		supplementaryPoints.push(createVertex(properties.id, vertices[index], `0.${index}`, false));
	}

	return supplementaryPoints;
};

const DirectModeOverride = MapboxDraw.modes.direct_select;

DirectModeOverride.onSetup = function (opts) {
	const featureId = opts.featureId;
	const feature = this.getFeature(featureId);

	if (!feature) {
		throw new Error('You must provide a featureId to enter direct_select mode');
	}

	if (feature.type === Constants.geojsonTypes.POINT) {
		throw new TypeError("direct_select mode doesn't handle point features");
	}

	// Create a helper feature to show the radius line.
	const radiusLine = this.newFeature({
		type: Constants.geojsonTypes.FEATURE,
		properties: { meta: 'radiusLine', parent: featureId },
		geometry: {
			type: Constants.geojsonTypes.LINE_STRING,
			coordinates: [],
		},
	});

	// Create a label feature to hold the radius value.
	const labelFeature = this.newFeature({
		type: Constants.geojsonTypes.FEATURE,
		properties: { meta: 'labelPoint', labelText: '', parent: featureId },
		geometry: {
			type: Constants.geojsonTypes.POINT,
			coordinates: [],
		},
	});

	const state = {
		featureId,
		feature,
		dragMoveLocation: opts.startPos || null,
		dragMoving: false,
		canDragMove: false,
		selectedCoordPaths: opts.coordPath ? [opts.coordPath] : [],
	};

	this.setSelectedCoordinates(this.pathsToCoordinates(featureId, state.selectedCoordPaths));
	this.setSelected(featureId);
	doubleClickZoom.disable(this);

	this.setActionableState({
		trash: true,
	});

	this.addFeature(radiusLine);
	this.addFeature(labelFeature);

	const newState = {
		...state,
		radiusLine,
		labelFeature,
		currentVertexPosition: 0,
	};
	return newState;
};

DirectModeOverride.dragFeature = function (state, e, delta) {
	moveFeatures(this.getSelected(), delta);
	this.getSelected()
		.filter(feature => feature.properties.isCircle)
		.map(circle => circle.properties.center)
		.forEach(center => {
			center[0] += delta.lng;
			center[1] += delta.lat;
		});
	state.dragMoveLocation = e.lngLat;
};

DirectModeOverride.dragVertex = function (state, e, delta) {
	if (state.feature.properties.isCircle) {
		state.feature.properties.isdragMode = true;
		const center = state.feature.properties.center;
		const movedVertex = [e.lngLat.lng, e.lngLat.lat];
		const radius = distance(turfHelpers.point(center), turfHelpers.point(movedVertex), { units: 'kilometers' });
		const circleFeature = circle(center, radius);
		state.feature.incomingCoords(circleFeature.geometry.coordinates);
		state.feature.properties.radiusInKm = radius;
		state.radiusLine.incomingCoords([center, [e.lngLat.lng, e.lngLat.lat]]);
		state.labelFeature.incomingCoords([center[0], center[1]]);
		// Set the label text property to display the distance in miles.
		const distanceInMiles = distance(turfHelpers.point(center), turfHelpers.point([e.lngLat.lng, e.lngLat.lat]), {
			units: 'miles',
		});
		state.labelFeature.properties.labelText = distanceInMiles.toFixed(2) + ' miles';
	} else {
		const selectedCoords = state.selectedCoordPaths.map(coord_path => state.feature.getCoordinate(coord_path));
		const selectedCoordPoints = selectedCoords.map(coords => ({
			type: Constants.geojsonTypes.FEATURE,
			properties: {},
			geometry: {
				type: Constants.geojsonTypes.POINT,
				coordinates: coords,
			},
		}));

		const constrainedDelta = constrainFeatureMovement(selectedCoordPoints, delta);
		for (let i = 0; i < selectedCoords.length; i++) {
			const coord = selectedCoords[i];
			state.feature.updateCoordinate(
				state.selectedCoordPaths[i],
				coord[0] + constrainedDelta.lng,
				coord[1] + constrainedDelta.lat
			);
		}
	}
};

DirectModeOverride.toDisplayFeatures = function (state, geojson, push) {
	if (state.featureId === geojson.properties.id) {
		geojson.properties.active = Constants.activeStates.ACTIVE;
		push(geojson);
		const supplementaryPoints = geojson.properties.user_isCircle
			? createSupplementaryPointsForCircle(geojson)
			: createSupplementaryPoints(geojson, {
					map: this.map,
					midpoints: true,
					selectedPaths: state.selectedCoordPaths,
				});
		supplementaryPoints.forEach(push);
	} else {
		geojson.properties.active = Constants.activeStates.INACTIVE;
		push(geojson);
	}
	this.fireActionable(state);
};

DirectModeOverride.onStop = function (state) {
	this.deleteFeature([state.radiusLine.id, state.labelFeature.id], { silent: true });
	doubleClickZoom.enable(this);
	this.clearSelectedCoordinates();

	state.feature.properties.isdragMode = undefined;
	state.radiusLine = undefined;
	state.labelFeature = undefined;
};

export default DirectModeOverride;
