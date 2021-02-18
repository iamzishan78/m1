import React, { useContext, useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import RootRef from "@material-ui/core/RootRef";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import DragIndicator from "@material-ui/icons/DragIndicator";
import Button from "@material-ui/core/Button";
import { MapControlsContext } from "../../../MapControls/MapControlsContext";
import { AppContext } from "../../../../AppContext";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import ClickIcon from "../../svgIcons/cursor-click.js";
import UserDefined from "../../svgIcons/user-defined.js";
import ColorControl from "../../svgIcons/color-control.js";
import LayersIcon from "@material-ui/icons/Layers";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import MapDarkIcon from "../../svgIcons/MapDarkIcon";
import MapOutdoorIcon from "../../svgIcons/MapOutdoorIcon";
import MapSatelliteIcon from "../../svgIcons/MapSatelliteIcon";
import MapLightIcon from "../../svgIcons/MapLightIcon";
import MapBasicIcon from "../../svgIcons/MapBasicIcon";
import Collapse from "@material-ui/core/Collapse";
import Select from "@material-ui/core/Select";
import { Tooltip, FormControlLabel, Switch } from "@material-ui/core";
import { UPDATELAYERSETTINGS } from "../../../../graphQL/useMutationUpdateLayerSettings";
import { useMutation } from "@apollo/client";
import Box from "@material-ui/core/Box";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { deepEqualObjects } from "../../functions";
import StarIcon from "@material-ui/icons/Star";
import ListIcon from "@material-ui/icons/List";
import BusinessIcon from "@material-ui/icons/Business";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";

const theme = createMuiTheme({
	overrides: {
		MuiSvgIcon: {
			root: {
				width: 90,
				height: 60,
			},
		},
		MuiListItemText: {
			root: {
				textAlign: "center",
			},
		},
	},
});

const useStyles = makeStyles((theme) => ({
	pulloutBox: {
		height: "100px",
		color: "white",
		width: "20px",
		background: "#011133",
		cursor: "pointer",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		"& svg": {
			transform: "scaleX(0.5)",
		},
	},
	subHeaderItem: {
		backgroundColor: "#011133 !important",
		minWidth: "400px",
	},
	list: {
		padding: 0,
	},
	nested: {
		paddingLeft: theme.spacing(6),
		paddingRight: theme.spacing(6),
	},
	disabledLayerTitle: {
		"& span": { color: "rgb(127, 149, 199) !important" },
	},
	boxtext: {
		textAlign: "center",
		margin: "auto",
	},
	imageBox: {
		display: "grid",
		gridTemplateColumns: "1fr 1fr 1fr",
		backgroundColor: "#263451",
		"& :nth-child(1)": {
			float: "left",
			display: "grid",
		},
		"& :nth-child(2)": {
			float: "left",
			display: "grid",
		},
		"& :nth-child(3)": {
			display: "grid",
		},
		"& :nth-child(4)": {
			float: "left",
			display: "grid",
		},
		"& :nth-child(5)": {
			display: "grid",
			float: "left",
		},
	},
}));

function Panel({ type, title, headerButton, handleToggle, onDragEnd, items }) {
	const { basinLayerColor, GLOUnitsColor, GLOLeasesColor } = useSelector(
		({ MainMap }) => MainMap
	);
	const [stateMapControls, setStateMapControls] = useContext(
		MapControlsContext
	);
	const [stateApp, setStateApp] = useContext(AppContext);
	const [view, setView] = React.useState("All");
	const [sortBy, setSortBy] = React.useState("Recently Posted");

	const classes = useStyles();

	const [layerMap, setLayerMap] = useState([]);
	const [open, setOpen] = useState(true);
	const [mapStyles, setMapStyles] = useState([]);
	const [currentLayers, setCurrentLayers] = useState(items);

	const [updateLayerSettings] = useMutation(UPDATELAYERSETTINGS);

	useEffect(() => {
		if (type === "base") {
			const req = new Request(
				"https://api.mapbox.com/styles/v1/m1neral?access_token=sk.eyJ1IjoibTFuZXJhbCIsImEiOiJjazdkbGg1YXAwMjVqM2VwanZzbm95Z2dvIn0.cdoQNZU42xxbybyGxlBNkw",
				{
					method: "GET",
					mode: "cors",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						"Cache-Control": "max-age=0",
					},
				}
			);

			const abortController = new AbortController();
			const signal = abortController.signal;

			fetch(req, { signal: signal })
				.then((results) => results.json())
				.then((data) => {
					setMapStyles(data.slice(0, 5));
				});

			//clean up
			return function cleanup() {
				abortController.abort();
			};
		}
	}, [type]);

	console.log("props", {
		type,
		title,
		headerButton,
		handleToggle,
		onDragEnd,
		items,
	});

	useEffect(() => {
		console.log("type and layer", type, items);
		if (
			(type === "layer" || type === "heatMaps" || type === "marketplace") &&
			items
		) {
			setLayerMap(items);
		} else if (type === "base" && items) {
			setLayerMap(
				items.filter((item) => item.name !== "Water" && item.name !== "Land")
			);
		}
	}, [
		stateMapControls.selectedControl,

		items,
		stateApp.checkedBaseLayers,
		stateApp.checkedHeatLayers,
		type,
	]);

	const handleClick = () => {
		setOpen(!open);
	};

	const togglePullout = () => {
		setStateMapControls((stateMapControls) => ({
			...stateMapControls,
			panelExpanded: !stateMapControls.panelExpanded,
		}));
	};

	const handleToggleInteraction = (layer, index) => () => {
		const currentLayers = [...items];
		const updatedLayer = {
			...layer,
			layerSettings: {
				...layer.layerSettings,
				interaction: {
					...layer.layerSettings.interaction,
					interactionDetail: {
						hover: !layer.layerSettings.interaction.interactionDetail.hover,
						click: !layer.layerSettings.interaction.interactionDetail.click,
					},
				},
			},
		};

		//// saving to stateApp
		currentLayers[index] = updatedLayer;
		setStateApp((stateApp) => ({ ...stateApp, layers: [...currentLayers] }));

		//// saving to mongo
		updateLayerSettings({
			variables: {
				settings: {
					_id: updatedLayer._id,
					layerSettings: updatedLayer.layerSettings,
				},
			},
		});
	};

	const StyledMenu = withStyles({
		// paper: {
		// 	position: "absolute",
		// 	border: "1px solid #011133",
		// },
	})((props) => (
		// <Menu
		// 	elevation={0}
		// 	variant="menu"
		// 	transitionDuration={0}
		// 	getContentAnchorEl={null}
		// 	// anchorOrigin={{
		// 	//   vertical: "top",
		// 	//   horizontal: "left",
		// 	// }}
		// 	MenuListProps={{
		// 		disablePadding: true,
		// 	}}
		// 	// transformOrigin={{
		// 	//   vertical: "top",
		// 	//   horizontal: "right",
		// 	// }}
		// 	{...props}
		// />
		<Paper
			elevation={0}
			variant="elevation"
			{...props}
			// style={{
			// 	maxWidth: "500px",
			// 	width: "500px",
			// 	position: "absolute",
			// 	//left: "30px !important",
			// 	top: "90px !important",
			// 	left: stateMapControls.panelExpanded
			// 		? "-30px !important"
			// 		: "-500px !important",
			// }}
			// transitionDuration={0}
			// getContentAnchorEl={null}
			// anchorOrigin={{
			// 	vertical: "top",
			// 	horizontal: "left",
			// }}
			// MenuListProps={{
			// 	disablePadding: true,
			// }}
			// transformOrigin={{
			// 	vertical: "top",
			// 	horizontal: "right",
			// }}
		/>
	));

	const defaultProps = {
		borderLeft: 4,
	};

	const MarketplaceDropdown = withStyles((theme) => ({
		icon: {
			color: "white",
			fill: "white",
		},
		root: {
			fontFamily: "Poppins",
			display: "flex",
			fontWeight: "light",
			justifyContent: "space-between",
			color: "white",
			minWidth: "8rem",
			// "&:hover": {
			// 	background: "#4B618F",
			// },
			// backgroundColor: "#263451",
			"& .MuiListItemIcon-root, & .MuiListItemText-primary": {
				color: theme.palette.common.white,
			},
			"& .MuiButton-textPrimary": {
				color: theme.palette.common.white,
				background: "#17acdd",
				padding: "3px 10px",
			},
		},
	}))(Select);

	const StyledMenuHeaderItem = withStyles((theme) => ({
		root: {
			fontFamily: "Poppins",
			display: "flex",
			justifyContent: "space-between",
			"&:hover": {
				background: "#4B618F",
			},
			backgroundColor: "#263451",
			"& .MuiListItemIcon-root, & .MuiListItemText-primary": {
				color: theme.palette.common.white,
			},
			"& .MuiButton-textPrimary": {
				color: theme.palette.common.white,
				background: "#17acdd",
				padding: "3px 10px",
			},
		},
	}))(MenuItem);

	const StyledMenuItem = withStyles((theme) => ({
		root: {
			fontFamily: "Poppins",
			display: "block",
			color: "white",
			"&:hover": {
				background: "#4B618F",
			},

			backgroundColor: "#263451",
			"& .MuiListItemIcon-root, & .MuiListItemText-primary": {
				color: theme.palette.common.white,
				// },
			},
		},
	}))(MenuItem);

	const StyledListItemSecondaryAction = withStyles((theme) => ({
		root: {
			"& .MuiButton-textPrimary": {
				color: theme.palette.common.white,
				background: "#17acdd",
				padding: "3px 10px",
			},
		},
	}))(ListItemSecondaryAction);

	const MarketPlaceListItem = withStyles((theme) => ({
		root: {
			fontFamily: "Poppins",
			// "&:hover": {
			// 	background: "#cccccc",
			// },
			display: "flex",

			alignItems: "center",
			marginBottom: "0.4rem",
			color: "black",
			border: "1px solid grey",
			backgroundColor: "white",
			display: "flex",
			flexDirection: "column",
			"& .MuiListItemIcon-root, & .MuiListItemText-primary": {
				color: theme.palette.common.white,
			},
			"& .MuiListItemText-primary svg": {
				marginLeft: "5px",
				verticalAlign: "middle",
			},
		},
	}))(ListItem);

	const MarketPlaceHeader = withStyles((theme) => ({
		root: {
			fontFamily: "Poppins",
			"&:hover": {
				background: "#4B618F",
			},
			display: "flex",
			justifyContent: "space-between",
			backgroundColor: "#263451",
			"& .MuiListItemIcon-root, & .MuiListItemText-primary": {
				color: theme.palette.common.white,
			},
			"& .MuiListItemText-primary svg": {
				marginLeft: "5px",
				verticalAlign: "middle",
			},
		},
	}))(ListItem);

	const MarketPlaceUpper = withStyles((theme) => ({
		root: {
			fontFamily: "Poppins",
			// "&:hover": {
			// 	background: "#cccccc",
			// },
			color: "black",

			display: "flex",
			flexDirection: "row",
			justifyContent: "space-between",
			"& .MuiListItemIcon-root, & .MuiListItemText-primary": {
				color: theme.palette.common.white,
			},
			"& .MuiListItemText-primary svg": {
				marginLeft: "5px",
				verticalAlign: "middle",
			},
		},
	}))(ListItem);

	const MarketPlaceLower = withStyles((theme) => ({
		root: {
			fontFamily: "Poppins",
			// "&:hover": {
			// 	background: "#cccccc",
			// },
			color: "black",
			backgroundColor: "white",
			display: "flex",
			flexDirection: "row",
			"& .MuiListItemIcon-root, & .MuiListItemText-primary": {
				color: theme.palette.common.white,
			},
			"& .MuiListItemText-primary svg": {
				marginLeft: "5px",
				verticalAlign: "middle",
			},
		},
	}))(ListItem);

	const MarketPlaceLowerItems = withStyles((theme) => ({
		root: {
			fontFamily: "Poppins",
			// "&:hover": {
			// 	background: "#cccccc",
			// },
			color: "black",
			width: "6rem",
			marginRight: "3px",
			backgroundColor: "white",
			padding: "0",
			display: "flex",
			flexDirection: "column",
			alignItems: "flex-start",
			// textAlign: "center",
			"& .MuiListItemIcon-root, & .MuiListItemText-primary": {
				color: theme.palette.common.white,
			},
			"& .MuiListItemText-primary svg": {
				//marginLeft: "5px",
				verticalAlign: "middle",
			},
		},
	}))(ListItem);

	const StyledListItem = withStyles((theme) => ({
		root: {
			fontFamily: "Poppins",
			"&:hover": {
				background: "#4B618F",
			},
			backgroundColor: "#263451",
			"& .MuiListItemIcon-root, & .MuiListItemText-primary": {
				color: theme.palette.common.white,
			},
			"& .MuiListItemText-primary svg": {
				marginLeft: "5px",
				verticalAlign: "middle",
			},
		},
	}))(ListItem);

	const StyledListItem2 = withStyles((theme) => ({
		root: {
			fontFamily: "Poppins",
			"&:hover": {
				background: "#a3b2cf",
			},
			backgroundColor: "#4B618F",
			"& .MuiListItemIcon-root, & .MuiListItemText-primary": {
				color: theme.palette.common.white,
			},
		},
	}))(ListItem);

	const ifLayerHaveData = (layer) => {
		//// temporary disabling the Title Layer
		if (layer.identifier === "Title") return false;
		////

		if (
			(layer.identifier === "User Tags" &&
				!(
					stateApp.wellListFromTagsFilter &&
					stateApp.wellListFromTagsFilter.length > 0
				)) ||
			(layer.identifier === "Search" &&
				!(
					stateApp.wellListFromSearch && stateApp.wellListFromSearch.length > 0
				)) ||
			(layer.identifier === "Tracked Wells" &&
				!(stateApp.trackedwells && stateApp.trackedwells.length > 0)) ||
			(layer.identifier === "Tracked Owners" &&
				!(stateApp.trackedOwnerWells && stateApp.trackedOwnerWells.length > 0))
		)
			return false;
		return true;
	};

	const handleColorPicker = (layer) => {
		setStateMapControls((stateMapControls) => ({
			...stateMapControls,
			selectedLayer: layer,
		}));
	};

	const getLayerName = (layer) => {
		if (type === "marketplace") {
			return layer.layerName;
		}
		if (type !== "layer") return layer.name;

		if (layer.layerCategory == "M1 Layer") {
			return layer.layerName;
		} else {
			return (
				<>
					<span>{layer.layerName}</span>
					<UserDefined />
				</>
			);
		}
	};

	const getLayerColor = (layer) => {
		// layerName: "Rig Activity"
		if (type !== "layer") return {};

		if (layer) {
			if (layer.identifier == "Rig Activity") return "#263451";

			if (
				layer.layerPaintProps &&
				layer.layerPaintProps[0] &&
				layer.layerPaintProps[0].paintProps
			) {
				if (layer.layerPaintProps[0].paintProps["circle-color"])
					return layer.layerPaintProps[0].paintProps["circle-color"];
				if (layer.layerPaintProps[0].paintProps["fill-color"])
					return layer.layerPaintProps[0].paintProps["fill-color"];
				if (layer.layerPaintProps[0].paintProps["line-color"])
					return layer.layerPaintProps[0].paintProps["line-color"];
				if (layer.layerPaintProps[0].paintProps["icon-color"])
					return layer.layerPaintProps[0].paintProps["icon-color"];
			}

			if (
				layer.layerPaintProps &&
				layer.layerPaintProps.ids &&
				layer.layerPaintProps.ids[0]
			) {
				if (layer.layerPaintProps.ids[0] == "basinLayer")
					return basinLayerColor;
				if (layer.layerPaintProps.ids[0] == "GLOUnits") return GLOUnitsColor;
				if (layer.layerPaintProps.ids[0] == "GLOLeases") return GLOLeasesColor;
			}
		}
		return "#263451";
	};

	const getBasemapImageBox = () => {
		return (
			<>
				<div className={classes.imageBox}>
					{mapStyles.map((style) => (
						<StyledMenuItem
							disableRipple
							key={style.id}
							role={undefined}
							onClick={() => {
								setStateApp((stateApp) => ({
									...stateApp,
									mapVars: { ...stateApp.mapVars, styleId: style.name },
								}));

								// handleClose();
							}}
						>
							<ThemeProvider theme={theme}>
								<div>{style.name == "Outdoors" && <MapOutdoorIcon />}</div>
								<div>{style.name == "Satellite" && <MapSatelliteIcon />}</div>
								<div>{style.name == "Light" && <MapLightIcon />}</div>
								<div>{style.name == "Dark" && <MapDarkIcon />}</div>
								<div>{style.name == "Basic" && <MapBasicIcon />}</div>
								<div className={classes.boxtext}>
									<ListItemText primary={style.name} />
								</div>
							</ThemeProvider>
						</StyledMenuItem>
					))}
				</div>

				<StyledListItem2 button onClick={handleClick}>
					<ListItemIcon>
						<LayersIcon />
					</ListItemIcon>
					<ListItemText primary={`${title} Layers`} />
					{open ? <ExpandLess /> : <ExpandMore />}
				</StyledListItem2>
			</>
		);
	};

	//   const WithBox = ({ children, layer, ...defaultProps }) => {
	//     console.log("Children default props", children, defaultProps);
	//     return type === "layer " ? (
	//       <Box borderColor={getLayerColor(layer)} {...defaultProps}>
	//         {children}
	//       </Box>
	//     ) : (
	//       { children }
	//     );
	//   };

	const getLayerControls = (layer, labelId, index) => {
		const control1 = layer.layerSettings.colorable && (
			<div
				style={{
					paddingRight: !layer.layerSettings.interaction.interactionAble
						? "40"
						: "",
				}}
			>
				<ListItemIcon onClick={() => handleColorPicker(layer)}>
					<Tooltip title="Layer Styling">
						<ColorControl />
					</Tooltip>
				</ListItemIcon>
			</div>
		);

		const control2 = layer.layerSettings.interaction.interactionAble && (
			<div
				style={{
					paddingRight: 20,
					height: "42px",
					width: "42px",
				}}
			>
				<Checkbox
					icon={
						<CancelOutlinedIcon
							htmlColor={
								!ifLayerHaveData(layer) ? "rgb(127, 149, 199)" : "#12abe0"
							}
						/>
					}
					checkedIcon={
						<ClickIcon
							color={!ifLayerHaveData(layer) ? "rgb(127, 149, 199)" : "#12abe0"}
						/>
					}
					edge="start"
					checked={layer.layerSettings.interaction.interactionDetail.click}
					tabIndex={-1}
					disableRipple
					inputProps={{
						"aria-labelledby": labelId,
					}}
					onChange={handleToggleInteraction(layer, index)}
				/>
			</div>
		);

		return (
			<>
				{control1}
				{control2}
			</>
		);
	};

	const getLayerChecked = ({ layer, index }) => {
		if (type === "layer" && layer) {
			return layer.layerSettings.visiable !== false;
		} else if (
			type === "base" &&
			typeof index === "number" &&
			stateApp.checkedBaseLayers
		) {
			return stateApp.checkedBaseLayers.indexOf(index) !== -1;
		} else if (
			type === "heatMaps" &&
			typeof index === "number" &&
			stateApp.checkedHeats
		) {
			return stateApp.checkedHeats.indexOf(index) !== -1;
		} else {
			return false;
		}
	};

	// const handleClose = () => {
	// 	setStateMapControls((stateMapControls) => ({
	// 		...stateMapControls,
	// 		anchorEl: null,
	// 	}));
	// };

	const checkIfNoLayerData = (layer) => {
		return type === "layer" && !ifLayerHaveData(layer);
	};

	const displayList = (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="droppableM1">
				{(provided, snapshot) => (
					<RootRef rootRef={provided.innerRef}>
						<List
							style={{
								maxHeight: "775px",
								overflowY: type === "marketplace" ? "scroll" : "hidden",
							}}
							className={classes.list}
						>
							{layerMap.map((layer, index) => {
								const labelId = `checkbox-list-label-${index}`;

								//// remove the (layer.identifier!="Tracked Owners") condition from the if statement to show the tracked owers layer
								if (
									type === "heatMaps" ||
									type === "base" ||
									type === "marketplace" ||
									(type === "layer" &&
										layer.layerSettings &&
										layer.layerSettings.showable &&
										layer.identifier != "Tracked Owners")
								) {
									return (
										<Draggable
											key={labelId}
											draggableId={labelId}
											index={type === "layer" ? layer.position : index}
										>
											{(provided, snapshot) => (
												<Box
													borderColor={getLayerColor(layer)}
													{...defaultProps}
												>
													{type === "marketplace" ? (
														<MarketPlaceListItem>
															<MarketPlaceUpper>
																<BusinessIcon />
																<span>Martin, TX - 308 NRA - Permian</span>
																<SupervisedUserCircleIcon />
																<StarIcon />
															</MarketPlaceUpper>
															<MarketPlaceLower>
																<MarketPlaceLowerItems>
																	<div>Asking Price</div>
																	<div>$127K</div>
																</MarketPlaceLowerItems>
																<MarketPlaceLowerItems>
																	<div>Avg. Revenue</div>
																	<div>$22K</div>
																</MarketPlaceLowerItems>
																<MarketPlaceLowerItems>
																	<div>Wells</div>
																	<div>26</div>
																</MarketPlaceLowerItems>
																<MarketPlaceLowerItems>
																	<div>Permits</div>
																	<div>3</div>
																</MarketPlaceLowerItems>
																<MarketPlaceLowerItems>
																	<div>Listing</div>
																	<ListIcon />
																</MarketPlaceLowerItems>
															</MarketPlaceLower>
														</MarketPlaceListItem>
													) : (
														<StyledListItem
															ContainerComponent="li"
															ref={provided.innerRef}
															{...provided.draggableProps}
														>
															<ListItemIcon {...provided.dragHandleProps}>
																<DragIndicator />
															</ListItemIcon>
															<ListItemText
																id={labelId}
																primary={getLayerName(layer)}
																//primary="Hello"
																className={
																	checkIfNoLayerData(layer)
																		? classes.disabledLayerTitle
																		: ""
																}
															/>
															{type === "layer" &&
																layer.layerSettings.colorable &&
																getLayerControls(layer, labelId, index)}
															<FormControlLabel
																control={
																	<Switch
																		disabled={
																			checkIfNoLayerData(layer)
																				? classes.disabledLayerTitle
																				: ""
																		}
																		checked={getLayerChecked({
																			layer,
																			index,
																		})}
																		onChange={() =>
																			handleToggle({ layer, index })
																		}
																	/>
																}
															/>
														</StyledListItem>
													)}
												</Box>
											)}
										</Draggable>
									);
								}
							})}
						</List>
					</RootRef>
				)}
			</Droppable>
		</DragDropContext>
	);

	return (
		// <ClickAwayListener onClickAway={handleClose}>
		<div
			style={{
				position: "absolute",
				display: "flex",
				flexDirection: "row",
				width: "500px",
				maxWidth: "500px",
				top: "90px",
				left: stateMapControls.panelExpanded
					? "30px"
					: type === "marketplace"
					? "-639px"
					: "-405px",
				transition: "left 0.5s ease-in-out",
				listStyleType: "none",
			}}
		>
			<StyledMenu
				id="checklist-menu"
				// anchorEl={stateMapControls.anchorEl}
				keepMounted
				open={Boolean(stateMapControls.selectedControl)}

				//onClose={handleClose}
			>
				<StyledMenuHeaderItem
					disableRipple
					key="subheader"
					role={undefined}
					dense
					className={classes.subHeaderItem}
				>
					{type === "marketplace" ? (
						<>
							<div>
								<span style={{ marginRight: "2rem", color: "#00B0F0" }}>
									View
								</span>

								<MarketplaceDropdown
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={view}
									onChange={(e) => setView(e.target.value)}
								>
									<MenuItem value={"All"}>All</MenuItem>
									<MenuItem value={"Twenty"}>Twenty</MenuItem>
									<MenuItem value={"Thirty"}>Thirty</MenuItem>
								</MarketplaceDropdown>
							</div>

							<div>
								<span style={{ marginRight: "2rem", color: "#00B0F0" }}>
									Sort By
								</span>
								<MarketplaceDropdown
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value)}
								>
									<MenuItem value={"Recently Posted"}>Recently Posted</MenuItem>
									<MenuItem value={"Twenty"}>Twenty</MenuItem>
									<MenuItem value={"Thirty"}>Thirty</MenuItem>
								</MarketplaceDropdown>
							</div>
						</>
					) : (
						<ListItemText primary={title} />
					)}
					{headerButton && (
						<StyledListItemSecondaryAction>
							<Button
								onClick={headerButton.fn}
								color="primary"
								startIcon={headerButton.icon}
							>
								{headerButton.text}
							</Button>
						</StyledListItemSecondaryAction>
					)}
				</StyledMenuHeaderItem>

				{/* base Stuff */}
				{type === "base" && getBasemapImageBox()}

				{type === "base" ? (
					<Collapse in={open} timeout="auto" unmountOnExit>
						{displayList}
					</Collapse>
				) : (
					displayList
				)}

				{/* </Collapse> */}
			</StyledMenu>
			<div
				className={classes.pulloutBox}
				// style={{
				// 	left: stateMapControls.panelExpanded ? "530px !important" : "0px",
				// }}
				onClick={togglePullout}
			>
				{stateMapControls.panelExpanded ? (
					<ArrowBackIosIcon />
				) : (
					<ArrowForwardIosIcon />
				)}
			</div>
			{/* // </ClickAwayListener> */}
		</div>
	);
}

export default React.memo(Panel, deepEqualObjects);
