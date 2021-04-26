import React, { useContext } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import DragIndicator from "@material-ui/icons/DragIndicator";
import { MapControlsContext } from "components/MapControls/MapControlsContext";
// import { AppContext } from "../../../../AppContext";
import ListItem from "@material-ui/core/ListItem";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import ClickIcon from "../../../svgIcons/cursor-click.js";
import UserDefined from "../../../svgIcons/user-defined.js";
import ColorControl from "../../../svgIcons/color-control.js";
import { Tooltip, FormControlLabel, Switch } from "@material-ui/core";
import { UPDATELAYERSETTINGS } from "graphQL/useMutationUpdateLayerSettings";
import { useMutation } from "@apollo/client";
import Box from "@material-ui/core/Box";
import { useSelector } from "react-redux";
import { deepEqualObjects } from "../../../functions";
import { getLayerColor } from "../common.js";

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
}));

function LayerItem({ layer, index, provided, type, handleToggle, labelId, stateApp, setStateApp }) {
    const colors = useSelector(
        ({ MainMap }) => MainMap
    );
    const [stateMapControls, setStateMapControls] = useContext(
        MapControlsContext
    );
    // const [stateApp, setStateApp] = useContext(AppContext);

    const classes = useStyles();

    const [updateLayerSettings] = useMutation(UPDATELAYERSETTINGS);

    const handleToggleInteraction = (layer, index) => () => {
        // const currentLayers = [...items];
        const currentLayers = []
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

    const defaultProps = {
        borderLeft: 4,
    };

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

    const checkIfNoLayerData = (layer) => {
        return type === "layer" && !ifLayerHaveData(layer);
    };


    return (
        <Box
            borderColor={getLayerColor(layer, type, colors)}
            {...defaultProps}
            ref={provided.innerRef}
            {...provided.draggableProps}
        >
            <StyledListItem
                ContainerComponent="li"

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
        </Box>
    );
}

export default React.memo(LayerItem, deepEqualObjects);
