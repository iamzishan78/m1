/* eslint-disable no-use-before-define */
import union from '@turf/union';
import hat from 'hat';
import * as turf from '@turf/turf';

import { layerRefs } from 'hookstate';
import { showErrorMessage } from 'actions';
import { hookStateController } from 'hookstate/hookStateController';
import { setMapGridCardState, toggleMapGridCardAtived } from 'actions';
import { copy, getPolygonString } from 'components/Shared/functions';
import {
	addCustomShapeProperties,
	calculateShapeCenter,
	clearSelectedAbstracts,
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
import { jobController } from './jobStateController';
import DeckGlLayer from 'components/Map/DeckGL/helpers/DeckGlLayer';
import { layerController } from './layerStateController';
import { navController } from './navStateController';
import { drawInitialState, drawState } from './initialStates';
import { mapControlsController } from './mapControlsController';
import { removeSpaces } from 'components/MRTTable/utils/helper';
import { detailCardController } from './detailCardController';

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
			addShape: false,
			currentFeature: currentFeatureUpdate,
		});

		setTimeout(() => {
			if (currentFeatureUpdate && !reDrawShape) drawController.actionEdit();

			draw?.deleteAll();
			draw?.add(currentFeatureUpdate);
			addCustomShapeProperties(currentFeatureUpdate, draw);
			setFeatureProperty(draw, currentFeatureUpdate.id, 'shapeEdit', false);
			draw?.changeMode('simple_select');

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
				multiSelectLandGrids: false,
			});

		const drawFeatures = window.drawRef?.getAll();

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

		drawBoundary();
		clearSelectedAbstracts();

		drawController.updateState({
			currentFeature: null,
			selectedAoi: null,
			shapeEditMode: shapeEditMode === 'redraw' ? '' : showAddShapePopup,
			addShape: false,
			reDrawShape: false,
			showAddShapePopup: false,
			selectedPolygonString: '',
			showDataCard: false,
		});
		layerFiltersController.updateState({ polygonFilter: null });

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
			window.mapRef?.setFeatureState({ source: sourceId, id }, { click: false });
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
				addShape: false,
			});
		} else {
			drawController.updateState({
				lastSelectedDrawMode: shape.mode,
				addShape: false,
			});

			handleClose();
		}

		drawController.updateState({
			isDrawing: true,
			editDraw: true,
			multiSelectLandGrids: true,
		});

		if (shape.mode === 'draw_polygon') drawShapeLayerToggle('visible');

		window.drawRef?.changeMode(shape.mode);
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
		if (newFeature)
			DeckGlLayer.updateLayer(
				{
					data: newFeature,
					pickable: true,
					filled: true,
					getFillColor: [173, 216, 230, 150],
				},
				window.mapRef.getLayer('Land Grid_selection')?.implementation
			);

		if (!newFeature) newFeature = currentFeature;

		newFeature.id = featureId;
		newFeature.properties.id = featureId;

		if (shapeToExtend) {
			if (shapeEditMode !== 'redraw' && shapeToExtend.geometry?.type) newFeature = union(newFeature, shapeToExtend);
			shapeToExtend.geometry = newFeature.geometry;
			newFeature = shapeToExtend;
		}

		// adding new polygon into map instance
		window.drawRef?.add(newFeature);

		drawController.updateState({
			// selectedAbstracts: [],
			currentFeature: newFeature,
			shapeToExtend: null,
			multiSelectLandGrids: false,
			showShapeActionsPopup: true,
			reDrawShape: false,
			addShape: false,
		});

		addCustomShapeProperties(newFeature, window.drawRef);
	};

	/* ----------------------- DrawShapesPopup Actions End ---------------------- */

	/* -------------------------- ShapeAOIPopup Actions ------------------------- */

	const handleSaveAOIToShape = ({ dataName, upsertCustomLayer, updateCustomLayer }) => {
		const dataType = 'interest';
		const { currentFeature, selectedAoi } = drawController.getValues(['currentFeature', 'selectedAoi']);

		const spatialData = {
			sdType: dataType,
			shapeLabel: dataName || currentFeature?.properties.shapeLabel,
			projectName: '',
			sdGrossAcres: '',
		};

		addCustomShapeProperties(currentFeature, window.drawRef);

		spatialDataAttributes.forEach(attribute => {
			if (spatialData[attribute] != null || typeof spatialData[attribute] !== 'undefined') {
				if (currentFeature) currentFeature.properties[attribute] = spatialData[attribute];
			}
		});

		if (currentFeature) currentFeature.properties.id = currentFeature?.id;

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

			if (upsertCustomLayer)
				upsertCustomLayer({
					variables: { customLayer: customLayerData },
				}).then(() => {
					layerController.resetBounds('Area of Interest'); // reset bounds as AOI
				});
			else if (updateCustomLayer) {
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
		if (feature?.properties?.sdType === 'parcel') key = 'selectedParcel';
		else key = 'selectedShape';
		feature = { ...feature.properties, feature };

		findBoundsMap([feature], window.mapRef);
		drawBoundary(feature);
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

		navController.updateState({ drawingMode: null, filterDrawing: [] });

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

		const enableEditOnly = shapeTypeLayers.includes(
			featureToEdit?.properties?.layerType || featureToEdit?.properties?.sdType
		);

		const shapeEdit = _shapeEdit ?? shapeEditVal;
		// If shape doesn't exist! AOI case
		if (!window.drawRef?.get(currentFeature?.id) && currentFeature?.geometry?.type) {
			window.drawRef?.add(currentFeature);
		}

		// If filter is applied, then remove it
		clearFilter();

		if (!shapeEdit && currentFeature?.geometry?.type) {
			window.drawRef?.changeMode('direct_select', {
				featureId: selectedFeature.id,
			});
		} else {
			window.drawRef?.changeMode('static');
		}

		navController.updateState({ drawingMode: DRAWING_MODES.DRAW_CIRCLE });

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
			// crashing issues fixed moved code in try catch block
			if (selectedFeature?.id) {
				window.drawRef?.changeMode('direct_select', { featureId: selectedFeature.id });
				setFeatureProperty(window.drawRef, selectedFeature.id, 'shapeEdit', false);
				drawShapeLayerToggle('none');
				drawController.updateState({
					currentFeature: selectedFeature,
					shapeEdit: false,
				});
			}
		} catch (err) {}
	};

	const actionShowWellsAndOwners = dispatch => {
		if (isLine()) return;
		layerFiltersController.clearWellsFilters();
		const selectedFeature = drawController.getValue('currentFeature');

		drawController.updateState({
			selectedPolygonString: getPolygonString(selectedFeature),
		});

		dispatch(toggleMapGridCardAtived());
		mapControlsController.toggleMapGridCardAtived();

		closeDrawTool();
	};

	const applyFilter = () => {
		const selectedFeature = drawController.getValue('currentFeature');

		layerFiltersController.setPolygonFilter(selectedFeature?.geometry);

		// Changing shape to Blue
		window.drawRef?.changeMode('simple_select');

		navController.updateState({ drawingMode: null, filterDrawing: ['within', selectedFeature] });

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
			if (window.drawRef?.get(currentFeature?.id))
				window.drawRef?.changeMode('direct_select', {
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

	const getAbstractGeoSource = (abstractData, abstractShape) => {
		const abstractGeo = abstractData?.abstractGeo;
		if (!abstractGeo) return abstractShape;
		const featuresList = makeGeoJSONFromStrings(abstractGeo).features;
		if (!featuresList) return abstractShape;
		const foundFeatures = featuresList.filter(feature => {
			try {
				var intersection = turf.intersect(abstractShape, feature);
				return !!intersection;
			} catch (err) {
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
			updateSelectedLayerFeature(dispatch, result.data.upsertCustomLayer.customLayer);
			const layerId = result.data.upsertCustomLayer.customLayer._id;
			if (layerId) {
				const newPath = `/map/parcels/${layerId}`;
				if (history.location.pathname !== newPath) history.replace(newPath);
			}
			layerController.resetBounds(result?.data?.upsertCustomLayer?.customLayer?.layer);
		});
	};

	const saveAndOpenShapeDetail = (upsertCustomLayer, dispatch, history, abstractData, layerType, layerSubType) => {
		const user = globalStateController.getValue('user');
		const { currentFeature } = drawController.getValues(['currentFeature']);

		if (!user?._id) return;

		const abstractShape = getAbstractGeoSource(abstractData, currentFeature);
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
					shapeSubtitle = `${abstractShape?.properties?.County}, ${
						state || ''
					} - ${blockTownship}${section ? `, SEC ${section}` : ''}`;
				else shapeSubtitle = `${abstractShape?.properties?.County}, ${state || ''} - ${shapeName}`;
			}
			if (layerType === 'agreement') shapeSubtitle = `${abstractShape?.properties?.County}, ${state}`;
		}
		let properties = {};
		if (layerType === 'unit')
			properties = {
				uName: shapeName,
				uNumber: '',
				uType: '',
				uOperator: '',
				uStatus: '',
			};
		if (layerType === 'agreement') properties = { agreementName: shapeName, agreementType: layerSubType };
		if (globalStateController.getValue('testCase') === 'AgreementDraw') properties.agreementNumber = '1234';

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
			updateSelectedLayerFeature(dispatch, result.data.upsertCustomLayer.customLayer);
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
	};

	const updateAssetLayerFeature = (dispatch, assetShape) => {
		let feature = copy(assetShape.shapeJson);

		feature.id = assetShape._id;
		feature.properties.id = assetShape._id;
		feature.layer = { id: assetShape.layer };
		const key = 'selectedShape';
		feature = { ...feature.properties, ...feature };

		findBoundsMap([feature], window.mapRef);
		drawBoundary(feature);
		actionClose(dispatch);
		popupController.updateState({
			[key]: feature,
			expandedCard: true,
			popupOpen: false,
		});
	};

	const saveAndOpenMapAssetShapeDetail = (addRecordInRunTimeModel, dispatch, history, abstractData, currentAsset) => {
		const user = globalStateController.getValue('user');
		const { currentFeature } = drawController.getValues(['currentFeature']);

		if (!user?._id) return;

		const abstractShape = getAbstractGeoSource(abstractData, currentFeature);
		let shapeSubtitle = '';
		const shapeName = getParcelAndShapeName(abstractShape);
		const state = abstractShape?.properties?.State || abstractShape?.properties?.StateAbbreviation;

		if (abstractShape?.properties?.County && state) {
			shapeSubtitle = `${abstractShape?.properties?.County}, ${state}`;
		}

		let properties = {
			shapeName,
			assetName: currentAsset?.tableName,
		};

		const featureId = hat();
		const layer = removeSpaces(currentAsset?.tableName);

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
		};

		const mapAssetShapeData = {
			assetShape: {
				shapeJson: newShapeFeature,
				isGenericAssetShape: true,
				shape: JSON.stringify(newShapeFeature),
				layer,
				shapeName,
				assetName: currentAsset?.tableName,
				user: user._id,
			},
		};

		addRecordInRunTimeModel({
			variables: { tableName: currentAsset?.tableName, record: mapAssetShapeData },
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

			updateAssetLayerFeature(dispatch, { ...asset.assetShape, _id: assetId });
			layerController.resetBounds(asset.assetShape?.layer);
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
			if (history.location.pathname !== newPath) history.replace(newPath);
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

		actionClose(dispatch);
		updateSelectedLayerFeature(dispatch, layerData);
	};

	const confirmShapeEditing = (updateCustomLayer, dispatch, history) => {
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
			[drawFeature] = window.drawRef?.getAll().features;
			if (drawFeature) {
				if (currentFeature) currentFeature.geometry = drawFeature.geometry;
				newShape = getDrawAdustedShape(currentFeature, quarters);
			}
			if (currentFeature) currentFeature.geometry = newShape.geometry;
		}
		if (isShapeResizeMode && shapeEditMode === 'resize') {
			[drawFeature] = window.drawRef?.getAll().features;
			if (currentFeature) currentFeature.geometry = drawFeature.geometry;
		}
		const shapeJson = {
			...featureToEdit,
			geometry: currentFeature?.geometry,
			properties: {
				...featureToEdit.properties,
				shapeArea: calculateLandArea(currentFeature),
				shapeCenter: calculateShapeCenter(currentFeature?.geometry),
			},
		};

		const user = globalStateController.getValue('user');

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
		confirmShapeEditing,
		applyFilter,
		saveAndOpenMapAssetShapeDetail,
		/* --- ShapeActionsPopup Actions -- */

		setShowDataCard: showDataCard => state.merge({ showDataCard }),
		setSelectedAction: selectedAction => state.merge({ selectedAction }),
	};
};

export const drawController = {
	...drawStateControllerHandler(drawState),
	...hookStateController(drawState, drawInitialState),
};
