/* eslint-disable no-use-before-define */
import { hookstate } from '@hookstate/core';
import union from '@turf/union';
import hat from 'hat';
import * as turf from '@turf/turf';
import polylabel from 'polylabel';

import { layerRefs } from 'hookstate';
import { hookStateController } from 'hookstate/hookStateController';
import { setMapGridCardState, toggleMapGridCardAtived } from 'actions';
import { copy, getPolygonString } from 'components/Shared/functions';
import {
	addCustomShapeProperties,
	drawBoundary,
	getDrawAdustedShape,
} from 'components/MapControls/components/DrawShapes/drawShapesHelpers';
import {
	clearMapAndCloseShapeActionsPopup,
	drawShapeLayerToggle,
	findBoundsMap,
	setFeatureProperty,
} from 'components/MapControls/commonHelper';
import { spatialDataAttributes } from 'components/MapControls/components/DrawShapes/constants';
import { makeGeoJSONFromStrings } from 'components/Map/DeckGL/helpers/common';
import { calculateLandArea, shapeTypeLayers } from 'components/Shared/functions/shapeLayer';
import { DRAWING_MODES } from 'components/Navigation/NavigationContext';
import { popupController } from './popupStateController';
import { globalStateController } from './globalStateController';
import { layerFiltersController } from './layerFiltersController';

const initialState = {
	showDataCard: false,
	isDrawing: false,
	editDraw: false,
	showShapeActionsPopup: false,
	showDrawShapesPopup: false,
	multiSelectLandGrids: false,
	selectedAbstracts: [],
	currentFeature: null,
	shapeEdit: false,
	shapeEditMode: '',
	showAddShapePopup: false,
	featureToEdit: null,
	featureOrMapShape: null,
	selectedAoi: null,
	selectedPolygonString: '',
	reDrawShape: false,
	shapeToExtend: null,
	lastSelectedDrawMode: 'none',
	shapeActionsFilterSelected: false,
	enableEdit: false,
	selectedAction: '',
};

export const drawState = hookstate(copy(initialState));

const drawStateControllerHandler = state => {
	/* --------------------------- DrawShapes Actions --------------------------- */

	const drawUpdateListener = ({ features, action }) => {
		if (action === 'move' || action === 'change_coordinates') {
			const [feature] = features;

			// Don't run when shape is in rotate state
			if (feature?.properties?.isrotate) return;

			if (feature) addCustomShapeProperties(feature, window.drawRef);

			drawController.updateState({
				editDraw: true,
				currentFeature: feature,
				featureOrMapShape: feature,
			});
			popupController.updateState({ popupOpen: false });
		}
	};

	const drawCreateListener = ({ features }) => {
		const [feature] = features;
		const draw = window.drawRef;

		const { currentFeature, lastSelectedDrawMode, reDrawShape } = drawController.getValues([
			'currentFeature',
			'lastSelectedDrawMode',
			'reDrawShape',
		]);

		if (feature) addCustomShapeProperties(feature, draw);

		setFeatureProperty(draw, feature.id, 'shapeEdit', false);

		drawShapeLayerToggle(lastSelectedDrawMode === 'draw_polygon' ? 'visible' : 'none');

		if (reDrawShape && currentFeature) currentFeature.geometry = feature.geometry;
		else if (currentFeature && !reDrawShape) {
			const newFeature = union(feature, currentFeature);
			currentFeature.geometry = newFeature.geometry;
		}

		const currentFeatureUpdate = currentFeature || feature;

		drawController.updateState({
			editDraw: false,
			reDrawShape: false,
			showShapeActionsPopup: true,
			currentFeature: currentFeatureUpdate,
			enableEdit: currentFeatureUpdate && !reDrawShape,
		});

		setTimeout(() => {
			draw.deleteAll();
			draw.add(feature);
			addCustomShapeProperties(feature, draw);
			setFeatureProperty(draw, feature.id, 'shapeEdit', false);
			draw.changeMode('simple_select');

			drawController.updateState({
				editDraw: false,
				currentFeature: currentFeatureUpdate,
			});
		}, 10);
	};

	const drawSelectionChangeListener = ({ features }) => {
		const [feature] = features;

		// Don't run when shape is in rotate state
		if (feature?.properties?.isrotate) return;

		const { shapeEdit, lastSelectedDrawMode } = drawController.getValues(['shapeEdit', 'lastSelectedDrawMode']);

		if (feature && !feature.id.includes('edit_polygon'))
			drawController.updateState({
				editDraw: false,
				currentFeature: feature,
				featureOrMapShape: feature,
			});

		const drawFeatures = window.drawRef.getAll();

		drawShapeLayerToggle(
			shapeEdit ||
				!drawFeatures.features ||
				drawFeatures.features.length === 0 ||
				lastSelectedDrawMode === 'draw_polygon'
				? 'visible'
				: 'none'
		);
	};

	const actionClose = (dispatch, additionalProps = {}) => {
		const { shapeEditMode, showAddShapePopup } = drawController.getValues(['shapeEditMode', 'showAddShapePopup']);

		clearMapAndCloseShapeActionsPopup();

		drawBoundary(window.mapRef);

		// Removing layer of AOI Label
		if (window.mapRef.getLayer('aoi_label_layer')) {
			window.mapRef.removeLayer('aoi_label_layer');
		}

		drawController.updateState({
			currentFeature: null,
			selectedAoi: null,
			shapeEditMode: shapeEditMode === 'redraw' ? '' : showAddShapePopup,
			changeDrawShapeType: false,
			reDrawShape: false,
			showAddShapePopup: false,
			selectedPolygonString: '',
			showDataCard: false,
		});

		window.setStateApp(state => ({
			...state,
			shapeGridWellsCount: 0,
			shapeGridOwnersCount: 0,
			...additionalProps,
		}));

		dispatch(
			setMapGridCardState({
				mapGridCardActiveTap: 0,
			})
		);
	};

	/* ------------------------- DrawShapes Actions End ------------------------- */

	/* ------------------------- DrawShapesPopup Actions ------------------------ */

	const handleCloseAbstractSelection = () => {
		const selectedAbstracts = drawController.getValue('selectedAbstracts');

		const popUps = document.getElementsByClassName('mapboxgl-popup');
		if (popUps[0]) popUps[0].remove();

		drawController.updateState({
			selectedAbstracts: [],
		});

		const sourceId = layerRefs.abstract_geo?.get({ noproxy: true })?.sourceId;

		if (!sourceId) return;

		for (let i = 0; i < selectedAbstracts.length; i++) {
			const id = selectedAbstracts[i].properties.Id;
			window.mapRef.setFeatureState({ source: sourceId, id }, { click: false });
		}
	};

	const onActionClick = (handleClose, shape) => {
		if (shape.disable) return;

		const { multiSelectLandGrids, currentFeature } = drawController.getValues([
			'multiSelectLandGrids',
			'currentFeature',
		]);

		if (shape.title === 'Multiple Select') {
			if (multiSelectLandGrids) {
				// removing all selected land grids
				// eslint-disable-next-line no-use-before-define
				handleCloseAbstractSelection();
			}

			// enabling/disabling multi select land grid
			drawController.updateState({
				lastSelectedDrawMode: shape.mode,
				shapeToExtend: currentFeature,
				changeDrawShapeType: false,
			});
		} else {
			drawController.updateState({
				lastSelectedDrawMode: shape.mode,
				changeDrawShapeType: false,
			});

			handleClose();
		}

		drawController.updateState({
			isDrawing: true,
			editDraw: true,
			multiSelectLandGrids: true,
		});

		if (shape.mode === 'draw_polygon') drawShapeLayerToggle('visible');

		window.drawRef.changeMode(shape.mode);
	};

	const createMultiSelectedFeature = () => {
		let newFeature;
		const featureId = hat();

		const { selectedAbstracts, shapeToExtend, shapeEditMode, currentFeature } = drawController.getValues([
			'selectedAbstracts',
			'shapeToExtend',
			'shapeEditMode',
			'currentFeature',
		]);

		selectedAbstracts.forEach((abstractFeature, index) => {
			if (index < selectedAbstracts.length - 1 && !newFeature) {
				newFeature = union(abstractFeature, selectedAbstracts[index + 1]);
			} else if (index < selectedAbstracts.length - 1 && newFeature) {
				newFeature = union(newFeature, selectedAbstracts[index + 1]);
			} else if (selectedAbstracts.length === 1) {
				newFeature = selectedAbstracts[index];
			}
		});

		if (!newFeature) newFeature = currentFeature;

		newFeature.id = featureId;
		newFeature.properties.id = featureId;

		if (shapeToExtend) {
			if (shapeEditMode !== 'redraw') newFeature = union(newFeature, shapeToExtend);
			shapeToExtend.geometry = newFeature.geometry;
			newFeature = shapeToExtend;
		}

		// adding new polygon into map instance
		window.drawRef.add(newFeature);

		drawController.updateState({
			selectedAbstracts: [],
			currentFeature: newFeature,
			shapeToExtend: null,
			multiSelectLandGrids: false,
			isAbstractedLayersPolygon: true,
			showShapeActionsPopup: true,
			reDrawShape: false,
		});

		addCustomShapeProperties(newFeature, window.drawRef);

		window.drawRef.changeMode('draw_polygon');
	};

	/* ----------------------- DrawShapesPopup Actions End ---------------------- */

	/* -------------------------- ShapeAOIPopup Actions ------------------------- */

	const updateSourceAndAoiLayer = currentFeature => {
		window.mapRef.getSource('aoi_label_source').setData({
			type: 'FeatureCollection',
			features: [currentFeature],
		});

		// Add a symbol layer
		window.mapRef.addLayer({
			id: 'aoi_label_layer',
			type: 'symbol',
			source: 'aoi_label_source',
			layout: {
				'text-field': ['get', 'shapeLabel'],
				'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
				'text-size': 40,
				'text-anchor': 'center',
				'text-justify': 'center',
			},
		});

		drawController.updateState({
			currentFeature,
		});
		const drewShapeOnMap = window.drawRef.get(currentFeature.id);
		if (drewShapeOnMap) {
			window.drawRef.setFeatureProperty(currentFeature.id, 'shapeLabel', currentFeature.properties.shapeLabel);
		}
	};

	const handleSaveAOIToShape = (dataName, upsertCustomLayer) => {
		const dataType = 'interest';
		const currentFeature = drawController.getValue('currentFeature');

		const spatialData = {
			sdType: dataType,
			shapeLabel: dataName,
			projectName: '',
			sdGrossAcres: '',
		};
		spatialDataAttributes.forEach(attribute => {
			window.drawRef.setFeatureProperty(currentFeature?.id, attribute, spatialData[attribute]);
			if (spatialData[attribute] != null || typeof spatialData[attribute] !== 'undefined') {
				if (currentFeature) currentFeature.properties[attribute] = spatialData[attribute];
			}
		});

		if (currentFeature) currentFeature.properties.id = currentFeature?.id;

		drawBoundary(window.mapRef, currentFeature);

		const user = globalStateController.getValue('user');

		if (user && user.mongoId !== '') {
			const customLayerData = {
				shapeJson: currentFeature,
				shape: JSON.stringify(currentFeature),
				layer: dataType,
				name: spatialData.shapeLabel,
				user: user.mongoId,
			};

			upsertCustomLayer({
				variables: { customLayer: customLayerData },
				refetchQueries: ['getCustomLayers'],
				// awaitRefetchQueries: true,
			});

			updateSourceAndAoiLayer(currentFeature);
		}

		state.merge({ showDataCard: true });
	};

	const handleEditAOIToShape = (dataName, updateCustomLayer) => {
		const dataType = 'interest';

		// save data onto geoJSON properties fields
		const spatialData = {
			sdType: dataType,
			shapeLabel: dataName,
			projectName: '',
			sdGrossAcres: '',
			// sdNotes: dataNotes
		};
		const { currentFeature, selectedAoi } = drawController.getValues(['currentFeature', 'selectedAoi']);

		addCustomShapeProperties(currentFeature, window.drawRef);

		spatialDataAttributes.forEach(attribute => {
			if (spatialData[attribute] != null || typeof spatialData[attribute] !== 'undefined') {
				if (currentFeature) currentFeature.properties[attribute] = spatialData[attribute];
			}
		});

		const user = globalStateController.getValue('user');

		// //////cleaning the selected title opinion and redirecting to title opinion page//
		if (user && user.mongoId !== '') {
			const customLayerId = selectedAoi.id;

			const customLayerData = {
				shapeJson: currentFeature,
				shape: JSON.stringify(currentFeature),
				layer: dataType,
				name: spatialData.shapeLabel,
				user: user.mongoId,
			};
			updateCustomLayer({
				variables: {
					customLayerId,
					customLayer: customLayerData,
				},
				refetchQueries: ['getCustomLayers'],
				awaitRefetchQueries: true,
			});

			updateSourceAndAoiLayer(currentFeature);
		}

		state.merge({ showDataCard: true });
	};

	/* ------------------------ ShapeAOIPopup Actions End ----------------------- */

	/* ------------------------ ShapeActionsPopup Actions ----------------------- */

	const isLine = () => drawController.getValue('currentFeature')?.geometry?.type === 'LineString';

	const updateSelectedLayerFeature = (dispatch, customLayer) => {
		let feature = copy(customLayer.shapeJson);
		feature.id = customLayer._id;
		feature.properties.id = customLayer._id;
		feature.layer = { id: customLayer.layer };
		let key;
		if (customLayer.layer === 'parcel') key = 'selectedParcel';
		if (shapeTypeLayers.includes(customLayer.layer)) key = 'selectedShape';
		feature = { ...feature.properties, feature };

		findBoundsMap([feature], window.mapRef);
		drawBoundary(window.mapRef, feature);
		actionClose(dispatch);
		popupController.updateState({
			[key]: feature,
			expandedCard: true,
			popupOpen: false,
		});
	};

	const clearFilter = () => {
		layerFiltersController.updateState({
			polygonFilter: null,
		});

		window.setStateNav(stateNav => ({
			...stateNav,
			drawingMode: null,
			filterDrawing: [],
		}));

		drawController.updateState({
			shapeActionsFilterSelected: false,
		});
	};

	const actionEdit = _shapeEdit => {
		const {
			shapeEdit: shapeEditVal,
			selectedAoi,
			featureToEdit,
			currentFeature,
		} = drawController.getValues(['shapeEdit', 'selectedAoi', 'featureToEdit', 'currentFeature']);
		const selectedFeature = drawController.getValue('currentFeature');

		const enableEditOnly = featureToEdit?.layer?.id === 'parcel' || shapeTypeLayers.includes(featureToEdit?.layer?.id);

		const shapeEdit = _shapeEdit ?? shapeEditVal;
		// If shape doesn't exist! AOI case
		if (!window.drawRef.get(currentFeature?.id)) {
			window.drawRef.add(currentFeature);
		}

		// If filter is applied, then remove it
		clearFilter();

		if (!shapeEdit) {
			window.drawRef.changeMode('direct_select', {
				featureId: selectedFeature.id,
			});
		} else {
			window.drawRef.changeMode('static');
		}

		window.setStateNav(stateNav => ({
			...stateNav,
			drawingMode: DRAWING_MODES.DRAW_CIRCLE,
		}));
		setFeatureProperty(window.drawRef, selectedFeature.id, 'shapeEdit', !shapeEdit);
		drawShapeLayerToggle(!shapeEdit ? 'visible' : 'none');

		drawController.updateState({
			currentFeature: selectedFeature,
			shapeEdit: !shapeEdit,
		});
		if (selectedAoi) drawController.setSelectedAction('edit-aoi');
		else if (enableEditOnly) drawController.setSelectedAction('edit-shape');
	};

	const closeDrawTool = () => {
		const selectedFeature = drawController.getValue('currentFeature');

		try {
			if (selectedFeature.id) window.drawRef.changeMode('direct_select', { featureId: selectedFeature.id });
		} catch (err) {
			//
		}
		setFeatureProperty(window.drawRef, selectedFeature.id, 'shapeEdit', false);
		drawShapeLayerToggle('none');
		drawController.updateState({
			currentFeature: selectedFeature,
			shapeEdit: false,
		});
	};

	const actionShowWellsAndOwners = dispatch => {
		if (isLine()) return;

		const selectedFeature = drawController.getValue('currentFeature');

		drawController.updateState({
			selectedPolygonString: getPolygonString(selectedFeature),
		});

		dispatch(toggleMapGridCardAtived());

		closeDrawTool();
	};

	const applyFilter = () => {
		const selectedFeature = drawController.getValue('currentFeature');

		layerFiltersController.updateState({
			polygonFilter: selectedFeature.geometry,
		});

		// Changing shape to Blue
		window.drawRef.changeMode('simple_select');

		window.setStateNav(stateNav => ({
			...stateNav,
			drawingMode: null,
			filterDrawing: ['within', selectedFeature],
		}));

		drawController.updateState({
			shapeActionsFilterSelected: true,
		});

		closeDrawTool();
	};

	const actionFilter = () => {
		if (isLine()) return;

		const { shapeActionsFilterSelected, currentFeature } = drawController.getValues([
			'shapeActionsFilterSelected',
			'currentFeature',
		]);

		if (shapeActionsFilterSelected) {
			clearFilter();

			// Changing back to original shape
			if (window.drawRef.get(currentFeature?.id))
				window.drawRef.changeMode('direct_select', {
					featureId: currentFeature?.id,
				});
		} else {
			applyFilter();
		}
		drawController.setSelectedAction('filter');
	};

	const actionAOI = () => {
		if (isLine()) return;

		const selectedFeature = drawController.getValue('currentFeature');

		selectedFeature.properties.sdType = 'interest';

		drawController.setShowDataCard(!drawController.getValue('showDataCard'));
	};

	const calculateShapeCenter = shapeCoordinates => polylabel(shapeCoordinates);

	const getAbstractGeoSource = (abstractData, abstractShape) => {
		const abstractGeo = abstractData?.abstractGeo;
		if (!abstractGeo) return abstractShape;
		const featuresList = makeGeoJSONFromStrings(abstractGeo).features;
		if (!featuresList) return abstractShape;

		if (!abstractShape.properties.State && !abstractShape.properties.StateAbbreviation) {
			const result = featuresList.reduce(
				(result, currentFeature) => {
					const intersection = turf.intersect(abstractShape, currentFeature);
					const area = turf.area(intersection);
					return area > result.area ? { area, feature: currentFeature } : result;
				},
				{ area: 0, feature: null }
			);
			if (result?.feature?.properties) abstractShape.properties = result.feature.properties;
		}
		return abstractShape;
	};

	const getParcelAndShapeName = abstractShape => {
		const properties = abstractShape?.properties;
		const township = properties?.Township;
		const range = properties?.Range;
		const section = properties?.ShortName;
		let parcelName;
		if (abstractShape.properties.State === 'TX') {
			parcelName = `${abstractShape.properties.Survey} ${abstractShape.properties.AbstractName}`;
		} else if (township && range && section) {
			parcelName = `T${township} R${range} — Section ${section}`;
		} else {
			parcelName = 'PLSS Default Name';
		}
		if (parcelName.includes('undefined')) {
			parcelName = 'PLSS Default Name';
		}
		return parcelName;
	};

	const saveAndOpenParcelDetail = (upsertCustomLayer, dispatch, history, abstractData) => {
		const user = globalStateController.getValue('user');
		const { currentFeature } = drawController.getValues(['currentFeature']);

		if (!user?._id) return;

		const abstractShape = getAbstractGeoSource(abstractData, currentFeature);
		abstractShape.properties.State = abstractShape?.properties?.State || abstractShape?.properties?.StateAbbreviation;
		abstractShape.properties.Section = abstractShape?.properties?.Section || abstractShape?.properties?.ShortName;
		abstractShape.properties.Meridian =
			abstractShape?.properties?.Meridian || abstractShape?.properties?.PrincipalMeridian;
		const parcelName = getParcelAndShapeName(abstractShape);
		const originalProperties = abstractShape.properties;

		const featureId = hat();
		const newShapeFeature = {
			id: featureId,
			type: 'Feature',
			geometry: abstractShape.geometry,
			properties: {
				originalProperties,
				...originalProperties,
				sdType: 'parcel',
				shapeLabel: parcelName,
				projectName: '',
				sdNotes: '',
				sdGrossAcres: '',
				shapeArea: calculateLandArea(abstractShape),
				shapeCenter: calculateShapeCenter(abstractShape.geometry.coordinates),
				shapeLabelLayer: '',
				id: featureId,
			},
		};
		const customLayerData = {
			shapeJson: newShapeFeature,
			shape: JSON.stringify(newShapeFeature),
			layer: 'parcel',
			name: parcelName,
			user: user._id,
			state: abstractShape.properties.State,
		};

		upsertCustomLayer({
			variables: { customLayer: customLayerData },
		}).then(result => {
			updateSelectedLayerFeature(dispatch, result.data.upsertCustomLayer.customLayer);
			const layerId = result.data.upsertCustomLayer.customLayer._id;
			if (layerId) {
				const newPath = `/map/parcels/${layerId}`;
				if (history.location.pathname !== newPath) history.replace(newPath);
			}
		});
	};

	const saveAndOpenShapeDetail = (upsertCustomLayer, dispatch, history, abstractData, layerType, layerSubType) => {
		const user = globalStateController.getValue('user');
		const { currentFeature } = drawController.getValues(['currentFeature']);

		if (!user?._id) return;

		const abstractShape = getAbstractGeoSource(abstractData, abstractData, currentFeature);
		let shapeSubtitle = '';
		const shapeName = getParcelAndShapeName(abstractShape);
		const state = abstractShape?.properties?.State || abstractShape?.properties?.StateAbbreviation;
		const section = abstractShape?.properties?.Section || abstractShape?.properties?.ShortName;
		let blockTownship = `BLK ${abstractShape?.properties?.Block || ''}`;
		if (!abstractShape?.properties?.Block && (abstractShape?.properties?.Township || '')) {
			blockTownship = `TOWN ${abstractShape?.properties?.Township || ''}`;
		}
		if (abstractShape?.properties?.County && state) {
			if (layerType === 'unit') {
				if (abstractShape.properties.State === 'TX')
					shapeSubtitle = `${abstractShape?.properties?.County}, ${state || ''} - ${blockTownship}${section ? `, SEC ${section}` : ''
						}`;
				else shapeSubtitle = `${abstractShape?.properties?.County}, ${state || ''} - ${shapeName}`;
			}
			if (layerType === 'agreement') shapeSubtitle = `${abstractShape?.properties?.County}, ${state}`;
		}
		let properties = {};
		if (layerType === 'unit') properties = { uName: shapeName, uNumber: '', uType: '', uOperator: '', uStatus: '' };
		if (layerType === 'agreement') properties = { agreementName: shapeName, agreementType: layerSubType };
		const featureId = hat();
		const newShapeFeature = {
			id: featureId,
			type: 'Feature',
			geometry: abstractShape.geometry,
			properties: {
				originalProperties: abstractShape.properties,
				shapeSubtitle,
				type: layerType,
				layerType,
				layerSubType,
				shapeLabel: shapeName,
				...properties,
				shapeArea: calculateLandArea(abstractShape),
				shapeCenter: calculateShapeCenter(abstractShape.geometry.coordinates),
				id: featureId,
			},
		};
		const customLayerData = {
			shapeJson: newShapeFeature,
			shape: JSON.stringify(newShapeFeature),
			layer: layerSubType || layerType,
			name: shapeName,
			user: user._id,
		};

		upsertCustomLayer({
			variables: { customLayer: customLayerData },
		}).then(result => {
			updateSelectedLayerFeature(dispatch, result.data.upsertCustomLayer.customLayer);
			const layerId = result.data.upsertCustomLayer.customLayer._id;
			if (layerId) {
				const newPath = `/map/${layerSubType || layerType}s/${layerId}`;
				if (history.location.pathname !== newPath) history.replace(newPath);
			}
		});
	};

	const updateAndOpenShapeDetail = (updateCustomLayer, dispatch, history, abstractData, layerData) => {
		const { currentFeature } = drawController.getValues(['currentFeature']);

		const abstractShape = getAbstractGeoSource(abstractData, currentFeature);
		layerData.shapeJson.geometry = abstractShape?.geometry;
		layerData.shapeJson.properties = {
			...layerData.shapeJson.properties,
			originalProperties: abstractShape?.properties,
			shapeArea: calculateLandArea(abstractShape),
			shapeCenter: calculateShapeCenter(abstractShape?.geometry.coordinates),
		};
		const customLayerData = {
			shapeJson: layerData.shapeJson,
			shape: JSON.stringify(layerData.shapeJson),
			layer: layerData.layer,
			name: layerData.shapeLabel,
			user: layerData.user?._id,
		};

		updateCustomLayer({
			variables: {
				customLayerId: layerData._id,
				customLayer: customLayerData,
			},
		}).then(() => {
			const newPath = `/map/${layerData.shapeJson.properties.layerSubType}s/${layerData._id}`;
			if (history.location.pathname !== newPath) history.replace(newPath);
		});
		const jsonLayer = copy(customLayerData.shapeJson);
		jsonLayer.layer = { id: customLayerData.layer };
		jsonLayer.id = layerData._id;

		findBoundsMap([jsonLayer], window.mapRef);
		drawBoundary(window.mapRef, jsonLayer);
		popupController.updateState({
			selectedShape: {
				...jsonLayer.properties,
				feature: jsonLayer,
				id: layerData._id,
			},
		});

		actionClose(dispatch);
		updateSelectedLayerFeature(dispatch, layerData);
	};

	const confirmEditing = (updateCustomLayer, dispatch) => {
		const { selectedAoi, currentFeature } = drawController.getValues(['selectedAoi', 'currentFeature']);

		const user = globalStateController.getValue('user');

		const shapeJson = {
			...currentFeature,
			shapeArea: calculateLandArea(currentFeature),
			shapeCenter: calculateShapeCenter(currentFeature?.geometry.coordinates),
		};
		const customLayerData = {
			shapeJson,
			shape: JSON.stringify(shapeJson),
			layer: selectedAoi.layer.id,
			user: user.mongoId,
		};

		if (selectedAoi.layer.id === 'interest') {
			customLayerData.name = currentFeature?.properties.shapeLabel;
		}
		addCustomShapeProperties(currentFeature, window.drawRef);

		updateCustomLayer({
			variables: {
				customLayerId: selectedAoi.id || selectedAoi._id,
				customLayer: customLayerData,
			},
			refetchQueries: ['getCustomLayers'],
			awaitRefetchQueries: true,
		});
		setTimeout(() => actionClose(dispatch), 0);
	};

	const confirmShapeEditing = (updateCustomLayer, dispatch, history) => {
		const { featureToEdit, shapeEditMode, currentFeature } = drawController.getValues([
			'featureToEdit',
			'shapeEditMode',
			'currentFeature',
		]);

		const isShapeResizeMode =
			featureToEdit?.layer?.id === 'parcel' || shapeTypeLayers.includes(featureToEdit?.layer?.id);

		let drawFeature = null;
		if (isShapeResizeMode && shapeEditMode === 'rotate') {
			const quarters = [
				'NWNW',
				'NWSW',
				'SWNW',
				'SWSW',
				'SESW',
				'NESW',
				'SENW',
				'NENW',
				'SWSE',
				'NWSE',
				'SWNE',
				'NWNE',
				'SESE',
				'NESE',
				'SENE',
				'NENE',
			];

			let newShape = {};
			[drawFeature] = window.drawRef.getAll().features;
			if (drawFeature) {
				if (currentFeature) currentFeature.geometry = drawFeature.geometry;
				newShape = getDrawAdustedShape(currentFeature, quarters);
			}
			if (currentFeature) currentFeature.geometry = newShape.geometry;
		}
		if (isShapeResizeMode && shapeEditMode === 'resize') {
			[drawFeature] = window.drawRef.getAll().features;
			if (currentFeature) currentFeature.geometry = drawFeature.geometry;
		}
		const shapeJson = {
			...featureToEdit,
			geometry: currentFeature?.geometry,
			properties: {
				...featureToEdit.properties,
				shapeArea: calculateLandArea(currentFeature),
				shapeCenter: calculateShapeCenter(currentFeature?.geometry.coordinates),
			},
		};

		const user = globalStateController.getValue('user');

		const customLayerData = {
			shapeJson,
			shape: JSON.stringify(shapeJson),
			layer: featureToEdit.layer.id,
			user: user.mongoId,
		};
		addCustomShapeProperties(currentFeature, window.drawRef);
		updateCustomLayer({
			variables: {
				customLayerId: featureToEdit.id,
				customLayer: customLayerData,
			},
			refetchQueries: ['getCustomLayers'],
			awaitRefetchQueries: true,
		}).then(() => {
			if (isShapeResizeMode) {
				let newPath = '';
				if (featureToEdit?.layer?.id === 'parcel') newPath = `/map/parcels/${featureToEdit.id}`;
				else newPath = `/map/units/${featureToEdit.id}`;

				if (history.location.pathname !== newPath) history.replace(newPath);
			}
		});
		setTimeout(() => actionClose(dispatch, { rotateableFeature: drawFeature }), 0);
	};

	/* ---------------------- ShapeActionsPopup Actions End --------------------- */

	return {
		/* ------ DrawShapes Actions ------ */
		drawUpdateListener,
		drawCreateListener,
		drawSelectionChangeListener,
		actionClose,
		/* ------ DrawShapes Actions ------ */

		/* --- DrawShapesPopup Actions ---- */
		onActionClick,
		createMultiSelectedFeature,
		/* --- DrawShapesPopup Actions ---- */

		/* ----- ShapeAOIPopup Actions ---- */
		handleSaveAOIToShape,
		handleEditAOIToShape,
		/* ----- ShapeAOIPopup Actions ----- */

		/* --- ShapeActionsPopup Actions -- */
		isLine,
		updateSelectedLayerFeature,
		clearFilter,
		actionEdit,
		actionShowWellsAndOwners,
		actionFilter,
		actionAOI,
		saveAndOpenParcelDetail,
		saveAndOpenShapeDetail,
		updateAndOpenShapeDetail,
		confirmEditing,
		confirmShapeEditing,
		/* --- ShapeActionsPopup Actions -- */

		setShowDataCard: showDataCard => state.merge({ showDataCard }),
		setSelectedAction: selectedAction => state.merge({ selectedAction }),
	};
};

export const drawController = {
	...drawStateControllerHandler(drawState),
	...hookStateController(drawState, initialState),
};
