import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { get } from 'lodash';
import { TransitionGroup } from 'react-transition-group';
import RootRef from '@material-ui/core/RootRef';
import { useLazyQuery, useMutation } from '@apollo/client';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { Tab, Tabs, Chip } from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { AppContext } from '../../../../AppContext';
import List from '@material-ui/core/List';
import LayersIcon from '@material-ui/icons/Layers';
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import BasemapIcon from '@material-ui/icons/Language';
import FilterAltIcon from 'components/Shared/svgIcons/FilterAltIcon';
import SecondaryPanel from 'components/Shared/SecondaryPanel';
import Datasets from 'components/Shared/SidePanel/compoennts/Datasets';
import LayerFilters from 'components/Shared/SidePanel/compoennts/Filters/LayerFilters';
import MapPositions from 'components/Shared/SidePanel/compoennts/MapPositions';
import { showErrorMessage, showSuccessMessage } from 'actions';
import MapIcon from '@material-ui/icons/Map';
import { useApolloClient } from '@apollo/client';

import { deepEqualObjects } from '../../functions';
import Layer from './Layer';
import { toggleLayersFiltersPanel } from 'actions/MainMap';

import {
	useStyles,
	StyledMenu,
	StyledMenuItem,
	StyledListItem2,
	StyledMenuHeaderItem,
	StyledMenuHActionHeader,
} from './style';
import SortableLayer from './SortableLayer';
import { UPDATE_USER_MAP_SETTINGS } from 'graphQL/useMutationUserMapSettings';

// Contexts
import { mapControlsController } from 'hookstate/mapControlsController';
import { layerController } from 'hookstate/layerStateController';
import { mapStateController } from 'hookstate/mapStateController';
import { navController } from 'hookstate/navStateController';
import MapViewComponent from './Filters/MapViewComponent';
import MapViewOptions from './Filters/MapViewOptions';
import { GET_MAP_VIEWS } from 'graphQL/useQueryMapView';
import { globalStateController } from 'hookstate/globalStateController';

// actions
import { setActiveModule } from 'store/actions/commonActions';

const layerIcons = [
	{
		action: 'layer',
		icon: <LayersIcon fontSize="medium" />,
	},
	// {
	//   action: "heatMaps",
	//   icon: <HeatmapIcon fontSize="medium" />,
	// },
	{
		action: 'base',
		icon: <BasemapIcon fontSize="medium" />,
	},
	{
		action: 'filter',
		icon: <FilterAltIcon fontSize="medium" />,
	},
];

const BasemapImageBox = React.memo(({ mapStyles, setBaseMap, title, currentStyle }) => {
	return (
		<>
			<div>
				{mapStyles.map(style => (
					<StyledMenuItem
						disableRipple
						key={style.id}
						role={undefined}
						style={{
							background: currentStyle === style.name ? '#4B618F' : '',
						}}
						onClick={() => {
							if (currentStyle === style.name) return;
							setBaseMap(style, 'baseMap');
						}}
					>
						<Grid container alignContent="center" alignItems="center">
							<Grid item>
								{style.name === 'Outdoors' && <Box component="img" src={'./icons/MapOutdoorIcon.jpeg'} />}
								{style.name === 'Satellite' && <Box component="img" src={'./icons/MapSatelliteIcon.jpeg'} />}
								{style.name === 'Light' && <Box component="img" src={'./icons/MapLightIcon.jpeg'} />}
								{style.name === 'Dark' && <Box component="img" src={'./icons/MapDarkIcon.jpeg'} />}
								{style.name === 'Basic' && <Box component="img" src={'./icons/MapBasicIcon.jpeg'} />}
							</Grid>
							<Grid item>
								<ListItemText primary={style.name} style={{ paddingLeft: '25px' }} />
							</Grid>
						</Grid>
					</StyledMenuItem>
				))}
			</div>
			<div
				style={{
					paddingLeft: '20px',
					paddingRight: '20px',
				}}
			>
				<hr
					style={{
						border: '1px solid #263451',
						borderRadius: '5px',
						marginTop: '30px',
						marginBottom: '10px',
					}}
				/>
			</div>

			<StyledListItem2>
				<ListItemIcon>
					<LayersIcon />
				</ListItemIcon>
				<ListItemText primary={`${title} Layers`} />
			</StyledListItem2>
		</>
	);
});

const DisplayList = React.memo(({ onDragEnd, type, classes, layerMap, handleToggle }) => (
	<DragDropContext onDragEnd={onDragEnd}>
		<Droppable droppableId="droppableM1">
			{provided => (
				<RootRef rootRef={provided.innerRef}>
					{type === 'base' && (
						<List className={classes.list}>
							<Layer layerMap={layerMap} type={type} handleToggle={handleToggle} />
						</List>
					)}

					{type === 'heatMaps' && (
						<List className={classes.heatmapList}>
							<Layer layerMap={layerMap} type={type} handleToggle={handleToggle} />
						</List>
					)}
				</RootRef>
			)}
		</Droppable>
	</DragDropContext>
));

const StyledSecondaryMenu = () => {
	const { mapControlsStateValues } = mapControlsController.useState(
		['addLayer', 'selectedLayerControl', 'manageSourceLayer', 'manageTransferData', 'manageLayer'],
		'mapControlsStateValues'
	);

	const secondaryPanelState = React.useMemo(() => {
		if (
			mapControlsStateValues.addLayer ||
			mapControlsStateValues.selectedLayerControl ||
			mapControlsStateValues.manageTransferData ||
			mapControlsStateValues.manageSourceLayer ||
			mapControlsStateValues.manageLayer
		) {
			return true;
		} else return false;
	}, [mapControlsStateValues]);

	return (
		<StyledMenu
			id="layer-secondary-panel"
			keepMounted
			open={secondaryPanelState}
			style={{ display: secondaryPanelState ? 'flex' : 'none', minWidth: '525px' }}
		>
			<TransitionGroup transitionName="carousel" transitionEnterTimeout={800} transitionLeaveTimeout={500}>
				<SecondaryPanel />
			</TransitionGroup>
		</StyledMenu>
	);
};

function Panel({ type, title, headerButton, handleToggle, onDragEnd, panelItems }) {
	const { selectedControl, expandedPanel, mapControlsStateValues } = mapControlsController.useState(
		['selectedControl', 'expandedPanel'],
		'mapControlsStateValues'
	);
	const { mapStateValues } = mapStateController.useState(['mapVars', 'defaultMapVars'], 'mapStateValues');
	const { navStateValues } = navController.useState(['geographyFilterCount', 'wellFilterCount'], 'navStateValues');
	const mapViewState = globalStateController.useState(['filters', 'mapView', 'allMapViews']);
	const mapViewStateValues = mapViewState.stateValues;
	const client = useApolloClient();
	// Query to fetch map views from the GraphQL API
	const [mapViews, { data }] = useLazyQuery(GET_MAP_VIEWS);

	useEffect(() => {
		// Trigger the query manually, e.g., when the component mounts
		mapViews({
			variables: {
				userId: globalStateController.getValue('user').mongoId,
			},
		});
	}, [mapViews]); // Empty array ensures it runs once when the component mounts

	useEffect(() => {
		const allMapViews = data?.getMapViews?.mapViews;
		globalStateController.updateState({
			allMapViews: allMapViews || [],
		});
	}, [data?.getMapViews?.mapViews]);

	async function fetchMapViews() {
		const result = await client.query({
			variables: {
				userId: globalStateController.getValue('user').mongoId,
			},
			query: GET_MAP_VIEWS,
		});
		const allMapViews = result?.data?.getMapViews?.mapViews;
		globalStateController.updateState({
			allMapViews,
			// mapView: {
			// 	selectedMapView: currentMapView,
			// },
		});
	}

	const [stateApp] = useContext(AppContext);
	const [totalHitMapCount, setTotalHitMapCount] = useState(null);
	const [updateUserMapSettings, { data: updatedMapSettings }] = useMutation(UPDATE_USER_MAP_SETTINGS);

	const classes = useStyles();
	const dispatch = useDispatch();

	const [filteredItems, setFilteredItems] = useState([]);
	const [layerMap, setLayerMap] = useState([]);
	const [mapStyles, setMapStyles] = useState([]);
	const [search, setSearch] = useState('');
	const [searchState, setSearchState] = useState(false);
	const [tab, setTab] = useState(0);

	const totalFilterCount = navStateValues.geographyFilterCount + navStateValues.wellFilterCount;

	useEffect(() => {
		setTotalHitMapCount(stateApp.checkedHeats.length);
	}, [stateApp]);

	useEffect(() => {
		if (stateApp.mapStyles && stateApp.mapStyles.length > 0) setMapStyles([...stateApp.mapStyles]);
	}, [stateApp.mapStyles]);

	useEffect(() => {
		switch (mapControlsStateValues.selectedControl) {
			case 'layer':
				setTab(0);
				break;
			// case "heatMaps":
			//   setTab(1);
			//   break;
			case 'base':
				setTab(1);
				break;
			case 'filter':
				setTab(2);
				break;
			default:
		}
	}, [selectedControl, mapControlsStateValues.selectedControl]);

	const filterLayers = useCallback(
		search => {
			if (!search) {
				setFilteredItems(panelItems);
			} else {
				switch (type) {
					case 'layer':
						setFilteredItems(
							panelItems?.filter(i => (i.layerName ?? i.name).toLowerCase().includes(search.toLowerCase()))
						);
						break;
					case 'base':
					case 'heatMaps':
						setFilteredItems(panelItems?.filter(i => i.name.toLowerCase().includes(search.toLowerCase())));
						break;
					default:
						break;
				}
			}
		},
		[type, panelItems, setFilteredItems]
	);

	useEffect(() => {
		filterLayers(search);
	}, [panelItems, search, filterLayers]);

	useEffect(() => {
		if ((type === 'layer' || type === 'heatMaps' || type === 'marketplace') && filteredItems) {
			setLayerMap(filteredItems);
		} else if (type === 'base' && filteredItems) {
			setLayerMap(filteredItems.filter(item => item.name !== 'Water' && item.name !== 'Land'));
		}
	}, [selectedControl, filteredItems, stateApp.checkedBaseLayers, stateApp.checkedHeatLayers, type]);

	useEffect(() => {
		dispatch(toggleLayersFiltersPanel(!!mapControlsStateValues.expandedPanel));
	}, [dispatch, expandedPanel, mapControlsStateValues.expandedPanel]);

	const setMapVars = useCallback(
		settings => {
			if (settings) {
				// setSettings(settings);
				mapStateController.updateState({
					defaultMapVars: {
						...mapStateValues.defaultMapVars,
						...settings,
					},
				});
			}
		},
		[mapStateValues.defaultMapVars]
	);

	useEffect(() => {
		const mapDefaultPosition = get(updatedMapSettings, 'updateUserMapSettings.settings.settings.mapDefaultPosition');
		// Only when position is changed and not style
		if (mapDefaultPosition && !deepEqualObjects(mapStateValues.defaultMapVars.center, mapDefaultPosition.center)) {
			if (mapDefaultPosition) {
				dispatch(showSuccessMessage('Map Default Position saved.'));
			} else if (updatedMapSettings) {
				dispatch(showErrorMessage('Error in saving Map Default Position.'));
			}
		}
		setMapVars(mapDefaultPosition);
	}, [updatedMapSettings, mapStateValues.defaultMapVars.center, dispatch, setMapVars]);

	const togglePullout = () => {
		mapControlsController.updateState({
			expandedPanel: !mapControlsController.getValue('expandedPanel'),
			addLayer: false,
			manageSourceLayer: false,
			manageLayer: false,
		});
	};

	const setBaseMap = (style, type) => {
		const map = window.mapRef;
		layerController.resetMapStates();
		mapStateController.updateState({
			mapVars: {
				...mapStateValues.mapVars,
				center: map.getCenter(),
				zoom: map.getZoom(),
				styleId: style.name,
			},
		});

		updateUserMapSettings({
			variables: {
				settings: {
					user: stateApp.user.mongoId,
					type,
					settings: {
						activeBaseMap: style.name,
					},
				},
			},
		});
	};

	const setMapDefaultPosition = params => {
		updateUserMapSettings({
			variables: {
				settings: {
					user: stateApp.user.mongoId,
					type: 'baseMap',
					settings: {
						mapDefaultPosition: {
							...params,
						},
					},
				},
			},
		});
	};

	const a11yProps = index => ({
		id: `full-width-tab-${index}`,
		'aria-controls': `full-width-tabpanel-${index}`,
	});

	// eslint-disable-next-line no-unused-vars
	const clearSearch = () => {
		setTimeout(() => {
			setSearch('');
			setSearchState(false);
			filterLayers();
		}, 200);
	};
	// eslint-disable-next-line no-unused-vars
	const setSearchValue = value => {
		setSearch(value);
		filterLayers(value);
	};

	useEffect(() => {
		togglePullout();
		dispatch(setActiveModule({})); // reset to default value on selecting map tab
	}, [dispatch]);

	return (
		<div>
			<div
				style={{
					position: 'absolute',
					display: 'flex',
					flexDirection: 'row',
					width: '50px',
					maxWidth: '425px',
					left: mapControlsStateValues.expandedPanel ? '0px' : type === 'marketplace' ? '-567px' : '0px',
					listStyleType: 'none',
					zIndex: '1300', // Z-index to fix dialog overlapping with searchbar
				}}
			>
				<StyledMenu
					id="layer-side-panel"
					style={!mapControlsStateValues.expandedPanel ? { display: 'none' } : { minWidth: '425px' }}
					keepMounted
					open={Boolean(mapControlsStateValues.selectedControl)}
				>
					<StyledMenuHeaderItem disableRipple key="subheader" role={undefined} dense className={classes.subHeaderItem}>
						<ListItemText primary="Map" />
					</StyledMenuHeaderItem>

					{/* Layer Icons */}
					<StyledMenuHActionHeader>
						<Grid
							container
							direction="row"
							justify="space-between"
							alignItems="center"
							className={classes.toolbarActions}
						>
							{!searchState && (
								<Grid item>
									<Tabs
										value={tab}
										aria-label="find-map-tabs"
										indicatorColor="primary"
										textColor="primary"
										variant="fullWidth"
									>
										{layerIcons.map((action, index) => (
											<Tab
												icon={action.icon}
												{...a11yProps(index)}
												onClick={() => mapControlsController.updateState({ selectedControl: action.action })}
											/>
										))}
										{totalHitMapCount !== 0 && (
											<Chip color="info" label={totalHitMapCount} className={classes.totalHitMap} />
										)}
										{totalFilterCount !== 0 && (
											<Chip color="info" label={totalFilterCount} className={classes.totalFilter} />
										)}
									</Tabs>
								</Grid>
							)}
							{/* <Grid item xs={searchState ? 12 : 1}>
                <div className={classes.search}>
                  {
                    type === "layer" &&
                    <>
                      <Tooltip title="Search" className={classes.iconSearch} onClick={() => document.getElementById("searchInput").focus()}>
                        <SearchIcon />
                      </Tooltip>
                      <InputBase
                        id="searchInput"
                        fullWidth
                        placeholder="Search by Layer Name"
                        value={search}
                        classes={{
                          root: classes.inputRoot,
                          input: classes.inputInput,
                        }}
                        autoComplete="off"
                        inputProps={{ "aria-label": "search" }}
                        onFocus={() => setSearchState(true)}
                        onChange={(evt) => setSearchValue(evt.target.value)}
                      />
                      {searchState && (
                        <Tooltip title="Clear" className={classes.iconClear}>
                          <IconButton size="small" htmlColor="white" onClick={clearSearch}>
                            <ClearIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </>
                  }
                </div>
              </Grid> */}
						</Grid>
					</StyledMenuHActionHeader>

					{type === 'layer' && <Datasets search={search} headerButton={headerButton} />}

					{type === 'filter' && (
						<div>
							<MapViewComponent
								label={'Map'}
								Icon={() => <MapIcon sx={{ color: 'white' }} />}
								defaultView={{
									name: 'Standard Map View',
									type: 'Default',
								}}
								fetchMapViews={fetchMapViews}
							/>

							{mapViewStateValues?.mapView?.showViewModal && (
								<MapViewOptions
									allMapViews={mapViewStateValues?.allMapViews || []}
									defaultView={{
										name: 'Standard Map View',
										type: 'Default',
									}}
									fetchMapViews={fetchMapViews}
								/>
							)}
						</div>
					)}

					<div className={classes.panelContent}>
						{/* base Stuff */}
						{type === 'base' && (
							<BasemapImageBox
								mapStyles={mapStyles}
								setBaseMap={setBaseMap}
								currentStyle={mapStateValues.mapVars.styleId}
								title={title}
							/>
						)}

						{type === 'layer' && mapControlsStateValues.expandedPanel && (
							<SortableLayer search={search} mongoId={stateApp.user.mongoId} />
						)}
						{type === 'base' && (
							<Box height="calc((100vh - 50px) - 631px)" overflow="hidden scroll">
								<Collapse in={true} timeout="auto" unmountOnExit>
									<DisplayList
										onDragEnd={onDragEnd}
										type={type}
										classes={classes}
										layerMap={layerMap}
										handleToggle={handleToggle}
									/>
								</Collapse>
								<MapPositions
									setMapDefaultPosition={setMapDefaultPosition}
									defaultMapVars={mapStateValues.defaultMapVars}
									mapVars={mapStateValues.mapVars}
								/>
							</Box>
						)}
						{type === 'heatMaps' && (
							<DisplayList
								onDragEnd={onDragEnd}
								type={type}
								classes={classes}
								layerMap={layerMap}
								handleToggle={handleToggle}
							/>
						)}
						{type === 'filter' && <LayerFilters />}
					</div>
				</StyledMenu>
				<StyledSecondaryMenu />
				<div className={classes.pulloutBox} id="side-panel-pullout-btn" onClick={() => togglePullout()}>
					{mapControlsStateValues.expandedPanel ? (
						<ArrowBackIosIcon id="arrowBackIcon" />
					) : (
						<ArrowForwardIosIcon className="svgouter" />
					)}
				</div>
			</div>
		</div>
	);
}

export default React.memo(Panel, deepEqualObjects);
