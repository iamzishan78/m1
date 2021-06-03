import React, { useContext, useState, useEffect } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import RootRef from "@material-ui/core/RootRef";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import { MapControlsContext } from "../../../MapControls/MapControlsContext";
import { AppContext } from "../../../../AppContext";
import List from "@material-ui/core/List";
import LayersIcon from "@material-ui/icons/Layers";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import MapDarkIcon from "../../svgIcons/MapDarkIcon";
import MapOutdoorIcon from "../../svgIcons/MapOutdoorIcon";
import MapSatelliteIcon from "../../svgIcons/MapSatelliteIcon";
import MapLightIcon from "../../svgIcons/MapLightIcon";
import MapBasicIcon from "../../svgIcons/MapBasicIcon";
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";
import { ThemeProvider } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { deepEqualObjects } from "../../functions";
import StarIcon from "@material-ui/icons/Star";
import ListIcon from "@material-ui/icons/List";
import BusinessIcon from "@material-ui/icons/Business";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import MarketPlaceData from "./marketplace.json";
import GavelIcon from "@material-ui/icons/Gavel";
import Layer from "./Layer";
import { getLayerColor } from "./common";
import {
	useStyles, theme, StyledMenu, StyledMenuItem, StyledListItem2, StyledListItemSecondaryAction, StyledMenuHeaderItem,
	MarketPlaceListItem, MarketPlaceLower, MarketPlaceLowerItems, MarketPlaceMenu, MarketPlaceUpper,
	MarketplaceDropdown, Dropdown,
} from './style'
import SortableLayer from "./SortableLayer";


function Panel({ type, title, headerButton, handleToggle, onDragEnd, items }) {
	const colors = useSelector(
		({ MainMap }) => MainMap
	);
	const [stateMapControls, setStateMapControls] = useContext(
		MapControlsContext
	);
	const [stateApp, setStateApp] = useContext(AppContext);

	const [view, setView] = React.useState("All");
	const [sortBy, setSortBy] = React.useState("Recently Posted");
	const [sponsorName, setSponsorName] = useState("Seller/Sponsor Name");
	const [interestType, setInterestType] = useState("Interest Type");
	const [region, setRegion] = useState("Region");
	const [operators, setOperators] = useState("Operators");
	const [saleType, setSaleType] = useState("Sale Type");

	const classes = useStyles();

	const [layerMap, setLayerMap] = useState([]);
	const [open, setOpen] = useState(true);
	const [mapStyles, setMapStyles] = useState([]);

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
			expandedPanel: !stateMapControls.expandedPanel,
		}));
	};

	const defaultProps = {
		borderLeft: 4,
	};

	const getBasemapImageBox = () => {
		return (
			<>
				<div className={classes.imageBox} >
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
							}}
						>
							<ThemeProvider theme={theme}>
								<div>{style.name === "Outdoors" && <MapOutdoorIcon />}</div>
								<div>{style.name === "Satellite" && <MapSatelliteIcon />}</div>
								<div>{style.name === "Light" && <MapLightIcon />}</div>
								<div>{style.name === "Dark" && <MapDarkIcon />}</div>
								<div>{style.name === "Basic" && <MapBasicIcon />}</div>
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

	const displayList = (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="droppableM1">
				{(provided, snapshot) => (
					<RootRef rootRef={provided.innerRef}>

						{type === 'base' &&
							<List className={classes.list}>
								<Layer layerMap={layerMap} type={type} handleToggle={handleToggle} />
							</List>
						}

						{type === 'heatMaps' &&
							<List className={classes.heatmapList}>
								<Layer layerMap={layerMap} type={type} handleToggle={handleToggle} />
							</List>
						}


					</RootRef>
				)}
			</Droppable>

		</DragDropContext>
	);
	return (
		// <ClickAwayListener onClickAway={handleClose}>
		<div>
			<div
				style={{
					position: "absolute",
					display: "flex",
					flexDirection: "row",
					width: "50px",
					maxWidth: "425px",
					left: stateMapControls.expandedPanel
						? "0px"
						: type === "marketplace"
							? "-567px"
							: "0px",
					listStyleType: "none",
					zIndex: "99999"
				}}
			>
				<StyledMenu
					id="checklist-menu"
					// anchorEl={stateMapControls.anchorEl}
					style={!stateMapControls.expandedPanel ? { display: 'none' } : { minWidth: '425px' }}
					keepMounted
					open={Boolean(stateMapControls.selectedControl)}
				>
					<StyledMenuHeaderItem
						disableRipple
						key="subheader"
						role={undefined}
						dense
						className={classes.subHeaderItem}
					>
						<ListItemText primary={title} />

						{headerButton && (
							<StyledListItemSecondaryAction>
								<Button
									onClick={headerButton.fn}
									color="secondary"
									startIcon={headerButton.icon}
								>
									{headerButton.text}
								</Button>
							</StyledListItemSecondaryAction>
						)}
					</StyledMenuHeaderItem>

					{/* base Stuff */}
					{type === "base" && getBasemapImageBox()}

					{
						type === "layer" && layerMap && layerMap[0]?.type ?

							(
								// <div styles={{  height: 'calc(100vh - 40px - 64px)'}}>
								<SortableLayer layerMap={layerMap} />
							)
							: type === "base" ? (
								<Collapse in={open} timeout="auto" unmountOnExit>
									{displayList}
								</Collapse>
							) : (
								displayList
							)
					}




				</StyledMenu>
				<div
					className={classes.pulloutBox}

					onClick={togglePullout}
				>
					{stateMapControls.expandedPanel ? (
						<ArrowBackIosIcon />
					) : (
						<ArrowForwardIosIcon />
					)}
				</div>
				{/* // </ClickAwayListener> */}
			</div>
		</div>
	);
}

export default React.memo(Panel, deepEqualObjects);
