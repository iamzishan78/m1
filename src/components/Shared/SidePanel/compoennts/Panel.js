import React, { useContext, useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';
import { TransitionGroup } from 'react-transition-group';

import { Tab, Tabs, Chip, CircularProgress, Backdrop } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import RootRef from '@material-ui/core/RootRef';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import BasemapIcon from '@material-ui/icons/Language';
import LayersIcon from '@material-ui/icons/Layers';
import MapIcon from '@material-ui/icons/Map';

import { useApolloClient } from '@apollo/client';
import { useLazyQuery, useMutation } from '@apollo/client';
import { get } from 'lodash';

import { toggleLayersFiltersPanel } from 'actions/MainMap';

import SecondaryPanel from 'components/Shared/SecondaryPanel';
import Datasets from 'components/Shared/SidePanel/compoennts/Datasets';
import LayerFilters from 'components/Shared/SidePanel/compoennts/Filters/LayerFilters';
import MapPositions from 'components/Shared/SidePanel/compoennts/MapPositions';
import FilterAltIcon from 'components/Shared/svgIcons/FilterAltIcon';

import { UPDATE_USER_MAP_SETTINGS } from 'graphQL/useMutationUserMapSettings';

// Contexts
import { GET_MAP_VIEWS } from 'graphQL/useQueryMapView';

import { globalStateController } from 'stateManagement/globalStateController';
import { layerController } from 'stateManagement/layerStateController';
import { mapControlsController } from 'stateManagement/mapControlsController';
import { mapStateController } from 'stateManagement/mapStateController';
import { navController } from 'stateManagement/navStateController';

// actions
import { setActiveModule } from 'store/actions/commonActions';

import { showErrorMessage, showSuccessMessage } from 'actions';

import AddGroup from './AddGroup';
import MapViewComponent from './Filters/MapViewComponent';
import MapViewOptions from './Filters/MapViewOptions';
import Layer from './Layer';
import SortableLayer from './SortableLayer';
import {
	useStyles,
	StyledMenu,
	StyledMenuItem,
	StyledListItem2,
	StyledListItemSecondaryAction,
	StyledMenuHeaderItem,
	StyledMenuHActionHeader,
	StyledMenuSecondaryHeaderItem,
} from './style';
import { AppContext } from '../../../../AppContext';
import { deepEqualObjects } from '../../functions';
import { customLayersFieldAccessors } from './Filters/consts';

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
	const { mapStateValues } = mapStateController.useState(['reintializeMap'], 'mapStateValues');
	return (
		<Grid container direction="column" spacing={3}>
			<Grid item>
				<Grid container style={{ position: 'relative' }}>
					{mapStateValues.reintializeMap && (
						<Backdrop style={{ zIndex: 999999, position: 'absolute', width: '100%' }} open={true} invisible={false}>
							<CircularProgress size={80} disableShrink color="secondary" />
						</Backdrop>
					)}
					<Grid
						item
						style={{
							position: 'relative',
							height: '250px',
							width: '100%',
							overflow: 'scroll',
						}}
					>
						{mapStyles.map(style => (
							<StyledMenuItem
								disableRipple
								key={style.id}
								role={undefined}
								style={{
									background: currentStyle === style.name ? '#4B618F' : '',
								}}
								onClick={() => {
									if (currentStyle === style.name) {
										return;
									}
									setBaseMap(style, 'baseMap');
								}}
							>
								<Grid container alignItems="center">
									<Grid item>
										<Box
											component="img"
											src={
												{
													Outdoors: './icons/MapOutdoorIcon.jpeg',
													Satellite: './icons/MapSatelliteIcon.jpeg',
													Light: './icons/MapLightIcon.jpeg',
													Dark: './icons/MapDarkIcon.jpeg',
													Basic: './icons/MapBasicIcon.jpeg',
													'Real Estate': './icons/MapDarkIcon.jpeg',
												}[style.name] || './icons/MapPlaceholderImage.jpg'
											}
										/>
									</Grid>
									<Grid item>
										<ListItemText primary={style.name} style={{ paddingLeft: '25px' }} />
									</Grid>
								</Grid>
							</StyledMenuItem>
						))}
					</Grid>
				</Grid>
			</Grid>

			<Grid item>
				<hr
					style={{
						border: '1px solid #263451',
						borderRadius: '5px',
						marginTop: '30px',
						marginBottom: '10px',
					}}
				/>
			</Grid>

			<StyledListItem2>
				<ListItemIcon>
					<LayersIcon />
				</ListItemIcon>
				<ListItemText primary={`${title} Layers`} />
			</StyledListItem2>
		</Grid>
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
		} else {
			return false;
		}
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
	const { globalStateValues } = globalStateController.useState(
		['filters', 'mapView', 'allMapViews', 'layerSettingsLoading', 'datasets'],
		'globalStateValues'
	);
	const layers = globalStateController.getValue('layers');
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

	const totalFilterCount =
		navStateValues.geographyFilterCount +
		navStateValues.wellFilterCount +
		(globalStateValues?.mapView?.selectedMapView?.filters?.filter(filter => {
			const fileId = filter?.dataSourceName?.substring(0, filter?.dataSourceName?.indexOf('_'));
			const layerShapeName = filter?.dataSourceName?.substring(filter?.dataSourceName?.indexOf('_') + 1);
			const layer = layers.find(l => l.file === fileId && l.layerShapeName === layerShapeName);
			const dataSourceExists = filter?.dataSourceName && (customLayersFieldAccessors[filter?.dataSourceName] || layer);
			return (filter?.filterValues || ['empty', 'notEmpty'.includes(filter?.filterType)]) && dataSourceExists;
		})?.length || 0);

	useEffect(() => {
		setTotalHitMapCount(stateApp.checkedHeats.length);
	}, [stateApp]);

	useEffect(() => {
		if (stateApp.mapStyles && stateApp.mapStyles.length > 0) {
			setMapStyles([...stateApp.mapStyles]);
		}
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
			setMapVars(mapDefaultPosition);
		}
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
				...mapStateValues?.mapVars,
				center: map?.getCenter(),
				zoom: map?.getZoom(),
				styleId: style.name,
			},
			reintializeMap: true,
			isDefaultViewAllowed: false, // disable map position change on updating layer style
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
												onClick={() =>
													globalStateValues.datasets &&
													mapControlsController.updateState({ selectedControl: action.action })
												}
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

							{globalStateValues?.mapView?.showViewModal && (
								<MapViewOptions
									allMapViews={globalStateValues?.allMapViews || []}
									defaultView={
										globalStateValues?.allMapViews?.find(view => view?.type === 'Default') || {
											name: 'Standard Map View',
											type: 'Default',
										}
									}
									fetchMapViews={fetchMapViews}
								/>
							)}
						</div>
					)}

					<div className={classes.panelContent}>
						<StyledMenuSecondaryHeaderItem>
							<div>
								<div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
									<ListItemText primary={title} />
									{globalStateValues.layerSettingsLoading && <CircularProgress size={20} color="secondary" />}
								</div>

								{type === 'layer' && (
									<AddGroup userId={stateApp.user.mongoId} above={layerMap[layerMap.length - 1]?.id} />
								)}
							</div>
							{headerButton && (
								<StyledListItemSecondaryAction>
									<div style={{ display: 'flex', alignItems: 'center' }}>
										<Button
											onClick={() => headerButton.fn()}
											color="secondary"
											variant="outlined"
											startIcon={headerButton.icon}
										>
											{headerButton.text}
										</Button>
									</div>
								</StyledListItemSecondaryAction>
							)}
						</StyledMenuSecondaryHeaderItem>

						{/* base Stuff */}
						{type === 'base' && (
							<>
								<BasemapImageBox
									mapStyles={mapStyles}
									setBaseMap={setBaseMap}
									currentStyle={mapStateValues.mapVars.styleId}
									title={title}
								/>
								<Box overflow="hidden scroll" style={{ height: '50%' }}>
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
							</>
						)}

						{type === 'layer' && mapControlsStateValues.expandedPanel && (
							<SortableLayer search={search} mongoId={stateApp.user.mongoId} />
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
