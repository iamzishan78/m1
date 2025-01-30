import React, { useEffect, useContext, useState, memo } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles';
import AspectRatioOutlinedIcon from '@material-ui/icons/AspectRatioOutlined';
import SyncSharpIcon from '@mui/icons-material/SyncSharp';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import LanguageIcon from '@material-ui/icons/Language';
import LayersIcon from '@material-ui/icons/Layers';
import MenuIcon from '@material-ui/icons/Menu';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import { drawController } from 'hookstate/drawStateController';
import { globalStateController } from 'hookstate/globalStateController';
import { mapControlsController } from 'hookstate/mapControlsController';
import { mapStateController } from 'hookstate/mapStateController';
import { popupController } from 'hookstate/popupStateController';

import { clearMapAndCloseShapeActionsPopup } from './commonHelper';
import { AppContext } from '../../AppContext';
import { default as Cube3d } from '../Shared/svgIcons/cube-3d';

const useStyles = makeStyles(theme => ({
	root: {
		// backgroundColor:'rgba(1, 17, 51, 0.97)',
		borderRadius: '50%',
		border: 0,
		// backgroundColor: "rgba(1, 17, 51, 0.97)",
		// backgroundColor: "#0e111a",
		// color: "lightGray",
		'&:hover': {
			color: '#fff',
			// background: "rgba(1, 17, 51, 1.0)",
		},
	},
	selected: {
		// color: "lightGray !important",
		// background: "rgba(1, 17, 51, 0.0) !important",
	},
	speedDial: {
		position: 'absolute',
		top: '100px',
		right: theme.spacing(2),
		// backgroundColor: "rgba(1, 17, 51, 0.0)",
		padding: '0px',
		zIndex: 5,
	},
	menuIcon: {
		padding: '0px',
		margin: '0px',
		backgroundColor: 'rgba(1, 17, 51, 0.97)',
		// backgroundColor: "#0e111a",

		color: 'lightGray',
		'&:hover': {
			color: '#fff',
			background: 'rgba(1, 17, 51, 1.0)',
		},
	},
	speedIcon: {
		// backgroundColor: "rgba(1, 17, 51, 0.97)",
		backgroundColor: '#0e111a',

		color: 'lightGray',
		'&:hover': {
			color: '#fff',
			// background: "rgba(1, 17, 51, 1.0)",
		},
	},
	fab: {
		// backgroundColor: "rgba(1, 17, 51, 0.97)",
		borderRadius: '0%',
		backgroundColor: '#0e111a',
		color: 'lightGray',
		'&:hover': {
			color: '#fff',
			// background: "rgba(1, 17, 51, 1.0)",
			backgroundColor: fade(theme.palette.common.white, 0.25),
		},
	},
	fabActivated: {
		// backgroundColor: "rgba(1, 17, 51, 0.97)",
		borderRadius: '0%',
		backgroundColor: '#0e111a',
		color: 'rgba(23, 170, 221, 1)',
		'&:hover': {
			color: '#fff',
			// background: "rgba(1, 17, 51, 1.0)",
			backgroundColor: fade(theme.palette.common.white, 0.25),
		},
	},
	toggleButton: {
		// backgroundColor: "rgba(1, 17, 51, 0)",
		border: '0px',
	},
	hidePrimary: {
		display: 'none !important',
	},
}));

export function SpeedDialComponent(props) {
	const [toggle3d, setToggle3d] = useState(false);

	const { mapControlsStateValues } = mapControlsController.useState(
		['openSpeedDial', 'selectedMapControl', 'selectedControl'],
		'mapControlsStateValues'
	);

	const { selectedUserDefinedLayer, expandedCard, popupStateValues } = popupController.useState(
		['selectedUserDefinedLayer', 'expandedCard'],
		'popupStateValues'
	);
	const { selectedAbstracts, shapeToExtend, drawStateValues } = drawController.useState(
		['selectedAbstracts', 'shapeToExtend', 'editDraw'],
		'drawStateValues'
	);

	const [stateApp, setStateApp] = useContext(AppContext);
	const classes = useStyles();

	useEffect(() => {
		mapControlsController.updateState({ openSpeedDial: props.openSpeedDial, expandedPanel: props.expandedPanel });
	}, [props.expandedPanel, props.openSpeedDial]);

	useEffect(() => {
		if (popupStateValues.selectedUserDefinedLayer || drawStateValues.shapeToExtend) {
			mapControlsController.updateState({ selectedMapControl: 'draw', selectedControl: 'layer' });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedUserDefinedLayer, shapeToExtend]);

	useEffect(() => {
		if (drawStateValues.selectedAbstracts.length > 0) {
			drawController.updateState({
				showDrawShapesPopup: true,
			});
			mapControlsController.updateState({ selectedMapControl: 'draw', selectedControl: 'layer' });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedAbstracts]);

	const handleOpen = () => {
		mapControlsController.updateState({ openSpeedDial: true });
	};

	const handleCloseLeftSidePanel = () => {
		mapControlsController.setState({ expandedPanel: false });
	};

	const handleCloseShapeDrawer = () => {
		drawController.reset();

		// Removing layer of AOI Label
		if (window.mapRef?.getLayer('aoi_label_layer')) {
			window.mapRef?.removeLayer('aoi_label_layer');
		}

		const sourceId = globalStateController.getValue('abstract_geo')?.sourceId;

		if (!sourceId) {
			return;
		}

		// unselecting the grids
		const featuresList = window.mapRef?.getSource(sourceId)?._data?.features || [];
		for (let i = 0; i < featuresList.length; i++) {
			const id = featuresList[i].properties.Id;
			window.mapRef?.setFeatureState({ source: sourceId, id: id }, { click: false });
		}
	};

	const handleCloseDetailedCards = () => {
		// close detailed cards
		popupController.reset();

		// close doc viewer
		setStateApp(state => ({
			...state,
			viewDoc: null,
		}));
	};

	const handleFabClick = (e, action) => {
		if (popupController.getValue('expandedCard') === true) {
			handleCloseLeftSidePanel();
			handleCloseShapeDrawer();
		}

		if (e && action) {
			let anchorEl = e.currentTarget;

			if (action === 'track') {
				anchorEl = null;
				handleCloseLeftSidePanel();
				handleCloseShapeDrawer();
				handleCloseDetailedCards();

				mapControlsController.toggleMapGridCardAtived();
			}

			if (action === 'base' || action === 'heatMaps' || action === 'layer') {
				mapControlsController.updateState({
					selectedControl: action,
					expandedPanel:
						action === mapControlsController.getValue('selectedControl') &&
						mapControlsController.getValue('expandedPanel')
							? false
							: true,
					anchorEl: anchorEl,
				});

				handleCloseDetailedCards();
			}

			if (action === 'draw') {
				mapControlsController.updateState({
					selectedMapControl: action,
				});

				if (!drawStateValues.editDraw) {
					popupController.updateState({
						popupOpen: false,
					});
					drawController.setState({
						showDrawShapesPopup: true,
						showAddShapePopup: false,
						editDraw: true,
					});
				} else {
					clearMapAndCloseShapeActionsPopup(stateApp, setStateApp);
				}
			}
		}

		if (action === 'threed') {
			mapStateController.updateState({ toggle3d: !mapStateController.getValue('toggle3d') });
		}

		if (action === 'zoomout') {
			mapStateController.updateState({ toggleZoomOut: !mapStateController.getValue('toggleZoomOut') });
		}

		if (action === 'syncMap') {
			mapStateController.updateState({ isMapRefreshing: true });
		}

		if (window.drawRef && window.drawRef.getMode() !== 'simple_select') {
			drawController.updateState({
				editDraw: false,
			});
			window.drawRef.changeMode('simple_select');
		}
	};

	const actions = [
		// {
		//   icon: mapGridCardActiveTap === 1 && mapControlsStateValues.mapGridCardActivated ? <GpsFixedIcon /> : <GpsNotFixedIcon />,
		//   name: "Tracked",
		//   action: "track",
		// },
		{ icon: <LanguageIcon id="base" />, name: 'Base Map', action: 'base' },
		{ icon: <LayersIcon id="layer" />, name: 'Layers', action: 'layer' },
		// {
		//   icon: <GradientIcon id="heatMaps" />,
		//   name: "Heatmaps",
		//   action: "heatMaps",
		// },
		{
			icon: !drawStateValues.editDraw ? <EditIcon id="mapEditIcon" /> : <CancelIcon />,
			name: 'Draw',
			action: 'draw',
		},
		{
			icon: <Cube3d />,
			name: 'Toggle 3D',
			action: 'threed',
		},
		{
			icon: <AspectRatioOutlinedIcon />,
			name: 'Zoom To Default Map Position',
			action: 'zoomout',
		},
		{
			icon: <SyncSharpIcon />,
			name: 'Sync Map',
			action: 'syncMap',
		},
	];

	useEffect(() => {
		if (popupStateValues.expandedCard) {
			handleFabClick();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [expandedCard]);

	return (
		<div>
			<SpeedDial
				id="speed"
				ariaLabel="SpeedDial"
				className={classes.speedDial}
				icon={
					<MenuIcon fontSize="small" onClick={mapControlsController.toggleSpeedDial} className={classes.menuIcon} />
				}
				onOpen={handleOpen}
				open={mapControlsStateValues.openSpeedDial}
				direction="down"
				FabProps={{ classes: { primary: classes.hidePrimary }, size: 'medium' }}
			>
				{actions.map(action => {
					return (
						<SpeedDialAction
							classes={{
								fab:
									action.action === mapControlsStateValues.selectedControl || (toggle3d && action.action === 'threed')
										? classes.fabActivated
										: classes.fab,
							}}
							id={action.name}
							key={action.name}
							icon={action.icon}
							tooltipTitle={action.name}
							onClick={e => {
								if (action.action === 'threed') {
									setToggle3d(prevState => !prevState);
								}
								handleFabClick(e, action.action);
							}}
						/>
					);
				})}
			</SpeedDial>
		</div>
	);
}

export default memo(SpeedDialComponent);
