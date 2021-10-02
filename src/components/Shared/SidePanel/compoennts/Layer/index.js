import React, { useContext, useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import RootRef from "@material-ui/core/RootRef";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DragIndicator from "@material-ui/icons/DragIndicator";
import { AppContext } from "AppContext";
import List from "@material-ui/core/List";
import { createMuiTheme } from "@material-ui/core/styles";
import { deepEqualObjects } from "../../../functions";
import LayerItem from "./LayerItem";

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
            "float": "left",
            display: "grid",
        },
        "& :nth-child(2)": {
            "float": "left",
            display: "grid",
        },
        "& :nth-child(3)": {
            display: "grid",
        },
        "& :nth-child(4)": {
            "float": "left",
            display: "grid",
        },
        "& :nth-child(5)": {
            display: "grid",
            "float": "left",
        },
    },
    accordion: {
        backgroundColor: '#263451', color: 'white',
        '&:before': {
            backgroundColor: 'inherit'
        }
    }
}));

function Layer({ layerMap, type, handleToggle }) {
    const [stateApp, setStateApp] = useContext(AppContext);
    const classes = useStyles();
    return (
        <>
            {layerMap && layerMap.map((layer, index) => {

                const labelId = `checkbox-list-label-${index}`;
                //// remove the (layer.identifier!="Tracked Owners") condition from the if statement to show the tracked owers layer
                if (
                    type === "heatMaps" ||
                    type === "base" ||
                    (type === "layer" &&
                        (layer.layerSettings &&
                            layer.layerSettings.showable &&
                            layer.identifier !== "Tracked Owners"))
                ) {

                    return (
                        <Draggable
                            key={labelId}
                            draggableId={labelId}
                            index={type === "layer" ? layer.position : index}
                        >
                            {(provided, snapshot) => (

                                <RootRef rootRef={provided.innerRef}>
                                    <LayerItem index={index} labelId={labelId} provided={provided} type={type} layer={layer} handleToggle={handleToggle} stateApp={stateApp} setStateApp={setStateApp} />
                                </RootRef>
                            )}
                        </Draggable>
                    );
                }
            })}
        </>
    );
}

export default React.memo(Layer, deepEqualObjects);
