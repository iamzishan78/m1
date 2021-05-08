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

	const defaultProps = {
		borderLeft: 4,
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
						<List
							style={{
								maxHeight: "775px",
								minWidth: "500px",
								overflowY: type === "marketplace" ? "scroll" : "scroll",
							}}
							className={classes.list}
						>
							{type === "marketplace" &&
								MarketPlaceData.map((layer, index) => {
									return view === "All" ? (
										<Box borderColor={getLayerColor(layer, type, colors)} {...defaultProps}>
											<MarketPlaceListItem>
												<MarketPlaceUpper>
													<BusinessIcon />
													<span>{layer.name}</span>
													<div>
														{" "}
														<SupervisedUserCircleIcon />
														<StarIcon
															style={{
																marginLeft: "0.6rem",
																color: "#FFFF00",
															}}
														/>
													</div>
												</MarketPlaceUpper>

												<MarketPlaceLower>
													{layer.properties.map((property, i) => (
														<MarketPlaceLowerItems>
															<div>{property.name}</div>
															<div>{property.value}</div>
														</MarketPlaceLowerItems>
													))}
													<MarketPlaceLowerItems>
														<div>{layer.type}</div>
														{layer.type === "Listing" ? (
															<ListIcon />
														) : layer.type === "Auction" ? (
															<GavelIcon />
														) : layer.type === "Sponsor" ? (
															<ListIcon />
														) : (
															""
														)}
													</MarketPlaceLowerItems>
												</MarketPlaceLower>
											</MarketPlaceListItem>
										</Box>
									) : (
										layer.type === view && (
											<Box borderColor={getLayerColor(layer, type, colors)} {...defaultProps}>
												<MarketPlaceListItem>
													<MarketPlaceUpper>
														<BusinessIcon />
														<span>{layer.name}</span>
														<div>
															{" "}
															<SupervisedUserCircleIcon />
															<StarIcon
																style={{
																	marginLeft: "0.6rem",
																	color: "#FFFF00",
																}}
															/>
														</div>
													</MarketPlaceUpper>

													<MarketPlaceLower>
														{layer.properties.map((property, i) => (
															<MarketPlaceLowerItems>
																<div>{property.name}</div>
																<div>{property.value}</div>
															</MarketPlaceLowerItems>
														))}
														<MarketPlaceLowerItems>
															<div>{layer.type}</div>
															{layer.type === "Listing" ? (
																<ListIcon />
															) : layer.type === "Auction" ? (
																<GavelIcon />
															) : layer.type === "Sponsor" ? (
																<ListIcon />
															) : (
																""
															)}
														</MarketPlaceLowerItems>
													</MarketPlaceLower>
												</MarketPlaceListItem>
											</Box>
										)
									);
								})}

							<Layer layerMap={layerMap} type={type} handleToggle={handleToggle} />
							{/* {provided.placeholder} */}
						</List>
					</RootRef>
				)}
			</Droppable>

		</DragDropContext>
	);
	return (
		// <ClickAwayListener onClickAway={handleClose}>
		<div>
			{type === "marketplace" && (
				<MarketPlaceMenu>
					<Dropdown
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={sponsorName}
						style={{
							background: "white",
							paddingLeft: "1rem",
							marginRight: "1rem",
							flex: "1",
						}}
						onChange={(e) => setSponsorName(e.target.value)}
					>
						<MenuItem value={"Seller/Sponsor Name"}>
							Seller/Sponsor Name
						</MenuItem>
						<MenuItem value={"Pheasant Energy"}>Pheasant Energy</MenuItem>{" "}
						<MenuItem value={"Taprock"}>Taprock</MenuItem>{" "}
						<MenuItem value={"Frontier Group"}>Frontier Group</MenuItem>{" "}
						<MenuItem value={"Greyshore Capital"}>Greyshore Capital</MenuItem>{" "}
						<MenuItem value={"Blackstone Minerals"}>
							Blackstone Minerals
						</MenuItem>{" "}
						<MenuItem value={"Onshore Land"}>Onshore Land</MenuItem>{" "}
						<MenuItem value={"Caddo"}>Caddo</MenuItem>
					</Dropdown>

					<Dropdown
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={interestType}
						style={{
							background: "white",
							paddingLeft: "1rem",
							marginRight: "1rem",
							flex: "1",
						}}
						onChange={(e) => setInterestType(e.target.value)}
					>
						<MenuItem value={"Interest Type"}>Interest Type</MenuItem>
						<MenuItem value={"Operated Working Interest"}>
							Operated Working Interest
						</MenuItem>
						<MenuItem value={"Non-operated Working Interest"}>
							Non-operated Working Interest
						</MenuItem>
						<MenuItem value={"Overriding Royalty Interest"}>
							Overriding Royalty Interest
						</MenuItem>
						<MenuItem value={"Royalty Interest"}>Royalty Interest</MenuItem>
						<MenuItem value={"Mineral Interest"}>Mineral Interest</MenuItem>
						<MenuItem value={"Leasehold Interest"}>Leasehold Interest</MenuItem>
					</Dropdown>

					<Dropdown
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={region}
						style={{
							background: "white",
							paddingLeft: "1rem",
							marginRight: "1rem",
							flex: "1",
						}}
						onChange={(e) => setRegion(e.target.value)}
					>
						<MenuItem value={"Region"}>Region</MenuItem>
						<MenuItem value={"Alaska"}>Alaska</MenuItem>
						<MenuItem value={"Appalachians"}>Appalachians</MenuItem>
						<MenuItem value={"Arklatex"}>Arklatex</MenuItem>
						<MenuItem value={"Central Texas"}>Central Texas</MenuItem>
						<MenuItem value={"East Texas"}>East Texas</MenuItem>
						<MenuItem value={"Gulf Coast"}>Gulf Coast</MenuItem>
						<MenuItem value={"Michigan Basin"}>Michigan Basin</MenuItem>
						<MenuItem value={"Mid Continent"}>Mid Continent</MenuItem>
						<MenuItem value={"Offshore"}>Offshore</MenuItem>
						<MenuItem value={"Panhandle"}>Panhandle</MenuItem>
						<MenuItem value={"Permian Basin"}>Permian Basin</MenuItem>
						<MenuItem value={"San Juan Basin"}>San Juan Basin</MenuItem>
						<MenuItem value={"South Texas"}>South Texas</MenuItem>
						<MenuItem value={"West Coast"}>West Coast</MenuItem>
					</Dropdown>

					<Dropdown
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={saleType}
						style={{
							background: "white",
							paddingLeft: "1rem",
							marginRight: "1rem",
							flex: "1",
						}}
						onChange={(e) => setSaleType(e.target.value)}
					>
						<MenuItem value={"Sale Type"}>Sale Type</MenuItem>
						<MenuItem value={"Sponsor"}>Sponsor</MenuItem>{" "}
						<MenuItem value={"Lease"}>Lease</MenuItem>{" "}
						<MenuItem value={"Auction"}>Auction</MenuItem>
					</Dropdown>

					<Dropdown
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={operators}
						style={{
							background: "white",
							paddingLeft: "1rem",
							marginRight: "1rem",
							flex: "1",
						}}
						onChange={(e) => setOperators(e.target.value)}
					>
						<MenuItem value={"Operators"}>Operators</MenuItem>
						<MenuItem value={"Chevron"}>Chevron</MenuItem>{" "}
						<MenuItem value={"Apache"}>Apache</MenuItem>{" "}
						<MenuItem value={"BLS Production"}>BLS Production</MenuItem>
						<MenuItem value={"Lime Rock"}>Lime Rock</MenuItem>
					</Dropdown>
				</MarketPlaceMenu>
			)}

			<div
				style={{
					position: "absolute",
					display: "flex",
					flexDirection: "row",
					width: "50px",
					maxWidth: "500px",
					top: "130px",
					left: stateMapControls.panelExpanded
						? "30px"
						: type === "marketplace"
							? "-567px"
							: "0px",
					transition: "left 0.5s ease-in-out",
					listStyleType: "none",
					zIndex: "99999"
				}}
			>
				<StyledMenu
					id="checklist-menu"
					// anchorEl={stateMapControls.anchorEl}
					style={!stateMapControls.panelExpanded && type === 'layer' ? { display: 'none' } : {}}
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

										<MenuItem value={"Listing"}>Listing</MenuItem>
										<MenuItem value={"Auction"}>Auction</MenuItem>
										<MenuItem value={"Sponsor"}>Sponsor</MenuItem>
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
										<MenuItem value={"Recently Posted"}>
											Recently Posted
										</MenuItem>
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

					{
						type === "layer" ? <SortableLayer layerMap={layerMap} /> : type === "base" ? (
							<Collapse in={open} timeout="auto" unmountOnExit>
								{displayList}
							</Collapse>
						) : (
							displayList
						)
					}

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
		</div>
	);
}

export default React.memo(Panel, deepEqualObjects);
