import React, { useContext, useEffect, useState, useLayoutEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import loadCSS from "fg-loadcss";
// STATE MANAGEMENT
import { MapControlsContext } from "../../MapControlsContext";
import { MapContext } from "../../../Map/MapContext";
import { AppContext } from "../../../../AppContext";
// STYLES - Material UI Required Components
import { useStyles, StyledMenu, StyledMenuItem } from "../muiThemes";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import ListItemText from "@material-ui/core/ListItemText";
// STYLES - Font Awesome Icons Required for Menu Items
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faGripLines, faDrawPolygon } from "@fortawesome/free-solid-svg-icons";
//import { faCircle, faSquare } from "@fortawesome/free-regular-svg-icons";
//import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
// COMPONENTS
import SpatialDataCard from "../spatialDataCard";
// HELPERS
import { area, convertArea } from "@turf/turf";
import { spatialDataAttributes } from "./constants";
import {
  addCustomShapeProperties,
  createShapeLabelLayer
} from "./drawShapesHelpers";
import mapboxgl, { Marker } from "mapbox-gl";
import { makeStyles, Icon } from "@material-ui/core";
import polylabel from "polylabel";
import { useHistory } from "react-router-dom";

import { UPSERTCUSTOMLAYER } from "../../../../graphQL/useMutationUpsertCustomLayer";
import { USERBYEMAIL } from "../../../../graphQL/useQueryUserByEmail";

//import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
//import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
//import { mdiShapePolygonPlus } from '@mdi/js'; 
import {default as DrawPoly} from '../../../Shared/svgIcons/polygon';
import {default as Rect} from '../../../Shared/svgIcons/rectangle';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import {NavigationContext} from "../../../Navigation/NavigationContext";

// import { availableShapes } from "./constants";
const DEBUG_GREEN = "background: green; color: white; border: 1px solid black";
const DEBUG_YELLOW = "background: yellow; color: red; border: 1px solid black";
const DEBUG_BLUE = "background: blue; color: white; border: 1px solid black";
const DEBUG_RED = "background: red; color: white; border: 1px solid black";




export const availableShapes = [
  {
    title: "Polygon",
    mode: "draw_polygon",
    //icon: "fa fa-draw-polygon"
  },
  {
    title: "Circle",
    mode: "drag_circle",
    //icon: "fa fa-circle"
  },
  {
    title: "Rectangle",
    mode: "draw_rectangle",
    //icon: "fa fa-square"
  },
  {
    title: "Line",
    mode: "draw_line_string",
    //icon: "fa fa-grip-lines"
  }
];

const localStyles = makeStyles(theme => ({
  label: {
    width: "150px",
    height: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "1rem"
  }
}));

export default function DrawShapes(props) {
    const classes = useStyles();
    let history = useHistory();
    const localClasses = localStyles();
    const [stateMapControls, setStateMapControls] = useContext(
        MapControlsContext
    );
    const [stateApp, setStateApp] = useContext(AppContext);
    const [stateMap, setStateMap] = useContext(MapContext);
    const [stateNav, setStateNav] = useContext(NavigationContext);
    const [showSpatialDataCard, toggleSpatialDataCard] = useState(false);

    const [upsertCustomLayer, {data: customLayerData}] = useMutation(UPSERTCUSTOMLAYER);

    const DEBUGGER = (source, value) => {
        console.log(`%c[DrawShapes.js] ${source}`, DEBUG_GREEN, value);
    };

    const createShapeMarker = feature => {
        var el = document.createElement("div");
        el.setAttribute("id", feature.id);
        el.innerHTML = "Feature_" + feature.id.slice(-4);
        el.className = localClasses.label;
        return el;
    };

    // useEffect(() => {
    //   loadCSS(
    //     'https://use.fontawesome.com/releases/v5.1.0/css/all.css',
    //     document.querySelector('#font-awesome-css'),
    //   );
    // }, []);

    const [getUserByEmail, { data: dataUser }] = useLazyQuery(USERBYEMAIL);

    const [user, setUser] = useState({ _id: "" });

    useEffect(() => {
        if (stateApp && stateApp.user && stateApp.user.email) {
            getUserByEmail({
                variables: {
                    userEmail: stateApp.user.email,
                },
            });
        }
    }, [stateApp.user.email]);

    useEffect(() => {
        if (dataUser && dataUser.userByEmail) {
            setUser(dataUser.userByEmail);
        }
    }, [dataUser]);

    useEffect(() => {
        const {map} = stateMap;
        map.on("draw.create", ({features}) => {
            const [feature] = features;
            const {draw} = stateMap;
            if (feature) {
                addCustomShapeProperties(feature, draw);
            }
            setStateApp({...stateApp, editDraw: false});
        });

        map.on("draw.selectionchange", ({features}) => {
            const [feature] = features;
            if (feature) {
                setStateMap({...stateMap, currentFeature: feature});
                setStateApp(stateApp => {
                    return {
                        ...stateApp,
                        featureOrMapShape: feature,
                        editDraw: true
                    };
                });
            } else {
                setStateMap({...stateMap, currentFeature: undefined});
                setStateApp({...stateApp, editDraw: false});
            }
        });
    }, [stateMap.map, showSpatialDataCard]);

    useEffect(() => {
        setStateApp({...stateApp, editDraw: showSpatialDataCard});
    }, [showSpatialDataCard])

    useEffect(() => {
        const {currentFeature} = stateMap;
        if (currentFeature !== undefined) {
            toggleSpatialDataCard(true);
        } else {
            toggleSpatialDataCard(false);
        }
    }, [stateMap.currentFeature]);

    const createShapeDrawOptions = () => {
        return availableShapes.map((shape, index) => {
            return (
                <StyledMenuItem
                    key={index}
                    onClick={evt => {
                        stateMap.draw.changeMode(shape.mode);
                        setStateApp({...stateApp, editDraw: true});
                        handleClose();
                    }}
                >
                    <div style={{color: "white", paddingRight: "15px"}}>
                        <Icon className={shape.icon} color="secondary"/>
                        {shape.mode === "draw_polygon" && <DrawPoly/>}
                        {shape.mode === "draw_rectangle" && <Rect/>}
                        {shape.mode === "drag_circle" && <RadioButtonUncheckedIcon fontSize='small'/>}
                        {shape.mode === "draw_line_string" && <ShowChartIcon/>}
                    </div>
                    <ListItemText primary={shape.title} id={index}/>
                </StyledMenuItem>
            );
        });
    };

    const handleClose = () => {
        setStateMapControls({...stateMapControls, anchorEl: null});
    };

    const handleSaveSpatialDataToShape = (spatialData, dataType) => {
        // save data onto geoJSON properties fields

        spatialDataAttributes.forEach(attribute => {
            // console.log(attribute, spatialData[attribute]);
            stateMap.draw.setFeatureProperty(
                stateMap.currentFeature.id,
                attribute,
                spatialData[attribute]
            );
            if (spatialData[attribute]) {
                stateMap.currentFeature.properties[attribute] = spatialData[attribute];
            }
        });

        const symbolFeature = {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: stateMap.currentFeature.properties.shapeCenter
            },
            properties: {
                ...stateMap.currentFeature.properties,
                label: spatialData.shapeLabel,
            }
        }

        toggleSpatialDataCard(false);

        //////cleaning the selected title opinion and redirecting to title opinion page//

        if (dataType === "title") {
            setStateApp(stateApp => {
                return {
                    ...stateApp,
                    selectedTitleOpinionId: null
                };
            });

            history.push("/titleopinion");
        } else {
            if (user._id != "" ) {
                const customLayerData = {
                    shape: JSON.stringify(stateMap.currentFeature),
                    layer: dataType,
                    name: spatialData.shapeLabel,
                    user: user._id
                };
                const customLayerSymbolData = {
                    shape: JSON.stringify(symbolFeature),
                    layer: `${dataType}_labels`,
                    name: spatialData.shapeLabel,
                    user: user._id
                };
                upsertCustomLayer({
                    variables: { customLayer: customLayerData }
                });
                upsertCustomLayer({
                    variables: { customLayer: customLayerSymbolData }
                });
                setStateApp({
                    ...stateApp,
                    customLayers: [
                        ...stateApp.customLayers,
                        customLayerData,
                        customLayerSymbolData
                    ]
                });
                handleDeleteSpatialDataAndShape();
            }
        }
    };

    const handleDeleteSpatialDataAndShape = () => {
        const {currentFeature} = stateMap;
        if (currentFeature) {
            const elem = document.getElementById(currentFeature.id);
            // elem.parentNode.removeChild(elem);
            console.log("elem", elem);
            stateMap.draw.delete(currentFeature.id);
            setStateMap({
                ...stateMap,
                currentFeature: undefined,
            });
            if (currentFeature.id.includes("draw_polygon")
                || currentFeature.id.includes("drag_circle")
                || currentFeature.id.includes("draw_rectangle")) {
                setStateNav((stateNav) => ({
                    ...stateNav,
                    filterDrawing: []
                }));
            }
        }
    };

    return (
        <React.Fragment>
            <ClickAwayListener onClickAway={handleClose}>
                <StyledMenu
                    id="draw-shapes"
                    keepMounted
                    anchorEl={stateMapControls.anchorEl}
                    open={Boolean(stateMapControls.anchorEl)}
                    onClose={handleClose}
                >
                    <StyledMenuItem
                        disableRipple
                        key="subheader"
                        role={undefined}
                        dense
                        className={classes.subHeaderItem}
                    >
                        <ListItemText primary="Draw Shapes"/>
                    </StyledMenuItem>
                    {createShapeDrawOptions()}
                </StyledMenu>
            </ClickAwayListener>
            {showSpatialDataCard && stateMap.currentFeature !== undefined && !stateMap.currentFeature.id.includes("draw_polygon")
            && !stateMap.currentFeature.id.includes("drag_circle")
            && !stateMap.currentFeature.id.includes("draw_rectangle")
                ? (
                    <SpatialDataCard
                        closeSpatialDataCard={() => toggleSpatialDataCard(false)}
                        saveSpatialData={handleSaveSpatialDataToShape}
                        deleteSpatialDataAndShape={handleDeleteSpatialDataAndShape}
                        selectedFeature={stateMap.currentFeature}
                    />
                ) : null}
        </React.Fragment>
    );
}
