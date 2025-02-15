const MapboxDraw = require('@mapbox/mapbox-gl-draw');
const Constants = require('@mapbox/mapbox-gl-draw/src/constants');
const turfCircle = require('@turf/circle').default;
const distance = require('@turf/distance').default;
const turfHelpers = require('@turf/helpers');

const DragRadiusCircleMode = { ...MapboxDraw.modes.draw_polygon };

DragRadiusCircleMode.onSetup = function (opts) {
	// Create the main polygon feature (which will become the circle)
	const polygon = this.newFeature({
		type: Constants.geojsonTypes.FEATURE,
		properties: {
			type: 'circle',
			isCircle: true,
			center: [], // will be set on first mouse down
			active: Constants.activeStates.ACTIVE,
		},
		geometry: {
			type: Constants.geojsonTypes.POLYGON,
			coordinates: [[]],
		},
	});

	// Create a helper feature to show the radius line.
	const radiusLine = this.newFeature({
		type: Constants.geojsonTypes.FEATURE,
		properties: { meta: 'radiusLine', parent: polygon.id, type: 'line', },
		geometry: {
			type: Constants.geojsonTypes.LINE_STRING,
			coordinates: [],
		},
	});
	// Create a label feature to hold the radius value.
	const labelFeature = this.newFeature({
		type: Constants.geojsonTypes.FEATURE,
		properties: { meta: 'labelPoint', labelText: '', parent: polygon.id },
		geometry: {
			type: Constants.geojsonTypes.POINT,
			coordinates: [],
		},
	});

	// Add all helper features.
	this.addFeature(polygon);
	this.addFeature(radiusLine);
	this.addFeature(labelFeature);

	this.updateUIClasses({ mouse: "add" });
    this.setActionableState({
      trash: true
    });

	// Return state including both features.
	return {
		polygon,
		radiusLine,
		labelFeature,
		currentVertexPosition: 0,
	};
};

DragRadiusCircleMode.onDrag = DragRadiusCircleMode.onMouseMove = function (state, e) {
	// if (state.polygon.properties.center.length === 0) {
	// 	state.polygon.properties.center = [e.lngLat.lng, e.lngLat.lat];
	// }

	const center = state.polygon.properties.center;
	if (center.length > 0) {
		if (center.length > 0) {
			const distanceInMiles = distance(turfHelpers.point(center), turfHelpers.point([e.lngLat.lng, e.lngLat.lat]), {
				units: 'miles',
			});
			const circleFeature = turfCircle(center, distanceInMiles, { units: 'miles' });
			state.polygon.incomingCoords(circleFeature.geometry.coordinates);
			state.polygon.properties.radiusMiles = distanceInMiles;

			state.radiusLine.incomingCoords([center, [e.lngLat.lng, e.lngLat.lat]]);

			state.labelFeature.incomingCoords([center[0], center[1]]);
			// Set the label text property to display the distance in miles.
			state.labelFeature.properties.labelText = distanceInMiles.toFixed(2) + ' miles';
		}
	}
};

DragRadiusCircleMode.onStop = function (state) {
	this.updateUIClasses({ mouse: Constants.cursors.NONE });
	this.activateUIButton();

	// check to see if we've deleted this feature
	if (this.getFeature(state.polygon.id) === undefined) {
		if (state.radiusLine.id && state.labelFeature.id) {
			this.deleteFeature([state.radiusLine.id, state.labelFeature.id], { silent: true });
		}
		return;
	}

	if (state.polygon.isValid()) {
		this.map.fire(Constants.events.CREATE, {
			features: [state.polygon.toGeoJSON()],
		});
	} else {
		this.deleteFeature([state.radiusLine.id, state.labelFeature.id], { silent: true });
		 // Add a flag to prevent recursive call
		 if (!state.isChangingMode) {
            state.isChangingMode = true;
            this.changeMode(Constants.modes.SIMPLE_SELECT, {}, { silent: true });
        }
	}
};

DragRadiusCircleMode.onMouseUp = DragRadiusCircleMode.onTouchEnd = function (state, e) { };

DragRadiusCircleMode.onClick = DragRadiusCircleMode.onTap = function (state, e) {
	if (state.polygon.properties.center.length === 0) {
		state.polygon.properties.center = [e.lngLat.lng, e.lngLat.lat];
	} else {
		this.updateUIClasses({ mouse: 'pointer' });
		// Change to SIMPLE_SELECT mode, keeping the drawn circle selected.
		return this.changeMode(Constants.modes.SIMPLE_SELECT);
	}
};

DragRadiusCircleMode.toDisplayFeatures = function (state, geojson, display) {
	// Display all helper features (center dot and label) as well as the main polygon.
	if (geojson.properties.user_meta === 'radiusLine') {
		return display(geojson);
	}
	if (geojson.properties.user_meta === 'label') {
		return display(geojson);
	}

	// For the main polygon, mark it active if it matches.
	const isActivePolygon = geojson.properties.id === state.polygon.id;
	geojson.properties.active = isActivePolygon ? Constants.activeStates.ACTIVE : Constants.activeStates.INACTIVE;
	return display(geojson);
};

DragRadiusCircleMode.onTrash = function (state) {
	this.deleteFeature([state.polygon.id, state.radiusLine.id, state.labelFeature.id], { silent: true });
	this.changeMode(Constants.modes.SIMPLE_SELECT);
};

module.exports = DragRadiusCircleMode;
