import React, { Fragment, useState, useContext, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';

import { Grid, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';

import { generateFileFilters } from 'components/Map/DeckGL/helpers/common';
import MRTTable from 'components/MRTTable';
import { FEATURES } from 'components/Shared/FeatureFlag/common';
import FeatureFlag from 'components/Shared/FeatureFlag/FeatureFlagComponent';

import { layerFiltersController } from 'controllers/layerFiltersController';
import { layerController } from 'controllers/layerStateController';
import { mapControlsController } from 'controllers/mapControlsController';
import { tableGlobalController } from 'controllers/tableController';

import { AppContext } from '../../AppContext';
import { platformDataInitialData, platformDataWellsInitialData, snapGridSideBarData } from './components/data';

const useStyles = makeStyles(theme => {
	return {
		card: {
			'& .noDrag': {
				transform: 'translate(0px, 0px) !important',
				transition: 'transform 0.3s ease-out, width 0.3s ease-out, height 0.3s ease-out',
				WebkitTransition: 'transform 0.3s ease-out, width 0.3s ease-out, height 0.3s ease-out',
			},
			'& .MuiInput-inputTypeSearch': {
				width: '96%',
			},
		},
		rootList: {
			width: ({ mapGridCardActivated }) =>
				mapGridCardActivated === 'min' ? '57vw' : mapGridCardActivated === 'exp' ? '96vw' : '57vw',
			height: ({ mapGridCardActivated }) =>
				mapGridCardActivated === 'min' ? '60vh' : mapGridCardActivated === 'exp' ? '91vh' : '60vh',
			left: ({ mapGridCardActivated }) => (mapGridCardActivated === 'exp' ? '2vw' : '2vw'),
			top: ({ mapGridCardActivated }) => (mapGridCardActivated === 'exp' ? '5vh' : '12vh'),
			zIndex: '1300',
			position: 'fixed',
		},
		dockMenu: ({ dockMenu, mapLayersPanelExtended }) => {
			const extendedPanelMargin = 485;
			const nonExtendedPanelMargin = 60;
			const margin = 20;

			let css = {},
				leftMargin = mapLayersPanelExtended ? extendedPanelMargin : nonExtendedPanelMargin;
			if (dockMenu === 'bottom' || dockMenu === 'top') {
				css = {
					top: dockMenu === 'bottom' ? '50vh' : '6vh',
					height: '50vh',
				};
				if (dockMenu === 'top') {
					css = { ...css, width: `calc(100vw - ${leftMargin + margin}px)`, left: `${leftMargin + margin}px` };
				} else {
					css = { ...css, width: `calc(100vw - ${leftMargin}px)`, left: `${leftMargin}px` };
				}
			} else if (dockMenu === 'left') {
				css = {
					left: `${leftMargin + margin}px`,
					width: '50vw',
					height: '94vh',
					top: '6vh',
				};
			} else if (dockMenu === 'right') {
				css = {
					left: '50vw',
					width: '50vw',
					height: '94vh',
					top: '6vh',
				};
			} else if (dockMenu === 'full') {
				css = {
					left: `${leftMargin + margin}px`,
					width: `calc(100vw - ${leftMargin + margin}px)`,
					height: '94vh',
					top: '6vh',
				};
			}
			css = { ...css, zIndex: '1300', position: 'fixed' };
			return css;
		},
		tapsRoot: {
			// flexGrow: 1,
			'& .MuiTab-root': {
				textTransform: 'none',
			},
		},
		appBar: {
			backgroundColor: '#F2F2F2',
			borderBottom: '1px solid rgba(224, 224, 224, 1)',
			boxShadow: 'none',
			color: '#757575',
			cursor: 'context-menu',
			'& .MuiIconButton-root:hover': {
				backgroundColor: 'rgba(255, 255, 255, 0.08)',
			},
			'& button': {
				cursor: 'pointer',
			},
		},
		tapsPanels: {
			'& .MuiBox-root': { padding: '0' },
		},
		tapsPanelsPadding: {
			'& .MuiBox-root': { padding: '0' },
		},
		mainPanelsDiv: {
			height: '100%',
			maxHeight: '100vh',
			position: 'relative',
			'&::-webkit-scrollbar': {
				width: '0.75em',
				height: '0.75em',
			},
			'&::-webkit-scrollbar-thumb': {
				backgroundColor: '#929292',
				borderRadius: 10,
			},
			'& div': {
				'&>.MuiPaper-root': {
					'&>:nth-child(3)': {
						minHeight: ({ mapGridCardActiveTap, mapGridCardActivated, userGridViewFilters, dockMenu }) =>
							mapGridCardActiveTap === 0
								? mapGridCardActivated === 'exp'
									? 'calc(91vh - 233px)'
									: dockMenu === 'bottom'
										? userGridViewFilters?.length > 0
											? 'calc(58.75vh - 320px)'
											: 'calc(58.75vh - 280px)'
										: userGridViewFilters?.length > 0
											? 'calc(58.75vh - 275px)'
											: 'calc(58.75vh - 235px)'
								: mapGridCardActivated === 'exp'
									? 'calc(91vh - 183px)'
									: 'calc(58.75vh - 183px)',
						'@media (max-height:930px)': {
							maxHeight: ({ dockMenu }) => {
								if (dockMenu === 'bottom' || dockMenu === 'top') {
									return 'calc(50vh - 590px)';
								} else if (dockMenu === 'left' || dockMenu === 'right') {
									return 'calc(100vh - 204px)';
								} else if (dockMenu === 'full') {
									return 'calc(100vh - 153px)';
								} else {
									return '';
								}
							},
						},
						'@media (max-height:1600px)': {
							maxHeight: ({ dockMenu, userGridViewFilters }) => {
								if (dockMenu === 'bottom' || dockMenu === 'top') {
									return 'calc(50vh - 135px)';
								} else if (dockMenu === 'left' || dockMenu === 'right') {
									return userGridViewFilters?.length > 0 ? 'calc(100vh - 235px)' : 'calc(100vh - 200px)';
								} else if (dockMenu === 'full') {
									return userGridViewFilters?.length ? 'calc(100vh - 275px)' : 'calc(100vh - 183px)';
								} else {
									return '';
								}
							},
						},
					},
				},
			},
		},
		tapsLabelsButtons: {
			boxShadow: 'none',
			backgroundColor: '#fff',
			color: '#757575',
			'&:hover': { boxShadow: 'none !important' },
		},
		tapsLabelsButtonsSelected: {
			boxShadow: 'none',
			color: '#fff',
			backgroundColor: theme.palette.secondary.main,
			'&:hover': { color: '#757575', boxShadow: 'none !important' },
		},
		viewportWells: {
			textAlign: ({ viewportWells }) => (viewportWells ? 'inherit' : 'center'),
			'& #minimumZoomRequired': {
				margin: '30px',
				fontSize: '1.25rem',
				fontFamily: 'Poppins',
				fontWeight: '500',
				lineHeight: '1.6',
				display: ({ viewportWells }) => (viewportWells ? 'none' : 'block'),
			},
			'& #viewportWellsTable': {
				display: ({ viewportWells }) => (viewportWells ? 'block' : 'none'),
			},
		},
		selectBoundary: {
			background: 'white',
			width: '180px',
			height: '35px',
			marginTop: '6px',
			marginBottom: '6px',
			marginLeft: '10px',
			'& .MuiSelect-select.MuiSelect-select': {
				paddingLeft: '10px',
			},
		},
	};
});

const SELECTED_DATASET_GRID_WIDTH = 12;
const NON_SELECTED_DATASET_GRID_WIDTH = 10;

function MapGridCard() {
	// contexts
	const [stateApp] = useContext(AppContext);

	const { layerGridCard, mapControlsStateValues } = mapControlsController.useState(
		['selectedLayer', 'selectedDataset', 'layerGridCard', 'mapGridCardActivated'],
		'mapControlsStateValues'
	);
	const layerInitialData = platformDataInitialData.find(data => data.value === 'layer');
	// function state
	const [searchTapValue, SearchTapValue] = useState(
		mapControlsStateValues.layerGridCard ? layerInitialData : platformDataInitialData[0]
	);

	// selectors
	const mapLayersPanelExtended = useSelector(({ MainMap }) => MainMap.mapLayersPanelExtended);
	const userGridViewFilters = useSelector(({ session }) => session.userGridViewSettings?.filters);

	const onClose = useCallback(e => {
		e.stopPropagation();
		mapControlsController.updateState({ selectedDataset: null, mapGridCardActivated: false });
		layerFiltersController.clearSnapGridFilters();
	}, []);

	const shapeFileTableOverride = useMemo(() => {
		// generic generateFileFilters used for files so that it remain consistent in all places.
		if (mapControlsStateValues?.selectedLayer) {
			const fileQuery = generateFileFilters({ fileLayer: mapControlsStateValues.selectedLayer });
			const fileId = mapControlsStateValues.selectedLayer?.file;
			const layerIdentifier = mapControlsStateValues?.selectedLayer?.layerIdentifier;

			const globalLayer = layerController
				.getValue('layers')
				?.find(layer => layer?.layerIdentifier === layerIdentifier && layer?.file === fileId);

			const layerDataSourceName = `${fileId}_${layerIdentifier}`;
			tableGlobalController.reInitialized();
			return {
				filterLayerType: layerDataSourceName,
				maxTableHeight: '45vh',
				layerSchema: mapControlsStateValues?.selectedLayer?.layerSchema || globalLayer?.layerSchema,
				toolbarInternalActions: {
					onClose,
					style: {
						marginRight: '0.5rem',
					},
				},
				defaultFilters: fileQuery?.variables?.filters || [],
				advanceSearch: fileQuery?.variables?.search?.advanceSearch || [],
				layerDataSourceName,
			};
		} else {
			return {};
		}
	}, [mapControlsStateValues.selectedLayer, onClose]);

	React.useEffect(() => {
		if (!mapControlsStateValues.layerGridCard) {
			SearchTapValue(platformDataInitialData[0]);
		} else {
			SearchTapValue(layerInitialData);
		}
	}, [layerGridCard, layerInitialData, mapControlsStateValues.layerGridCard]);

	const setSearchTapValue = state => {
		if (searchTapValue !== state) {
			SearchTapValue(state);
		}
	};

	// styles
	const classes = useStyles({
		dockMenu: 'bottom',
		mapLayersPanelExtended,
		mapGridCardActivated: mapControlsStateValues.mapGridCardActivated,
		viewportWells: stateApp.viewportWells,
		userGridViewFilters,
		// screenSizes
	});

	const handleSearchPanelChange = value => {
		setSearchTapValue(value);
	};

	const CardReturn = () => {
		return (
			<Card className={`${mapControlsStateValues.mapGridCardActivated === 'exp' ? 'noDrag' : ''} ${classes.dockMenu}`}>
				<div
					id="snapGrid"
					className={`cancelDraggableEffect ${classes.mainPanelsDiv}`}
					style={{ position: 'relative' }}
				>
					<Grid container direction="row" style={{ height: '100%', marginBottom: '20px' }}>
						{mapControlsStateValues?.selectedDataset?.name === 'M1 Platform' && (
							<Grid item md={2} style={{ backgroundColor: '#F2F2F2' }}>
								<Typography variant="h6" component="h1" style={{ fontWeight: 'bold', padding: '10px 0px 0px 20px' }}>
									M1 Platform
								</Typography>

								<List
									component="nav"
									aria-label="main mailbox folders"
									style={{ height: 'calc(50vh - 29px)', overflowY: 'auto' }}
								>
									{[...platformDataWellsInitialData, ...snapGridSideBarData].map(row => {
										const Icon = row.Icon;
										return (
											<FeatureFlag
												key={row.value}
												feature={FEATURES[row.featureFlag]}
												noCheck={!FEATURES[row.featureFlag]}
											>
												<ListItem
													button
													selected={row.value === searchTapValue.value}
													onClick={() => handleSearchPanelChange(row)}
												>
													<ListItemIcon>
														<Icon />
													</ListItemIcon>
													<ListItemText primary={row.gridLabel || row.label} />
												</ListItem>
											</FeatureFlag>
										);
									})}
								</List>
							</Grid>
						)}

						{mapControlsStateValues.selectedDataset &&
							mapControlsStateValues.selectedDataset?.name !== 'M1 Platform' && (
								<Grid item md={2} style={{ backgroundColor: '#F2F2F2' }}>
									<Typography variant="h6" component="h1" style={{ fontWeight: 'bold', padding: '10px 0px 0px 20px' }}>
										{mapControlsStateValues.selectedDataset?.name}
									</Typography>

									<List
										component="nav"
										aria-label="main mailbox folders"
										style={{ height: 'calc(50vh - 29px)', overflowY: 'auto' }}
									>
										{mapControlsStateValues.selectedDataset?.categories.map(row => {
											const Icon = mapControlsStateValues.selectedDataset?.Icon;
											return (
												<ListItem
													key={row.name}
													button
													selected={row.name === mapControlsStateValues.selectedLayer?.name}
													onClick={() => {
														mapControlsController.updateState({ selectedLayer: { ...row } });
														tableGlobalController.reInitialized();
													}}
												>
													<ListItemIcon>
														<Icon />
													</ListItemIcon>
													<ListItemText style={{ wordWrap: 'break-word' }} primary={row.name} />
												</ListItem>
											);
										})}
									</List>
								</Grid>
							)}

						<Grid
							item
							md={
								mapControlsStateValues.selectedDataset ? NON_SELECTED_DATASET_GRID_WIDTH : SELECTED_DATASET_GRID_WIDTH
							}
						>
							<div style={{ position: 'relative' }} className={classes.gridTables}>
								<Fragment>
									{searchTapValue.value === 'well' && (
										<MRTTable
											name="WellsTable"
											overrideMeta={{
												toolbarInternalActions: {
													onClose,
													style: {
														marginRight: '0.5rem',
													},
												},
												maxTableHeight: '45vh',
												filterLayerType: 'Wells',
												layerDataSourceName: 'Wells',
											}}
										/>
									)}
									{searchTapValue.value === 'owner' && (
										<MRTTable
											name="TaxOwnerTable"
											overrideMeta={{
												toolbarInternalActions: {
													onClose,
													style: {
														marginRight: '0.5rem',
													},
												},
												maxTableHeight: '45vh',
											}}
										/>
									)}
									{searchTapValue.value === 'layer' && (
										<MRTTable name="ShapesFilesGenericTable" overrideMeta={shapeFileTableOverride} />
									)}
									{searchTapValue.value === 'contacts' && <MRTTable name="ContactTable" />}
									{searchTapValue.value === 'unit' && (
										<MRTTable
											name="UnitTable"
											overrideMeta={{
												toolbarInternalActions: {
													onClose,
													style: {
														marginRight: '0.5rem',
													},
												},
												maxTableHeight: '45vh',
												filterLayerType: 'Units',
												layerDataSourceName: 'Units',
											}}
										/>
									)}
									{searchTapValue.value === 'agreement' && (
										<MRTTable
											name="AgreementTable"
											overrideMeta={{
												toolbarInternalActions: {
													onClose,
													style: {
														marginRight: '0.5rem',
													},
												},
												maxTableHeight: '45vh',
												filterLayerType: 'Agreements',
												layerDataSourceName: 'Agreements',
											}}
										/>
									)}

									{searchTapValue.value === 'tract' && (
										<MRTTable
											name="TractsTable"
											overrideMeta={{
												toolbarInternalActions: {
													onClose,
													style: {
														marginRight: '0.5rem',
													},
												},
												maxTableHeight: '45vh',
												filterLayerType: 'Parcels',
												layerDataSourceName: 'Parcels',
											}}
										/>
									)}
									{searchTapValue.value === 'mywell' && (
										<MRTTable
											name="MyWellsTable"
											overrideMeta={{
												toolbarInternalActions: {
													onClose,
													style: {
														marginRight: '0.5rem',
													},
												},
												maxTableHeight: '45vh',
												filterLayerType: 'My Wells',
												layerDataSourceName: 'My Wells',
											}}
										/>
									)}
								</Fragment>
							</div>
						</Grid>
					</Grid>
				</div>
			</Card>
		);
	};

	// black
	// darken
	const blackOut = () => (
		<div
			style={{
				position: 'fixed',
				top: '0',
				left: '0',
				width: '100vw',
				height: '100vh',
				backgroundColor: 'rgba(0, 0, 0, 0.5)',
				// zIndex: "1299",
				zIndex: '1199',
			}}
			onClick={() => {
				mapControlsController.updateState({ mapGridCardActivated: true });
			}}
		/>
	);

	return (
		<div className={classes.card}>
			{mapControlsStateValues.mapGridCardActivated === 'min' ? CardReturn() : CardReturn()}
			{mapControlsStateValues.mapGridCardActivated === 'exp' && blackOut()}
		</div>
	);
}

function areEqual(prevProps, nextProps) {
	return Object.is(prevProps.mapGridCardActivated, nextProps.mapGridCardActivated);
}

export default React.memo(MapGridCard, areEqual);
