import * as turf from '@turf/turf';
import union from '@turf/union';
import hat from 'hat';

import { makeGeoJSONFromStrings } from 'components/Map/DeckGL/helpers/common';
import DeckGlLayer from 'components/Map/DeckGL/helpers/DeckGlLayer';
import {
	clearMapAndCloseShapeActionsPopup,
	drawShapeLayerToggle,
	findBoundsMap,
	setFeatureProperty,
} from 'components/MapControls/commonHelper';
import { spatialDataAttributes } from 'components/MapControls/components/DrawShapes/constants';
import {
	addCustomShapeProperties,
	calculateShapeCenter,
	clearSelectedAbstracts,
	drawBoundary,
	getDrawAdustedShape,
} from 'components/MapControls/components/DrawShapes/drawShapesHelpers';
import { DRAWING_MODES } from 'components/Navigation/NavigationContext';
import { copy, getPolygonString } from 'components/Shared/functions';
import { calculateLandArea, shapeTypeLayers } from 'components/Shared/functions/shapeLayer';

import { showErrorMessage } from 'actions';

import { detailCardController } from './detailCardController';
import { globalStateController } from './globalStateController';
import { jobController } from './jobStateController';
import { layerFiltersController } from './layerFiltersController';
import { layerController } from './layerStateController';
import { mapControlsController } from './mapControlsController';
import { navController } from './navStateController';
import { popupController } from './popupStateController';
import { StateController } from './stateController';

export const drawInitialState = {
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
	selectedAction: '',
	addShape: false,
};

class DrawStateControllerHandler extends StateController {
	constructor(initialState) {
		super(initialState, DrawStateControllerHandler.name);
		this.autoBind(this);
	}
	/* --------------------------- DrawShapes Actions --------------------------- */

	drawUpdateListener({ features, action }) {
		if (action === 'move' || action === 'change_coordinates') {
			const [feature] = features;

			// Don't run when shape is in rotate state
			if (feature?.properties?.isrotate) {
				return;
			}

			if (feature) {
				addCustomShapeProperties(feature, window.drawRef);
			}

			this.updateState({
				editDraw: true,
				currentFeature: feature,
				featureOrMapShape: feature,
			});

			// Assuming popupController is another instance of StateController
			popupController.updateState({ popupOpen: false });
		}
	}

	drawCreateListener({ features }) {
		const [feature] = features;
		const draw = window.drawRef;

		const { currentFeature, lastSelectedDrawMode, reDrawShape } = this.getValues([
			'currentFeature',
			'lastSelectedDrawMode',
			'reDrawShape',
		]);

		if (feature) {
			addCustomShapeProperties(feature, draw);
		}

		setFeatureProperty(draw, feature.id, 'shapeEdit', false);

		drawShapeLayerToggle(lastSelectedDrawMode === 'draw_polygon' ? 'visible' : 'none');

		if ((reDrawShape || drawController.isPoint()) && currentFeature) {
			currentFeature.geometry = feature.geometry;
		} else if (currentFeature && !reDrawShape) {
			const newFeature = union(feature, currentFeature);
			currentFeature.geometry = newFeature.geometry;
		}

		const currentFeatureUpdate = currentFeature || feature;

		this.updateState({
			editDraw: false,
			reDrawShape: false,
			showShapeActionsPopup: true,
			addShape: false,
			currentFeature: currentFeatureUpdate,
		});

		setTimeout(() => {
			if (currentFeatureUpdate && !reDrawShape) {
				this.actionEdit();
			}

			draw?.deleteAll();
			draw?.add(currentFeatureUpdate);
			addCustomShapeProperties(currentFeatureUpdate, draw);
			setFeatureProperty(draw, currentFeatureUpdate.id, 'shapeEdit', false);
			draw?.changeMode('simple_select');

			this.updateState({
				editDraw: false,
				currentFeature: currentFeatureUpdate,
			});
		}, 10);
	}

	drawSelectionChangeListener({ features }) {
		const [feature] = features;

		// Don't run when shape is in rotate state
		if (feature?.properties?.isrotate) {
			return;
		}

		const { shapeEdit, lastSelectedDrawMode } = this.getValues(['shapeEdit', 'lastSelectedDrawMode']);

		if (feature && !feature.id.includes('edit_polygon')) {
			this.updateState({
				editDraw: false,
				currentFeature: feature,
				featureOrMapShape: feature,
				multiSelectLandGrids: false,
			});
		}

		const drawFeatures = window.drawRef?.getAll();

		drawShapeLayerToggle(
			shapeEdit ||
				!drawFeatures.features ||
				drawFeatures.features.length === 0 ||
				lastSelectedDrawMode === 'draw_polygon'
				? 'visible'
				: 'none'
		);
	}

	actionClose(dispatch, additionalProps = {}) {
		const { shapeEditMode, showAddShapePopup } = this.getValues(['shapeEditMode', 'showAddShapePopup']);

		clearMapAndCloseShapeActionsPopup();

		drawBoundary();
		clearSelectedAbstracts();

		this.updateState({
			currentFeature: null,
			selectedAoi: null,
			shapeEditMode: shapeEditMode === 'redraw' ? '' : showAddShapePopup,
			addShape: false,
			reDrawShape: false,
			showAddShapePopup: false,
			selectedPolygonString: '',
			showDataCard: false,
			isEditingShape: false,
		});
		layerFiltersController.updateState({ polygonFilter: null });

		window.setStateApp(state => ({
			...state,
			shapeGridWellsCount: 0,
			shapeGridOwnersCount: 0,
			...additionalProps,
		}));
	}

	/* ------------------------- DrawShapes Actions End ------------------------- */

	/* ------------------------- DrawShapesPopup Actions ------------------------ */

	handleCloseAbstractSelection() {
		const selectedAbstracts = this.getValue('selectedAbstracts');

		const popUps = document.getElementsByClassName('mapboxgl-popup');
		if (popUps[0]) {
			popUps[0].remove();
		}

		this.updateState({
			selectedAbstracts: [],
		});

		const sourceId = globalStateController.getValue('abstract_geo')?.sourceId;

		if (!sourceId) {
			return;
		}

		for (let i = 0; i < selectedAbstracts.length; i++) {
			const id = selectedAbstracts[i].properties.Id;
			window.mapRef?.setFeatureState({ source: sourceId, id }, { click: false });
		}
	}

	onActionClick(handleClose, shape) {
		if (shape.disable) {
			return;
		}

		const { multiSelectLandGrids, currentFeature } = this.getValues(['multiSelectLandGrids', 'currentFeature']);

		if (shape.title === 'Multiple Select') {
			if (multiSelectLandGrids) {
				// Removing all selected land grids
				this.handleCloseAbstractSelection();
			}

			// Enabling/disabling multi-select land grid
			this.updateState({
				lastSelectedDrawMode: shape.mode,
				shapeToExtend: currentFeature,
				addShape: false,
			});
		} else {
			this.updateState({
				lastSelectedDrawMode: shape.mode,
				addShape: false,
			});

			handleClose();
		}

		this.updateState({
			isDrawing: true,
			editDraw: true,
			multiSelectLandGrids: true,
		});

		if (shape.mode === 'draw_polygon') {
			drawShapeLayerToggle('visible');
		}

		window.drawRef?.changeMode(shape.mode);
	}

	createMultiSelectedFeature() {
		let newFeature;
		const featureId = hat();

		const { selectedAbstracts, shapeToExtend, shapeEditMode, currentFeature } = this.getValues([
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

		if (newFeature) {
			DeckGlLayer.updateLayer(
				{
					data: newFeature,
					pickable: true,
					filled: true,
					getFillColor: [173, 216, 230, 150],
				},
				'Land Grid_selection'
			);
		}

		if (!newFeature) {
			newFeature = currentFeature;
		}

		newFeature.id = featureId;
		newFeature.properties.id = featureId;

		if (shapeToExtend) {
			if (shapeEditMode !== 'redraw' && shapeToExtend.geometry?.type) {
				newFeature = union(newFeature, shapeToExtend);
			}
			shapeToExtend.geometry = newFeature.geometry;
			newFeature = shapeToExtend;
		}

		// Adding new polygon into map instance
		window.drawRef?.add(newFeature);

		this.updateState({
			currentFeature: newFeature,
			shapeToExtend: null,
			multiSelectLandGrids: false,
			showShapeActionsPopup: true,
			reDrawShape: false,
			addShape: false,
		});

		addCustomShapeProperties(newFeature, window.drawRef);
	}

	/* ----------------------- DrawShapesPopup Actions End ---------------------- */

	/* -------------------------- ShapeAOIPopup Actions ------------------------- */

	handleSaveAOIToShape({ dataName, upsertCustomLayer, updateCustomLayer }) {
		const dataType = 'interest';
		const { currentFeature, selectedAoi } = this.getValues(['currentFeature', 'selectedAoi']);

		const spatialData = {
			sdType: dataType,
			shapeLabel: dataName || currentFeature?.properties.shapeLabel,
			projectName: '',
			sdGrossAcres: '',
		};

		addCustomShapeProperties(currentFeature, window.drawRef);

		spatialDataAttributes.forEach(attribute => {
			if (spatialData[attribute] != null || typeof spatialData[attribute] !== 'undefined') {
				if (currentFeature) {
					currentFeature.properties[attribute] = spatialData[attribute];
				}
			}
		});

		if (currentFeature) {
			currentFeature.properties.id = currentFeature?.id;
		}

		drawBoundary(currentFeature);

		const user = globalStateController.getValue('user');

		if (user && user.mongoId !== '') {
			const customLayerData = {
				shapeJson: currentFeature,
				shape: JSON.stringify(currentFeature),
				layer: dataType,
				name: spatialData.shapeLabel,
				user: user.mongoId,
			};

			if (upsertCustomLayer) {
				upsertCustomLayer({
					variables: { customLayer: customLayerData },
				}).then(() => {
					layerController.resetBounds('Area of Interest'); // reset bounds as AOI
				});
			} else if (updateCustomLayer) {
				updateCustomLayer({
					variables: {
						customLayerId: selectedAoi?.id || selectedAoi?._id,
						customLayer: customLayerData,
					},
				}).then(() => {
					layerController.resetBounds('Area of Interest'); // reset bounds as AOI
				});
			}
		}

		this.updateState({ showDataCard: true });
	}

	/* ------------------------ ShapeAOIPopup Actions End ----------------------- */

	/* ------------------------ ShapeActionsPopup Actions ----------------------- */

	isLine() {
		return ['LineString', 'MultiLineString'].includes(drawController.getValue('currentFeature')?.geometry?.type);
	}
	isPoint() {
		return ['Point', 'MultiPoint'].includes(drawController.getValue('currentFeature')?.geometry?.type);
	}
	isPolygon() {
		return ['Polygon', 'MultiPolygon'].includes(drawController.getValue('currentFeature')?.geometry?.type);
	}

	updateSelectedLayerFeature(dispatch, customLayer) {
		let feature = copy(customLayer.shapeJson);
		feature.id = customLayer._id;
		feature.properties.id = customLayer._id;
		feature.layer = { id: customLayer.layer };

		feature = { ...feature.properties, feature };

		findBoundsMap([feature], window.mapRef);
		drawBoundary(feature);
		this.actionClose(dispatch);
		popupController.updateState({
			selectedShape: feature,
			expandedCard: true,
			popupOpen: false,
		});
	}

	clearFilter() {
		layerFiltersController.updateState({
			polygonFilter: null,
		});

		navController.updateState({ drawingMode: null, filterDrawing: [] });

		this.updateState({
			shapeActionsFilterSelected: false,
		});
	}

	actionEdit(_shapeEdit) {
		const {
			shapeEdit: shapeEditVal,
			selectedAoi,
			featureToEdit,
			currentFeature,
		} = this.getValues(['shapeEdit', 'selectedAoi', 'featureToEdit', 'currentFeature']);
		const selectedFeature = this.getValue('currentFeature');

		const enableEditOnly = shapeTypeLayers.includes(
			featureToEdit?.properties?.layerType || featureToEdit?.properties?.sdType
		);

		const shapeEdit = _shapeEdit ?? shapeEditVal;
		// If shape doesn't exist! AOI case
		if (!window.drawRef?.get(currentFeature?.id) && currentFeature?.geometry?.type) {
			window.drawRef?.add(currentFeature);
		}

		// If filter is applied, then remove it
		this.clearFilter();

		if (!shapeEdit && currentFeature?.geometry?.type !== 'Point') {
			window.drawRef?.changeMode('direct_select', {
				featureId: selectedFeature.id,
			});
		} else if (currentFeature?.geometry?.type === 'Point') {
			// Set point mode for point shape
			window.drawRef.changeMode('draw_point');
		} else {
			window.drawRef?.changeMode('static');
		}

		navController.updateState({ drawingMode: DRAWING_MODES.DRAW_CIRCLE });

		setFeatureProperty(window.drawRef, selectedFeature.id, 'shapeEdit', !shapeEdit);
		drawShapeLayerToggle(!shapeEdit ? 'visible' : 'none');

		this.updateState({
			currentFeature: selectedFeature,
			shapeEdit: !shapeEdit,
		});
		if (selectedAoi) {
			this.setSelectedAction('edit-aoi');
		} else if (enableEditOnly) {
			this.setSelectedAction('edit-shape');
		}
	}

	closeDrawTool() {
		const selectedFeature = this.getValue('currentFeature');
		// crashing issues fixed moved code in try-catch block
		if (selectedFeature?.id) {
			window.drawRef?.changeMode('direct_select', { featureId: selectedFeature.id });
			setFeatureProperty(window.drawRef, selectedFeature.id, 'shapeEdit', false);
			drawShapeLayerToggle('none');
			this.updateState({
				currentFeature: selectedFeature,
				shapeEdit: false,
			});
		}
	}

	actionShowWellsAndOwners() {
		if (this.isLine()) {
			return;
		}
		layerFiltersController.clearWellsFilters();
		const selectedFeature = this.getValue('currentFeature');

		this.updateState({
			selectedPolygonString: getPolygonString(selectedFeature),
		});

		mapControlsController.toggleMapGridCardAtived();

		this.closeDrawTool();
	}

	applyFilter() {
		const selectedFeature = this.getValue('currentFeature');

		layerFiltersController.setPolygonFilter(selectedFeature?.geometry);

		// Changing shape to Blue
		window.drawRef?.changeMode('simple_select');

		navController.updateState({ drawingMode: null, filterDrawing: ['within', selectedFeature] });

		this.updateState({
			shapeActionsFilterSelected: true,
		});

		this.closeDrawTool();
	}

	actionFilter() {
		if (this.isLine()) {
			return;
		}

		const { shapeActionsFilterSelected, currentFeature } = this.getValues([
			'shapeActionsFilterSelected',
			'currentFeature',
		]);

		if (shapeActionsFilterSelected) {
			this.clearFilter();

			// Changing back to original shape
			if (window.drawRef?.get(currentFeature?.id)) {
				window.drawRef?.changeMode('direct_select', {
					featureId: currentFeature?.id,
				});
			}
		} else {
			this.applyFilter();
		}
		this.setSelectedAction('filter');
	}

	actionAOI() {
		if (this.isLine()) {
			return;
		}

		const selectedFeature = this.getValue('currentFeature');

		selectedFeature.properties.sdType = 'interest';

		this.setShowDataCard(!this.getValue('showDataCard'));
	}

	getAbstractGeoSource(abstractData, abstractShape) {
		const abstractGeo = abstractData?.abstractGeo;
		if (!abstractGeo) {
			return abstractShape;
		}
		const featuresList = makeGeoJSONFromStrings(abstractGeo).features;
		if (!featuresList) {
			return abstractShape;
		}
		const foundFeatures = featuresList.filter(feature => {
			try {
				var intersection = turf.intersect(abstractShape, feature);
				return !!intersection;
			} catch {
				return false;
			}
		});
		if (!abstractShape.properties.State && !abstractShape.properties.StateAbbreviation) {
			const result = foundFeatures.reduce(
				(result, currentFeature) => {
					const intersection = turf.intersect(abstractShape, currentFeature);
					const area = turf.area(intersection);
					return area > result.area ? { area, feature: currentFeature } : result;
				},
				{ area: 0, feature: null }
			);
			if (result?.feature?.properties) {
				abstractShape.properties = result.feature.properties;
			}
		}
		return abstractShape;
	}

	getParcelAndShapeName(abstractShape) {
		const properties = abstractShape?.properties;
		const township = properties?.Township;
		const range = properties?.Range;
		const section = properties?.ShortName;
		let parcelName;
		if (abstractShape?.properties?.State === 'TX') {
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
	}

	saveAndOpenParcelDetail(upsertCustomLayer, dispatch, history, abstractData) {
		const user = globalStateController.getValue('user');
		const { currentFeature } = this.getValues(['currentFeature']);

		if (!user?._id) {
			return;
		}

		const abstractShape = this.getAbstractGeoSource(abstractData, currentFeature);
		abstractShape.properties.State = abstractShape?.properties?.State || abstractShape?.properties?.StateAbbreviation;
		abstractShape.properties.Section = abstractShape?.properties?.Section || abstractShape?.properties?.ShortName;
		abstractShape.properties.Meridian =
			abstractShape?.properties?.Meridian || abstractShape?.properties?.PrincipalMeridian;
		const parcelName = this.getParcelAndShapeName(abstractShape);
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
				shapeCenter: calculateShapeCenter(abstractShape.geometry),
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
			if (!result?.data?.upsertCustomLayer?.success) {
				dispatch(showErrorMessage(result?.data?.upsertCustomLayer?.message));
				return;
			}
			jobController.toggleBulkUpload();
			this.updateSelectedLayerFeature(dispatch, result.data.upsertCustomLayer.customLayer);
			const layerId = result.data.upsertCustomLayer.customLayer._id;
			if (layerId) {
				const newPath = `/map/parcels/${layerId}`;
				if (history.location.pathname !== newPath) {
					history.replace(newPath);
				}
			}
			layerController.resetBounds(result?.data?.upsertCustomLayer?.customLayer?.layer);
		});
	}

	saveAndOpenShapeDetail(upsertCustomLayer, dispatch, history, abstractData, layerType, layerSubType) {
		const user = globalStateController.getValue('user');
		const { currentFeature } = this.getValues(['currentFeature']);

		if (!user?._id) {
			return;
		}

		const abstractShape = this.getAbstractGeoSource(abstractData, currentFeature);
		let shapeSubtitle = '';
		const shapeName = this.getParcelAndShapeName(abstractShape);
		const state = abstractShape?.properties?.State || abstractShape?.properties?.StateAbbreviation;
		const section = abstractShape?.properties?.Section || abstractShape?.properties?.ShortName;
		let blockTownship = `BLK ${abstractShape?.properties?.Block || ''}`;
		if (!abstractShape?.properties?.Block && (abstractShape?.properties?.Township || '')) {
			blockTownship = `TOWN ${abstractShape?.properties?.Township || ''}`;
		}
		if (abstractShape?.properties?.County && state) {
			if (layerType === 'unit') {
				if (abstractShape.properties.State === 'TX') {
					shapeSubtitle = `${abstractShape?.properties?.County}, ${
						state || ''
					} - ${blockTownship}${section ? `, SEC ${section}` : ''}`;
				} else {
					shapeSubtitle = `${abstractShape?.properties?.County}, ${state || ''} - ${shapeName}`;
				}
			}
			if (layerType === 'agreement') {
				shapeSubtitle = `${abstractShape?.properties?.County}, ${state}`;
			}
		}
		let properties = {};
		if (layerType === 'unit') {
			properties = {
				uName: shapeName,
				uNumber: '',
				uType: '',
				uOperator: '',
				uStatus: '',
			};
		}
		if (layerType === 'agreement') {
			properties = { agreementName: shapeName, agreementType: layerSubType };
		}
		if (globalStateController.getValue('testCase') === 'AgreementDraw') {
			properties.agreementNumber = '1234';
		}

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
				shapeCenter: calculateShapeCenter(abstractShape.geometry),
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
			variables: { customLayer: customLayerData, userId: globalStateController.getValue('user').mongoId },
		}).then(result => {
			if (!result?.data?.upsertCustomLayer?.success) {
				dispatch(showErrorMessage(result?.data?.upsertCustomLayer?.message));
				return;
			}
			jobController.toggleBulkUpload();
			this.updateSelectedLayerFeature(dispatch, result.data.upsertCustomLayer.customLayer);
			const layerId = result.data.upsertCustomLayer.customLayer._id;
			const type =
				result.data.upsertCustomLayer.customLayer?.shapeJson?.properties?.agreementType ||
				result.data.upsertCustomLayer.customLayer?.shapeJson?.properties?.type;
			if (layerId && type) {
				let newPath = `/map/${type}s/${layerId}`;
				history.location.pathname !== newPath && history.replace(newPath);
			}
			layerController.resetBounds(result?.data?.upsertCustomLayer?.customLayer?.layer);
		});
	}

	updateAssetLayerFeature(dispatch, assetShape) {
		let feature = copy(assetShape.shapeJson);

		feature.id = assetShape._id;
		feature.properties.id = assetShape._id;
		feature = { ...feature.properties, ...feature, feature };

		this.actionClose(dispatch);
		findBoundsMap([feature], window.mapRef);
		drawBoundary(feature);
		popupController.updateState({
			selectedShape: feature,
			expandedCard: true,
			popupOpen: false,
		});
		layerController.resetBounds(feature?.properties?.assetName); // reset bounds as AOI
	}

	saveAndOpenMapAssetShapeDetail({
		addRecordInRunTimeModel,
		dispatch,
		history,
		abstractData,
		currentAsset,
		customAssetData,
	}) {
		const user = globalStateController.getValue('user');
		const { currentFeature } = this.getValues(['currentFeature']);

		if (!user?._id) {
			return;
		}

		const abstractShape = this.getAbstractGeoSource(abstractData, currentFeature);
		let shapeSubtitle = '';
		const shapeName = this.getParcelAndShapeName(abstractShape);
		const state = abstractShape?.properties?.State || abstractShape?.properties?.StateAbbreviation;

		if (abstractShape?.properties?.County && state) {
			shapeSubtitle = `${abstractShape?.properties?.County}, ${state}`;
		}

		let properties = {
			shapeName,
			assetName: currentAsset?.name,
		};

		const featureId = hat();
		const layer = currentAsset?.tableName;

		const layers = globalStateController.getValue('layers');
		const featureLayer = layers?.find(l => {
			return l.layerSettings?.showable && l.layerSettings?.visiable && l.identifier.startsWith(currentAsset?.name);
		});

		const newShapeFeature = {
			id: featureId,
			type: 'Feature',
			geometry: abstractShape.geometry,
			properties: {
				isGenericAssetShape: true,
				originalProperties: abstractShape.properties,
				shapeSubtitle,
				shapeLabel: shapeName,
				type: layer,
				...properties,
				shapeArea: calculateLandArea(abstractShape),
				shapeCenter: calculateShapeCenter(abstractShape.geometry),
				id: featureId,
			},
			layer: { id: featureLayer?.identifier, type: 'custom' },
			identifier: featureLayer?.identifier,
		};

		const mapAssetShapeData = {
			assetShape: {
				shapeJson: newShapeFeature,
				isGenericAssetShape: true,
				shape: JSON.stringify(newShapeFeature),
				layer,
				shapeName,
				assetName: currentAsset?.name,
				user: user._id,
			},
		};

		addRecordInRunTimeModel({
			variables: { tableName: currentAsset?.tableName, record: { ...mapAssetShapeData, ...customAssetData } },
		}).then(result => {
			if (!result?.data?.addRecordInRunTimeModel?.success) {
				dispatch(showErrorMessage(result?.data?.addRecordInRunTimeModel?.message));
				return;
			}
			jobController.toggleBulkUpload();

			const asset = result?.data?.addRecordInRunTimeModel?.asset;
			detailCardController.updateState({ currentAssetRecord: asset });

			const assetId = asset._id;
			const type = asset?.assetShape?.shapeJson?.properties?.type;

			if (assetId && type) {
				let newPath = `/map/${type}/${assetId}`;
				history.location.pathname !== newPath && history.replace(newPath);
			}

			this.updateAssetLayerFeature(dispatch, { ...asset.assetShape, _id: assetId });
			layerController.resetBounds(asset.assetShape?.layer);
		});
	}

	updateAndOpenShapeDetail(updateCustomLayer, dispatch, history, abstractData, layerData) {
		const { currentFeature } = this.getValues(['currentFeature']);

		const abstractShape = this.getAbstractGeoSource(abstractData, currentFeature);
		layerData.shapeJson.geometry = abstractShape?.geometry;
		layerData.shapeJson.properties = {
			...layerData.shapeJson.properties,
			originalProperties: abstractShape?.properties,
			shapeArea: calculateLandArea(abstractShape),
			shapeCenter: calculateShapeCenter(abstractShape?.geometry),
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
			jobController.toggleBulkUpload();
			const newPath = `/map/${layerData.layer}s/${layerData._id}`;
			if (history.location.pathname !== newPath) {
				history.replace(newPath);
			}
			layerController.resetBounds(
				customLayerData?.shapeJson?.identifier || customLayerData?.shapeJson?.layer?.id || customLayerData?.layer
			);
		});
		const jsonLayer = copy(customLayerData.shapeJson);
		jsonLayer.layer = { id: customLayerData.layer };
		jsonLayer.id = layerData._id;

		findBoundsMap([jsonLayer], window.mapRef);
		drawBoundary(jsonLayer);
		popupController.updateState({
			selectedShape: {
				...jsonLayer.properties,
				feature: jsonLayer,
				id: layerData._id,
			},
		});

		this.actionClose(dispatch);
		this.updateSelectedLayerFeature(dispatch, layerData);
	}

	confirmShapeEditing({
		updateCustomLayer,
		dispatch,
		history,
		updateRecordInRunTimeModel,
		currentAssetRecord,
		currentAsset,
		isEditCustomAsset,
	}) {
		const { featureToEdit, shapeEditMode, currentFeature } = drawController.getValues([
			'featureToEdit',
			'shapeEditMode',
			'currentFeature',
		]);

		const isShapeResizeMode = shapeTypeLayers.includes(
			featureToEdit?.properties?.layerType ||
				featureToEdit?.properties?.sdType ||
				featureToEdit?.properties?.layerSubType
		);

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
			if (window.drawRef) {
				[drawFeature] = window.drawRef.getAll().features;
			}
			if (drawFeature) {
				if (currentFeature) {
					currentFeature.geometry = drawFeature.geometry;
				}
				newShape = getDrawAdustedShape(currentFeature, quarters);
			}
			if (currentFeature) {
				currentFeature.geometry = newShape.geometry;
			}
		}
		if (isShapeResizeMode && shapeEditMode === 'resize') {
			if (window.drawRef) {
				[drawFeature] = window.drawRef.getAll().features;
			}
			if (currentFeature) {
				currentFeature.geometry = drawFeature.geometry;
			}
		}

		const user = globalStateController.getValue('user');

		if (!isEditCustomAsset) {
			const shapeJson = {
				...featureToEdit,
				geometry: currentFeature?.geometry,
				properties: {
					...featureToEdit.properties,
					shapeArea: calculateLandArea(currentFeature),
					shapeCenter: calculateShapeCenter(currentFeature?.geometry),
				},
			};

			const customLayerData = {
				shapeJson,
				shape: JSON.stringify(shapeJson),
				// layer: featureToEdit.layer.id,
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
				jobController.toggleBulkUpload();
				if (isShapeResizeMode) {
					let newPath = '';

					const type = featureToEdit?.properties?.agreementType || featureToEdit?.properties?.type;

					if (type) {
						newPath = `/map/${type}s/${featureToEdit?.id}`;
						history.location.pathname !== newPath && history.replace(newPath);
					}
					layerController.resetBounds(customLayerData?.shapeJson?.identifier || customLayerData?.shapeJson?.layer?.id);
				}
			});
		} else if (isEditCustomAsset && currentAssetRecord?.assetShape?.isGenericAssetShape) {
			const currentShape = currentAssetRecord?.assetShape?.shapeJson;
			const shapeJson = {
				...currentShape,
				geometry: { ...currentShape?.geometry, ...currentFeature?.geometry },
				properties: {
					...currentShape?.properties,
					...featureToEdit.properties,
					shapeArea: calculateLandArea(currentFeature),
					shapeCenter: calculateShapeCenter(currentFeature?.geometry),
				},
				identifier: featureToEdit?.identifier,
				layer: featureToEdit?.layer,
			};

			const assetShape = {
				...currentAssetRecord?.assetShape,
				shapeJson,
				shape: JSON.stringify(shapeJson),
				user: user.mongoId,
			};

			updateRecordInRunTimeModel({
				variables: {
					tableName: currentAsset?.tableName,
					ids: [currentAssetRecord?._id],
					record: { assetShape },
				},
				refetchQueries: ['getRecordFromRunTimeModel', 'getCustomAssetInfo', 'getDbData'],
				awaitRefetchQueries: true,
			}).then(result => {
				if (!result?.data?.updateRecordInRunTimeModel?.success) {
					dispatch(showErrorMessage(result?.data?.updateRecordInRunTimeModel?.message));
					return;
				}
				layerController.resetBounds(assetShape?.shapeJson?.identifier || assetShape?.shapeJson?.layer?.id, true);
			});
		}

		setTimeout(() => actionClose(dispatch, { rotateableFeature: drawFeature }), 0);
	}

	setShowDataCard(showDataCard) {
		this.updateState({ showDataCard });
	}

	setSelectedAction(selectedAction) {
		this.updateState({ selectedAction });
	}

	/* ---------------------- ShapeActionsPopup Actions End --------------------- */
}

export const drawController = new DrawStateControllerHandler(drawInitialState);
