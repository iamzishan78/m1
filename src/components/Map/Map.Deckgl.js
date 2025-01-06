/* eslint-disable import/order */
import _ from 'lodash';
import React, { useContext, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery, useApolloClient, useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import MapIcon from '@material-ui/icons/Map';
import mapboxgl from 'mapbox-gl';
import { CircleMode, DragCircleMode, DirectMode, SimpleSelectMode } from 'mapbox-gl-draw-circle';
import DrawRectangle from 'mapbox-gl-draw-rectangle-mode';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import StaticMode from '@mapbox/mapbox-gl-draw-static-mode';
import * as turf from '@turf/turf';
import gjv from 'geojson-validation';
import parseLinkHeader from 'parse-link-header';

// Internal imports
import MapControls from 'components/MapControls/MapControls';
import SpeedDialComponent from 'components/MapControls/SpeedDialComponent';
import { drawShapeStyles, findBoundsMap } from 'components/MapControls/commonHelper';
import { layersWithSelectedShapeKey } from 'components/Shared/functions/shapeLayer';
import { getFormattedFilterBasedOnType } from 'components/Shared/SidePanel/compoennts/Filters/UserMapFilter';
import { viewStateController } from 'components/MRTTable/Common/GridView/ViewController';

// Hookstate imports
import { drawController } from 'hookstate/drawStateController';
import { globalStateController } from 'hookstate/globalStateController';
import { layerController } from 'hookstate/layerStateController';
import { layerFiltersController } from 'hookstate/layerFiltersController';
import { layerRefs } from 'hookstate';
import { mapControlsController } from 'hookstate/mapControlsController';
import { mapStateController } from 'hookstate/mapStateController';
import { navController } from 'hookstate/navStateController';
import { popupController } from 'hookstate/popupStateController';

// Parent imports
import { baseTenantsMaps } from 'utils/data';
import { convertToTitleCase } from 'utils/helper';

// Sibling imports
import { copy } from '../Shared/functions';
import HugeRequest from './components/HugeRequest';
import DeckGL from './DeckGL';
import onRightClick from './DeckGL/helpers/onRightClick';
import DefaultFiltersTest from './filtersDefaultTest';
import { setMainMapState } from '../../actions';
import { SRMode } from './MapBoxDrawRotate/index';
import { AppContext } from '../../AppContext';
import ZoomFault from './components/ZoomFault';
import { extractUniqueFilters, getClickedFeature } from './DeckGL/helpers/common';
import DeckGlLayer from './DeckGL/helpers/DeckGlLayer';
import onFeatureClick from './DeckGL/helpers/onFeatureClick';
import udLayerClickHandler from './DeckGL/helpers/udLayerClickHandler';
import MarkerIcon from './sprites/marker-icon.png';
import {
	drawBoundary,
	drawPlaceBoundary,
	drawWellBoundary,
} from '../MapControls/components/DrawShapes/drawShapesHelpers';
import MapGridCardProvider from '../MapGridCard/MapGridProvider';

// GraphQL imports
import { GET_DB_DATA } from 'graphQL/useQueryDbQuery';
import { LAYERSETTINGSBYUSER } from 'graphQL/useQueryLayerSettingsByUser';
import { GET_GRID_VIEWS } from 'graphQL/useQueryGetGridViews';
import { ALLLAYERSETTINGSBYUSER } from 'graphQL/useQueryAllLayerSettingsByUser';
import { CUSTOMLAYER } from 'graphQL/useQueryCustomLayer';

// Constants
const LATITUDE_UPPER_BOUND = 90;
const LATITUDE_LOWER_BOUND = -90;
const LONGITUDE_UPPER_BOUND = 180;
const LONGITUDE_LOWER_BOUND = -180;
const LATITUDE_PRECISION = 0.005;
const LONGITUDE_PRECISION = 0.005;
const HIGHER_PRECISION = 0.08;
const LATITUDE_MAX_THRESHOLD = LATITUDE_UPPER_BOUND - LATITUDE_PRECISION;
const LATITUDE_MIN_THRESHOLD = LATITUDE_LOWER_BOUND + LATITUDE_PRECISION;
const LONGITUDE_MAX_THRESHOLD = LONGITUDE_UPPER_BOUND - LONGITUDE_PRECISION;
const LONGITUDE_MIN_THRESHOLD = LONGITUDE_LOWER_BOUND + LONGITUDE_PRECISION;
const BOUND_ADJUSTMENT = 0.03; // Adjustment for latitude and longitude bounds
const PADDING_TOP = 100;
const PADDING_BOTTOM = 200;
const PADDING_LEFT = 10;
const PADDING_RIGHT = 100;
const STATIC_EASING = 1; // Easing function always returns 1 for this scenario
const MAX_GEOMETRY_LENGTH = 20000;
const HALF_SEC_INTERVAL = 500;
const TWO_HUNDERD_FIFTY = 250;
const ZERO = 0;
const ONE = 1;
const TWO = 2;
const THREE = 3;
const TWENTY = 20;
const SEVENTY = 70;

const useStyles = makeStyles(() => ({
	mapWrapper: {
		width: '100%',
	},
	map: {
		position: 'absolute',
		top: '0px',
		bottom: '0',
		left: '0',
		width: '100%',
		height: '100vh',
		overflow: 'hidden !important',
		'& a.mapboxgl-ctrl-logo, .mapboxgl-ctrl.mapboxgl-ctrl-attrib': {
			display: 'none',
		},
		'& .mapboxgl-canvas-container > canvas': {
			cursor: ({ drawingCircle }) => (drawingCircle ? 'crosshair' : 'inherit'),
			height: '100vh',
			width: '100% !important',
		},
		'& .mapboxgl-popup-close-button': { display: 'none' },
		// "& .mapboxgl-ctrl-group": { backgroundColor: "#0e111a" },
		// "& .mapboxgl-ctrl button.mapboxgl-ctrl-zoom-in .mapboxgl-ctrl-icon": { backgroundImage: "url('data:image/svg+xml;charset=utf-8,%3Csvg width=\"29\" height=\"29\" viewBox=\"0 0 29 29\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"%23FFFFFF\"%3E%3Cpath d=\"M14.5 8.5c-.75 0-1.5.75-1.5 1.5v3h-3c-.75 0-1.5.75-1.5 1.5S9.25 16 10 16h3v3c0 .75.75 1.5 1.5 1.5S16 19.75 16 19v-3h3c.75 0 1.5-.75 1.5-1.5S19.75 13 19 13h-3v-3c0-.75-.75-1.5-1.5-1.5z\"/%3E%3C/svg%3E')" },
		// "& .mapboxgl-ctrl button.mapboxgl-ctrl-zoom-out .mapboxgl-ctrl-icon": { backgroundImage: "url('data:image/svg+xml;charset=utf-8,%3Csvg width=\"29\" height=\"29\" viewBox=\"0 0 29 29\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"%23FFFFFF\"%3E%3Cpath d=\"M10 13c-.75 0-1.5.75-1.5 1.5S9.25 16 10 16h9c.75 0 1.5-.75 1.5-1.5S19.75 13 19 13h-9z\"/%3E%3C/svg%3E')" },
		// "& .mapboxgl-ctrl-top-left": {
		// 	marginTop: "140px",
		// 	marginLeft: ({ expandedPanel }) => expandedPanel ? "425px" : "2px"
		// } // Update zoom icon position on toggle side bar
	},
	filterPopup: {
		'& .mapboxgl-popup-tip': {
			display: 'none',
		},
	},
	footerLeftLogo: {
		position: 'absolute',
		bottom: '5px',
		zIndex: '1',
		left: '10px',
	},
	portal: {
		position: 'absolute',
		top: '45%',
		left: '47%',
		transform: 'translate(-50%, -50%)',
	},
}));

// let hoveredAbstractId = null;

function Map({
	type,
	paramId,
	expandedPanel = true,
	mapControls = true,
	openSpeedDial = true,
	width,
	hideShape = false,
	layerPadding = null,
}) {
	// context states
	const globalState = globalStateController.useState(['layers']);
	const { filterDrawing, navStateValues } = navController.useState(['filterDrawing'], 'navStateValues');
	const { selectedShapeFile, selectedPlaces, popupStateValues } = popupController.useState(
		['selectedShapeFile', 'selectedPlaces'],
		'popupStateValues'
	);
	const { mapStateValues } = mapStateController.useState(
		['mapVars', 'defaultMapVars', 'toggle3d', 'toggleZoomOut', 'isDefaultViewAllowed', 'reintializeMap'],
		'mapStateValues'
	);
	const { wellListFromSearch, layerStateValues } = layerController.useState(['wellListFromSearch'], 'layerStateValues');
	const [stateApp, setStateApp] = useContext(AppContext);

	const client = useApolloClient();
	const history = useHistory();
	const mapLayersPanelExtended = useSelector(({ MainMap }) => MainMap.mapLayersPanelExtended);

	// styles
	let classes = useStyles({
		drawingCircle: stateApp.draw && stateApp.draw.getMode() === 'drag_circle' ? true : false,
		expandedPanel: mapLayersPanelExtended ? true : false,
	});

	const dispatch = useDispatch();
	const removeLayerFromMap = useSelector(({ MainMap }) => MainMap.removeLayerFromMap);

	const {
		stateValues: { searchValue },
	} = mapControlsController.useState(['searchValue']);

	const [mapStyles, MapStyles] = useState([]);
	const setMapStyles = state => {
		if (mapStyles !== state) {
			MapStyles(state);
		}
	};

	const [map, Map] = useState(null);
	const setMap = state => {
		if (map !== state) {
			Map(state);
		}
	};
	const [draw, Draw] = useState(null);
	const setDraw = state => {
		if (draw !== state) {
			Draw(state);
		}
	};
	const [drawingFilterFeatureId, DrawingFilterFeatureId] = useState(null);
	const setDrawingFilterFeatureId = state => {
		if (drawingFilterFeatureId !== state) {
			DrawingFilterFeatureId(state);
		}
	};

	const mapEl = useRef(null);

	// hacky but having to use a ref for valid state during map on event callback

	mapboxgl.accessToken = stateApp.mapboxglAccessToken;

	const [loading, Loading] = useState(true);

	const setLoading = state => {
		if (loading !== state) {
			Loading(state);
		}
	};

	// queries
	const [getAllLayerSettingsByUser, { data: layerStates, loading: layerSettingsLoading }] =
		useLazyQuery(ALLLAYERSETTINGSBYUSER);

	// Query to fetch map views from the GraphQL API
	useQuery(GET_GRID_VIEWS, {
		variables: {
			userId: globalStateController.getValue('user').mongoId,
			module: 'MapView',
		},
		onCompleted: data => {
			const allViews = data?.getGridViews?.gridViews;
			viewStateController('MapView').initialize({
				client,
				allViews,
				Icon: MapIcon,
				label: 'Map',
				styleOverride: {
					bgColor: { backgroundColor: '#0E111A' },
					color: { color: 'white' },
				},
			});
		},
	});

	/// //end/////////temporary

	const fitOverBounds = () => {
		let { maxLat, minLat, maxLong, minLong } = stateApp.fitBounds || {};

		const latDif = maxLat - minLat;
		const longDif = maxLong - minLong;

		if (latDif === 0) {
			maxLat =
				maxLat + LATITUDE_PRECISION > LATITUDE_UPPER_BOUND ? LATITUDE_MAX_THRESHOLD : maxLat + LATITUDE_PRECISION;

			minLat =
				minLat - LATITUDE_PRECISION < LATITUDE_LOWER_BOUND ? LATITUDE_MIN_THRESHOLD : minLat - LATITUDE_PRECISION;
		} else {
			maxLat =
				maxLat + latDif * HIGHER_PRECISION > LATITUDE_UPPER_BOUND
					? LATITUDE_MAX_THRESHOLD
					: maxLat + latDif * HIGHER_PRECISION;

			minLat =
				minLat - latDif * HIGHER_PRECISION < LATITUDE_LOWER_BOUND
					? LATITUDE_MIN_THRESHOLD
					: minLat - latDif * HIGHER_PRECISION;
		}

		if (longDif === 0) {
			maxLong =
				maxLong + LONGITUDE_PRECISION > LONGITUDE_UPPER_BOUND ? LONGITUDE_MAX_THRESHOLD : maxLong + LONGITUDE_PRECISION;

			minLong =
				minLong - LONGITUDE_PRECISION < LONGITUDE_LOWER_BOUND ? LONGITUDE_MIN_THRESHOLD : minLong - LONGITUDE_PRECISION;
		} else {
			maxLong =
				maxLong + longDif * HIGHER_PRECISION > LONGITUDE_UPPER_BOUND
					? LONGITUDE_MAX_THRESHOLD
					: maxLong + longDif * HIGHER_PRECISION;

			minLong =
				minLong - longDif * HIGHER_PRECISION < LONGITUDE_LOWER_BOUND
					? LONGITUDE_MIN_THRESHOLD
					: minLong - longDif * HIGHER_PRECISION;
		}

		return {
			maxLat,
			minLat,
			maxLong,
			minLong,
		};
	};

	const fetchStyles = async abortController => {
		const token =
			'&access_token=sk.eyJ1IjoibTFuZXJhbCIsImEiOiJjazdkbGg1YXAwMjVqM2VwanZzbm95Z2dvIn0.cdoQNZU42xxbybyGxlBNkw';
		let link = 'https://api.mapbox.com/styles/v1/m1neral?&sortby=modified';
		const reqOptions = {
			method: 'GET',
			mode: 'cors',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'Cache-Control': 'max-age=0',
			},
		};

		const { signal } = abortController;

		let styleTypes = baseTenantsMaps();
		let recurseLimit = 16;

		try {
			const styles = await styleTypes.reduce(async (stylesPromise, styleType) => {
				const styles = await stylesPromise;
				if (!styles.find(style => style.name === styleType) && recurseLimit > 0) {
					--recurseLimit;
					const response = await fetch(new Request(link + token, reqOptions), { signal });
					const data = await response.json();
					link = parseLinkHeader(response.headers.get('Link'))?.next?.url;
					styles.push(
						..._.uniqBy(
							data.filter(style => styleTypes.includes(style.name) && !styles.find(el => el.name === style.name)),
							'name'
						)
					);
				}
				return styles;
			}, []);
			return styles;
		} catch (error) {
			// Handle any errors here
			console.error('Error occurred:', error);
			throw error; // Rethrow the error to be caught outside
		}
	};

	useEffect(async () => {
		const abortController = new AbortController();

		fetchStyles(abortController)
			.then(styles => {
				setMapStyles(styles);
				setStateApp(state => ({
					...state,
					mapStyles: styles,
				}));
			})
			.catch(error => {
				// Handle any errors from fetchStyles
				console.error('fetchStyles error:', error);
			});

		popupController.updateState({
			popupOpen: !!(popupController.getValue('wellSelectedCoordinates')?.length > 0 && searchValue),
			expandedCard: false,
		});

		// clean up
		return function cleanup() {
			try {
				abortController.abort();
			} catch (err) {
				console.log('🚀 ~ cleanup ~ err:', err.message);
			}

			layerController.resetMap();

			setStateApp(state => ({
				...state,
				viewDoc: null,
			}));
		};
	}, []);

	const getElasticWell = async paramId => {
		const { data: well } = await client.query({
			query: GET_DB_DATA,
			variables: {
				index: 'platformData:wells',
				pagination: {
					first: 1,
					keep_alive: '1micros',
				},
				filters: [
					{
						field: '_id',
						value: paramId.toLowerCase(),
					},
				],
				sort: [],
			},
		});
		const wellFeature = { ...well.getDbData.hits[0] };
		if (wellFeature?.Id) {
			wellFeature.id = wellFeature.Id;
		}
		const interval = setInterval(() => {
			if (window.mapRef) {
				layerController.updateState({ clickedFeature: { object: { id: paramId } } });
				popupController.updateState({
					selectedWellId: paramId.toLowerCase(),
					wellSelectedCoordinates: [wellFeature.longitude, wellFeature.latitude],
					popupOpen: false,
					expandedCard: true,
				});
				if (wellFeature?.longitude) {
					drawWellBoundary([wellFeature.longitude, wellFeature.latitude]);
				}
				popupController.fitWellBounds(wellFeature);
				clearInterval(interval);
			}
		}, 100);
	};

	async function getCustomLayer(paramId) {
		const keys = { parcels: 'selectedParcel', ...layersWithSelectedShapeKey(), wells: 'selectedWell' };
		const { data: layer } = await client.query({
			query: CUSTOMLAYER,
			variables: {
				id: paramId,
			},
		});
		if (layer?.customLayer) {
			let layers = globalStateController.getValue('layers');
			if (!layers || layers?.length === 0) {
				const { data } = await client.query({
					query: LAYERSETTINGSBYUSER,
					variables: {
						userId: stateApp.user.mongoId,
						identifier: convertToTitleCase(layer.customLayer.layer + 's'),
					},
				});
				layers = globalStateController.getValue('layers');
				if ((!layers || layers?.length === 0) && data?.layerSettingsByUser) {
					globalStateController.updateState({
						deckLayer: data.layerSettingsByUser,
					});
				}
			}

			let jsonLayer = JSON.parse(layer.customLayer.shape);
			if (layer.customLayer.shapeJson) {
				jsonLayer = copy(layer.customLayer.shapeJson);
			}

			jsonLayer.layer = { id: layer.customLayer.layer };
			jsonLayer.id = layer.customLayer._id;

			const interval = setInterval(() => {
				if (window.mapRef) {
					findBoundsMap([jsonLayer], window.mapRef, layerPadding);
					drawBoundary(jsonLayer);

					layerController.updateState({ clickedFeature: { object: { id: paramId } } });
					popupController.updateState({
						[keys[type]]: {
							...jsonLayer.properties,
							feature: jsonLayer,
							id: layer.customLayer._id,
						},
						...(type === 'parcels' ? { selectedShape: null } : {}),
						popupOpen: false,
						expandedCard: true,
						customLayerId: layer.customLayer._id,
					});
					clearInterval(interval);
				}
			}, 100);
		} else {
			history.push('/');
		}
	}

	useEffect(() => {
		if (!window.mapRef || !popupStateValues.selectedShapeFile) {
			return;
		}

		popupController.updateState({ popupOpen: false });

		const combined = turf.combine(turf.featureCollection([popupStateValues.selectedShapeFile]));
		const bbox = turf.bbox(combined);
		window.mapRef.fitBounds(
			[
				[bbox[0] - BOUND_ADJUSTMENT, bbox[1] - BOUND_ADJUSTMENT], // Southwest coordinates
				[bbox[0] + BOUND_ADJUSTMENT, bbox[1] + BOUND_ADJUSTMENT], // Northeast coordinates
			],
			{
				padding: {
					top: PADDING_TOP,
					bottom: PADDING_BOTTOM,
					left: PADDING_LEFT,
					right: PADDING_RIGHT,
				},
				easing: () => STATIC_EASING,
			}
		);

		const layers = globalStateController.getValue('layers');

		const layer = layers.find(l => popupStateValues.selectedShapeFile.properties?.layerShapeName === l.layerShapeName);

		udLayerClickHandler(popupStateValues.selectedShapeFile, layer);
	}, [selectedShapeFile]);

	useEffect(() => {
		const clickedFeature = layerController.getValue('clickedFeature');
		if (paramId && clickedFeature?.object?.id !== paramId) {
			try {
				if (type === 'wells') {
					getElasticWell(paramId);
				} else {
					getCustomLayer(paramId);
				}
			} catch {
				history.push('/');
			}
		}
	}, [paramId]);

	useEffect(() => {
		if (stateApp.user && stateApp.user.mongoId) {
			setLoading(true);

			getAllLayerSettingsByUser({
				variables: {
					userId: stateApp.user.mongoId,
				},
			});
		}
	}, [stateApp.user]);

	useEffect(() => {
		globalStateController.updateState({ layerSettingsLoading });
	}, [layerSettingsLoading]);

	useEffect(() => {
		if (layerStates && layerStates.allLayerSettingsByUser) {
			const layers = copy(layerStates.allLayerSettingsByUser);
			setStateApp(state => ({
				...state,
				layers,
			}));
			globalState.layers.set(layers);
			stateApp.layers = layers;

			//Refactor Flag
			const mapViewFilters = viewStateController('MapView').getValue('selectedView')?.filters || [];
			// for of loop on mapViewFilters
			for (const filter of mapViewFilters) {
				const dataSource = filter?.dataSourceName;
				// Get initial filters and merge with the latest ones
				const state = layerFiltersController.getValue([dataSource]);
				const initialFilters = state?.variables?.filters || []; // Get initial filters
				layerFiltersController.setVariables(dataSource, {
					filters: extractUniqueFilters([
						getFormattedFilterBasedOnType(filter.filterType, filter.fieldName, filter.filterValues),
						...initialFilters,
					]),
				});
			}
		}
	}, [layerStates]);

	/// / remove the layer and it's source from the map after it's deleted
	const removeLayer = layer => {
		const paintProps = layer.layerPaintProps;
		if (!paintProps?.length) {
			return;
		}

		for (let i = paintProps.length - 1; i >= 0; i--) {
			const prop = paintProps[i];

			// -> remove layer
			const layerId = layer.layerType === 'file layer' ? layer.identifier : prop.id;
			if (map.getLayer(layerId)) {
				map.removeLayer(layerId);
			}

			if (prop.clusterProps) {
				if (map.getLayer(`${layerId}-clusters-counts`)) {
					map.removeLayer(`${layerId}-clusters-counts`);
				}

				if (map.getLayer(`${layerId}-clusters`)) {
					map.removeLayer(`${layerId}-clusters`);
				}
			}

			const { layers } = map.getStyle();
			// -> remove source
			const sourceId = prop.sourceProps;
			const sourceLayers = layers.filter(layer => layer.source === sourceId);
			if (map?.getSource(sourceId) && sourceLayers.length === 0) {
				map.removeSource(sourceId);
			}
			if (map?.getSource(`${sourceId}_point`)) {
				map.removeSource(`${sourceId}_point`);
			}
			if (map?.getSource(`${sourceId}_filter`)) {
				map.removeSource(`${sourceId}_filter`);
			}
		}
	};

	useEffect(() => {
		if (removeLayerFromMap && map) {
			removeLayerFromMap.forEach(layer => {
				removeLayer(layer);
			});
			dispatch(setMainMapState({ removeLayerFromMap: null }));
		}
	}, [removeLayerFromMap]);

	useEffect(() => {
		// USE EFFECT FOR BASEMAP LAYER HANDLING
		const mapLayers = copy(globalState.stateValues.layers);
		if (!stateApp.baseMapLayers || stateApp.baseMapLayers.length === 0 || !map) {
			return;
		}
		const landLayer = mapLayers?.find(layer => layer.identifier === 'Land Grid');
		const baseMapLandIndex = stateApp.baseMapLayers.findIndex(layer => layer.name === 'Land Grid');
		const landLayerVisible = landLayer?.layerSettings?.visiable && landLayer?.layerSettings?.showable;

		if (!landLayerVisible && stateApp.checkedBaseLayers.includes(baseMapLandIndex)) {
			setStateApp(state => ({
				...state,
				checkedBaseLayers: stateApp.checkedBaseLayers.filter(l => l !== baseMapLandIndex),
			}));
		}
		if (landLayerVisible && !stateApp.checkedBaseLayers.includes(baseMapLandIndex)) {
			setStateApp(state => ({
				...state,
				checkedBaseLayers: [...stateApp.checkedBaseLayers, baseMapLandIndex],
			}));
		}
	}, [map, stateApp.baseMapLayers, globalState.layers]);

	useEffect(() => {
		// USE EFFECT FOR BASEMAP LAYER HANDLING
		const mapLayers = copy(stateApp.layers);
		if (stateApp.baseMapLayers && stateApp.baseMapLayers.length > 0 && map) {
			const landLayer = mapLayers?.find(layer => layer.identifier === 'Land Grid');
			stateApp.baseMapLayers?.forEach((l, index) => {
				if (l.name === 'Land Grid' && !stateApp.checkedBaseLayers.includes(index)) {
					if (landLayer) {
						landLayer.layerSettings.visiable = false;
						setStateApp(state => ({ ...state, layers: [...mapLayers] }));
					}
				}

				l?.id?.forEach(k => {
					if (map?.getLayer(k)) {
						map?.setLayoutProperty(k, 'visibility', 'none');
					}
				});
			});

			if (stateApp.checkedBaseLayers.length > 0) {
				const layers = stateApp.checkedBaseLayers.slice(0);
				layers.sort((a, b) => b - a);
				if (layers.length > 0) {
					let belowlayer = null;
					for (let k = layers.length - 1; k >= 0; k--) {
						const i = layers[k];
						if (stateApp.baseMapLayers[i].name === 'Land Grid') {
							if (landLayer) {
								landLayer.layerSettings.visiable = true;
								setStateApp(state => ({ ...state, layers: [...mapLayers] }));
							}
							continue;
						}
						const currentLayerArray = stateApp.baseMapLayers[i].id;

						currentLayerArray.forEach(j => {
							const mapLayer = map.getLayer(j);
							if (typeof mapLayer !== 'undefined') {
								if (map.getLayer(j)) {
									map.setLayoutProperty(j, 'visibility', 'visible');
									if (belowlayer != null) {
										map.moveLayer(j, belowlayer);
									}
									belowlayer = j;
								}
							}
						});
					}
				}
			}
		}
	}, [map, stateApp.checkedBaseLayers, stateApp.baseMapLayers]);

	useEffect(() => {
		// USE EFFECT FOR HEATMAP LAYER HANDLES
		if (stateApp.heatLayers && stateApp.heatLayers.length > 0 && map) {
			stateApp.heatLayers.forEach(l => {
				l.id.forEach(k => {
					if (map?.getLayer(k)) {
						map?.setLayoutProperty(k, 'visibility', 'none');
					}
				});
			});

			if (stateApp.checkedHeats.length > 0) {
				const layers = stateApp.checkedHeats.slice(0);
				layers.sort((a, b) => b - a);
				if (layers.length > 0) {
					let belowlayer = null;
					for (let k = layers.length - 1; k >= 0; k--) {
						const i = layers[k];
						const currentLayerArray = stateApp.heatLayers[i].id;

						currentLayerArray.forEach(j => {
							const mapLayer = map.getLayer(j);
							if (typeof mapLayer !== 'undefined') {
								if (map.getLayer(j)) {
									map.setLayoutProperty(j, 'visibility', 'visible');
									if (belowlayer != null) {
										map.moveLayer(j, belowlayer);
									}
									belowlayer = j;
								}
							}
						});
					}
				}
			}
		}
	}, [map, stateApp.checkedHeats, stateApp.heatLayers]);

	function getIndex(value, arr, prop) {
		for (let i = 0; i < arr.length; i++) {
			if (arr[i][prop] === value) {
				return i;
			}
		}
		return -1; // to handle the case where the value doesn't exist
	}

	useEffect(() => {
		if (map && mapStateValues.isDefaultViewAllowed) {
			// Add check to update mapVars if position is updated
			mapStateController.updateState({ mapVars: mapStateValues.defaultMapVars });
			map.jumpTo({
				center: [mapStateValues.defaultMapVars.center.lng, mapStateValues.defaultMapVars.center.lat],
				zoom: mapStateValues.defaultMapVars.zoom,
			});
		}
	}, [mapStateValues.defaultMapVars]);

	useEffect(() => {
		const sourceId = layerRefs.abstract_geo?.get({ noproxy: true })?.sourceId;

		if (!sourceId) {
			return;
		}

		if (map) {
			const featuresList = map?.getSource(sourceId)?._data.features || [];
			for (let i = 0; i < featuresList.length; i++) {
				const id = featuresList[i].properties.Id;
				map.setFeatureState({ source: sourceId, id }, { click: stateApp.filterSelectAllAbstract });
			}
		}
	}, [stateApp.filterSelectAllAbstract, map]);

	// if this isn't fast enough we can try to only recalc length for features on the tile boundary
	// if feature is entirely within a tile we difinitively know the length
	// if it is on the tile boundary we know that the vector feature "may" cross tile boundaries so don't know the true
	// length from a single tile
	async function findBadLinestrings(map, tile) {
		if (!tile) {
			return;
		}
		let repaint = false;
		const renderedLineStrings = [];
		tile.querySourceFeatures(renderedLineStrings, {
			filter: ['in', ['geometry-type'], ['literal', ['LineString', 'MultiLineString']]],
			sourceLayer: 'wells',
		});
		renderedLineStrings.forEach(feature => {
			const geometryLength = map.getFeatureState({
				source: 'wellsVT',
				sourceLayer: 'wells',
				id: feature.id,
			})?.geometryLength;
			const newGeometryLength = Math.round(turf.length(feature.geometry, { units: 'feet' }), 0);
			if (newGeometryLength > MAX_GEOMETRY_LENGTH && !(geometryLength >= newGeometryLength)) {
				map.setFeatureState(
					{
						source: 'wellsVT',
						sourceLayer: 'wells',
						id: feature.id,
					},
					{
						geometryLength: Math.max(newGeometryLength, geometryLength || -1),
					}
				);
				repaint = true;
			}
		});

		if (repaint) {
			map.triggerRepaint();
		}
	}

	useEffect(() => {
		if (mapStyles.length <= 0) {
			return;
		}

		const initializeMap = ({ setMap, mapEl, setStateApp, setDraw }) => {
			const { id } = mapEl.current;

			let index = getIndex(mapStateValues.mapVars.styleId, mapStyles, 'name');
			if (index === -1) {
				index = 0;
			}
			const newMap = new mapboxgl.Map({
				container: `${id}`,
				style: `mapbox://styles/m1neral/${mapStyles[index]?.id}`,
				center: mapStateValues.mapVars.center,
				zoom: mapStateValues.mapVars.zoom,
				pitch: mapStateValues.mapVars.pitch,
				bearing: mapStateValues.mapVars.bearing,
			});

			/// optimized interactions w/ map
			newMap.scrollZoom.enable();
			newMap.dragPan.enable();
			newMap.dragRotate.enable();
			newMap.keyboard.enable();
			// newMap.doubleClickZoom.disable();
			newMap.boxZoom.enable();
			newMap.touchZoomRotate.enable();

			newMap.addControl(
				new mapboxgl.ScaleControl({
					maxWidth: 80,
					unit: 'imperial',
				}),
				'bottom-right'
			);
			newMap.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'bottom-right');

			const geoLocate = new mapboxgl.GeolocateControl({
				positionOptions: {
					enableHighAccuracy: true,
				},
				fitBoundsOptions: {
					maxZoom: 24,
				},
				trackUserLocation: false,
				showAccuracyCircle: true,
				showUserLocation: true,
			});
			newMap.addControl(geoLocate, 'bottom-right');
			geoLocate.on('geolocate', e => {
				newMap.jumpTo({
					center: [e.coords.longitude, e.coords.latitude],
					zoom: 14,
					pitch: 80,
					bearing: 20,
				});
			});

			/// / selecting the rect after draw
			const CostumDrawRectangle = { ...DrawRectangle };
			CostumDrawRectangle.onClick = function onClick(state, e) {
				// if state.startPoint exist, means its second click
				// change to  simple_select mode
				if (state.startPoint && state.startPoint[0] !== e.lngLat.lng && state.startPoint[1] !== e.lngLat.lat) {
					this.updateUIClasses({ mouse: 'pointer' });
					state.endPoint = [e.lngLat.lng, e.lngLat.lat];

					this.changeMode('simple_select', {
						featuresId: state.rectangle.id,
					});

					this.setSelected(state.rectangle.id); /// / selecting the rect after draw
				}
				// on first click, save clicked point coords as starting for  rectangle
				const startPoint = [e.lngLat.lng, e.lngLat.lat];
				state.startPoint = startPoint;
			};

			const Draw = new MapboxDraw({
				displayControlsDefault: false,
				userProperties: true,
				styles: drawShapeStyles,
				modes: {
					...MapboxDraw.modes,
					static: StaticMode,
					draw_circle: CircleMode,
					drag_circle: DragCircleMode,
					direct_select: DirectMode,
					simple_select: SimpleSelectMode,
					draw_rectangle: CostumDrawRectangle,
					tx_poly: SRMode,
				},
			});
			newMap.addControl(Draw);

			newMap.on('sourcedata', e => {
				if (e.sourceId === 'wellsVT') {
					findBadLinestrings(e.target, e.tile);
				}
			});

			const interval = setInterval(() => {
				let isDragging = false;
				let isDrawing = false;
				if (newMap.__deck) {
					window.mapRef?.on('draw.actionable', () => {
						// console.log(window.drawRef?.getMode())
						isDrawing = !['direct_select', 'simple_select'].includes(window.drawRef?.getMode());
					});
					newMap.__deck?.setProps({
						onDragStart: () => {
							isDragging = true;
						},
						onDragEnd: () => {
							isDragging = false;
						},
						getCursor: ({ isHovering }) =>
							isDrawing ? 'crosshair' : isDragging ? 'grabbing' : isHovering ? 'pointer' : 'grab',
						onClick: ({ x, y, coordinate }, { rightButton, srcEvent }) => {
							const drawMode = window.drawRef?.getMode();

							if (drawMode?.includes('draw') || drawMode?.includes('drag')) {
								window.mapRef?.resize();
								return;
							}

							if (rightButton || srcEvent.shiftKey) {
								onRightClick({ x, y, coordinate });
								return;
							}

							const getLandGrid =
								window.event.ctrlKey || window.event.metaKey || drawController.getValue('multiSelectLandGrids');

							const { clickedFeature, layer } = getClickedFeature({ x, y, getLandGrid });
							const previousClickedFeature = layerController.getValue('clickedFeature');
							const clickOnSameFeature =
								previousClickedFeature && previousClickedFeature?.object?.id === clickedFeature?.object?.id;
							if (!clickedFeature || clickOnSameFeature) {
								const selectedPlace = selectedPlaces.get({ noproxy: true });
								if (!selectedPlace) {
									// Reset the state when slected search is not places
									popupController.reset();
								}
								// If the path is not '/' or ' ' and the map is not rendered through deal dialog
								if (!['', '/'].includes(window.location.pathname) && stateApp.transactBarView !== 'Map') {
									history.replace({ pathname: '/' });
								}
								return;
							}
							if (!getLandGrid) {
								drawBoundary(clickedFeature.object);
							}

							layerController.updateState({ clickedFeature });
							onFeatureClick(clickedFeature, layer);
						},
					});
					clearInterval(interval);
				}
			}, HALF_SEC_INTERVAL);

			newMap.on('load', () => {
				window.mapRef = null; // Remove the existing map instance to avoid rendering multiple maps
				window.drawRef = null; //  Remove the existing map instance to avoid rendering multiple maps
				window.mapRef = newMap;
				window.drawRef = Draw;
				layerController.resetMapStates(true);

				setStateApp(state => ({
					...state,
					map: newMap,
				}));

				newMap.loadImage(MarkerIcon, (error, image) => {
					if (error) {
						throw error;
					}
					// add image to the active style and make it SDF-enabled
					newMap.addImage('marker-icon', image, { sdf: true });
				});
				setTimeout(() => {
					// eslint-disable-next-line no-new
					new DeckGlLayer({
						layerId: 'top_deck_layer',
						type: 'ScatterplotLayer',
						props: {
							data: [],
						},
					});

					// eslint-disable-next-line no-new
					new DeckGlLayer({
						layerId: 'first_deck_layer',
						type: 'ScatterplotLayer',
						beforeLayer: 'top_deck_layer',
						props: {
							data: [],
						},
					});
				}, TWO_HUNDERD_FIFTY);

				// FOR aoi_labels
				newMap.addSource('aoi_label_source', {
					type: 'geojson',
					data: {
						type: 'FeatureCollection',
						features: [],
					},
				});

				setDraw(Draw);
				setMap(newMap);
				setLoading(false);
				mapStateController.updateState({ reintializeMap: false });
			});
		};

		if (!map || mapStateValues.reintializeMap) {
			initializeMap({ setMap, mapEl, setStateApp, setDraw });
		}
	}, [map, mapStyles, mapStateValues.mapVars.styleId]);

	// Use effect for removing shape filter
	useEffect(() => {
		if (!loading) {
			if (navStateValues.filterDrawing && navStateValues.filterDrawing.length === 0) {
				if (draw) {
					draw.delete(drawingFilterFeatureId);
				}
				navController.updateState({ drawingMode: null });
				setDrawingFilterFeatureId(null);
				popupController.updateState({
					popupOpen: false,
				});
			}
			const { filterBasin, filterAOI, filterParcel, filterDrawing } = navController.getValues([
				'filterBasin',
				'filterAOI',
				'filterParcel',
				'filterDrawing',
			]);
			if (filterBasin || filterAOI || filterParcel || (filterDrawing && filterDrawing[1])) {
				let features = [];
				features = [
					...features,
					...map.querySourceFeatures('wellsVT', {
						filter: ['==', ['geometry-type'], 'LineString'],
						sourceLayer: 'wells',
					}),
				];
				features = [
					...features,
					...map.querySourceFeatures('recentsub_permits_source', { sourceLayer: 'recent_submitted_permit_laterals' }),
				];

				navController.updateState({ filterIntersectingWellLines: features });
			}
		}
	}, [filterDrawing]);

	useEffect(() => {
		if (draw && navStateValues.filterDrawing?.length === TWO) {
			const feature = navStateValues.filterDrawing[ONE];
			setDrawingFilterFeatureId(feature.id);
			draw.delete(feature.id);
			draw.add(feature);
		}
	}, [draw]);

	useEffect(
		() => () => {
			if (!map) {
				return;
			}

			const list = document.getElementById('searchBar');
			if (list && list.childNodes && list.childNodes.length > 0) {
				list.removeChild(list.childNodes[0]);
			}
			const zoom = map.getZoom();
			const center = map.getCenter();
			const pitch = map.getPitch();
			const bearing = map.getBearing();

			mapStateController.updateState({
				mapVars: {
					...mapStateValues.mapVars,
					zoom,
					center,
					pitch,
					bearing,
				},
			});

			// Loading state is not being handled and causes undefined mapList Array
			// Added '?' to mapList, temp fix to avoid undefined errors.
			const mapList = document.getElementById('map');
			if (mapList?.childNodes?.length > 1) {
				mapList.removeChild(mapList.childNodes[1]);
				mapList.removeChild(mapList.childNodes[1]);
				mapList.removeChild(mapList.childNodes[1]);
			}
		},
		[map]
	);

	useEffect(() => {
		/// /// USE EFFECT TO MANAGE THE FLY TO FEATURE

		if (map && stateApp.flyTo) {
			const zVal = 12;

			popupController.setState({
				wellSelectedCoordinates: [stateApp.flyTo.longitude, stateApp.flyTo.latitude],
			});

			map.jumpTo({
				center: [stateApp.flyTo.longitude, stateApp.flyTo.latitude],
				zoom: stateApp.flyTo.zoom ? stateApp.flyTo.zoom : zVal,
			});
		}
	}, [map, stateApp.flyTo]);

	useEffect(() => {
		/// /// USE EFFECT TO MANAGE THE FIT BOUNDS TO FEATURE

		if (
			map &&
			stateApp.fitBounds &&
			stateApp.fitBounds.maxLat &&
			stateApp.fitBounds.minLat &&
			stateApp.fitBounds.maxLong &&
			stateApp.fitBounds.minLong
		) {
			const bounds = fitOverBounds();
			try {
				if (typeof bounds?.minLong !== 'undefined') {
					map.fitBounds(
						[
							[bounds.minLong, bounds.minLat],
							[bounds.maxLong, bounds.maxLat],
						],
						{
							easing: () => 1,
						}
					);
				}
			} catch {
				//
			}
		}
	}, [map, stateApp.fitBounds]);

	useEffect(() => {
		if (map && layerStateValues.wellListFromSearch && layerStateValues.wellListFromSearch.length > 0) {
			if (layerStateValues.wellListFromSearch.length > 1) {
				const findBounds = shape => {
					if (gjv.valid(shape)) {
						const bbox = turf.bbox(shape);
						return {
							minLong: bbox[ZERO],
							minLat: bbox[ONE],
							maxLong: bbox[TWO],
							maxLat: bbox[THREE],
						};
					}
					return null;
				};

				const formatIt = mdata => ({
					type: 'FeatureCollection',
					features: mdata
						.filter(feature => (feature.latitude && feature.longitude) || (feature.Latitude && feature.Longitude))
						.map(feature => {
							if (feature.latitude && feature.longitude) {
								return {
									type: 'Feature',
									properties: feature,
									geometry: {
										type: 'Point',
										coordinates: [feature.longitude, feature.latitude],
									},
								};
							}
							return {
								type: 'Feature',
								properties: feature,
								geometry: {
									type: 'Point',
									coordinates: [feature.Longitude, feature.Latitude],
								},
							};
						}),
				});
				setStateApp(state => ({
					...state,
					searchLoader: false,
					fitBounds: findBounds(formatIt(layerStateValues.wellListFromSearch)),
				}));
			} else if (
				layerStateValues.wellListFromSearch[0] &&
				layerStateValues.wellListFromSearch[0].latitude &&
				layerStateValues.wellListFromSearch[0].longitude
			) {
				map.jumpTo({
					center: {
						lng: layerStateValues.wellListFromSearch[0].longitude,
						lat: layerStateValues.wellListFromSearch[0].latitude,
					},
					zoom: 12,
				});
				setStateApp(state => ({
					...state,
					searchLoader: false,
				}));
			}
		}
	}, [map, wellListFromSearch]);

	useEffect(() => {
		if (map && selectedPlaces) {
			const places = selectedPlaces.get({
				noproxy: true,
			});
			if (!places) {
				return;
			}
			const longitude = places?.geometry?.coordinates[0];
			const latitude = places?.geometry?.coordinates[1];
			drawPlaceBoundary([longitude, latitude]); // show dot on searched places coordinates
			map.jumpTo({
				center: {
					lng: longitude,
					lat: latitude,
				},
				zoom: 16,
			}); // Jump to the selected place longitude & latitude
			setStateApp(state => ({
				...state,
				searchLoader: false,
			}));
		}
	}, [map, selectedPlaces]); // create separate effect for the selectedPlaces

	useEffect(() => {
		if (map && stateApp?.findLocation?.location?.length > 0) {
			const findLocationGeoJson = {
				type: 'FeatureCollection',
				features: [
					{
						type: 'Feature',
						properties: stateApp.findLocation,
						geometry: {
							type: 'Point',
							coordinates: stateApp?.findLocation?.location,
						},
					},
				],
			};
			if (map?.getSource('find_location')) {
				map?.getSource('find_location').setData(findLocationGeoJson);
			}
			map.moveLayer('find_location_layer');

			map.jumpTo({
				center: {
					lng: stateApp.findLocation.location[0],
					lat: stateApp.findLocation.location[1],
				},
				zoom: 17,
			});

			setStateApp(state => ({
				...state,
				searchLoader: false,
			}));
		}
	}, [map, stateApp.findLocation]);

	useEffect(() => {
		if (map && stateApp.landGridListFromSearch && stateApp.landGridListFromSearch.length > 0) {
			const findBounds = shape => {
				if (gjv.valid(shape)) {
					const bbox = turf.bbox(shape);
					return {
						minLong: bbox[ZERO],
						minLat: bbox[ONE],
						maxLong: bbox[TWO],
						maxLat: bbox[THREE],
					};
				}
				return null;
			};

			const formatIt = mdata => ({
				type: 'FeatureCollection',
				features: mdata.map(feature => ({
					type: 'Feature',
					...JSON.parse(feature.shape),
				})),
			});

			setStateApp(state => ({
				...state,
				searchLoader: false,
				fitBounds: findBounds(formatIt(stateApp.landGridListFromSearch)),
			}));
		}
	}, [map, stateApp.landGridListFromSearch]);

	useEffect(() => {
		if (map && mapStateValues.toggleZoomOut) {
			if (mapStateValues.toggleZoomOut === true) {
				map.jumpTo({
					center: mapStateValues.defaultMapVars.center,
					zoom: mapStateValues.defaultMapVars.zoom,
					pitch: mapStateValues.defaultMapVars.pitch,
					bearing: mapStateValues.defaultMapVars.bearing,
				});

				mapStateController.updateState({ toggleZoomOut: null });
			}
		}
	}, [mapStateValues.toggleZoomOut]);

	useEffect(() => {
		// use effect to toggle the map into a 3d state

		if (map && mapStateValues.toggle3d) {
			if (mapStateValues.toggle3d === true) {
				if (map.getPitch() === 0 && map.getBearing() === 0) {
					map.setPitch(SEVENTY);
					map.setBearing(TWENTY);
				} else {
					map.setPitch(ZERO);
					map.setBearing(ZERO);
				}
				mapStateController.updateState({
					mapVars: {
						...mapStateValues.mapVars,
						zoom: map.getZoom(),
						center: map.getCenter(),
						pitch: map.getPitch(),
						bearing: map.getBearing(),
					},
					toggle3d: null,
				});
			}
		}
	}, [mapStateValues.toggle3d]);

	useEffect(() => {
		// Map will be reset if we move to another page
		return () => {
			layerController.resetMap();
		};
	}, []);

	return (
		<div className={classes.mapWrapper}>
			<div className={classes.map} style={{ width }} ref={mapEl} id="map">
				{map ? <DefaultFiltersTest /> : null}
				<div className={classes.footerLeftLogo}>
					<img src="icons/M1LogoWhiteTransparent.png" alt="logo" width="150" />
				</div>
			</div>

			<DeckGL hideShape={hideShape} />
			{openSpeedDial && <SpeedDialComponent expandedPanel={expandedPanel} openSpeedDial={openSpeedDial} />}

			{mapControls && <MapControls />}
			<ZoomFault zoomFaultStatus={stateApp.zoomFault} />
			<HugeRequest />

			<MapGridCardProvider />
		</div>
	);
}

Map.propTypes = {
	type: PropTypes.string.isRequired,
	paramId: PropTypes.string.isRequired,
	expandedPanel: PropTypes.bool,
	mapControls: PropTypes.bool,
	openSpeedDial: PropTypes.bool,
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	hideShape: PropTypes.bool,
	layerPadding: PropTypes.number,
};

export default React.memo(Map);
