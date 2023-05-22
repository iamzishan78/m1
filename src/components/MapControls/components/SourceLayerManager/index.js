import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { MapControlsContext } from "../../MapControlsContext";
import { AppContext } from "AppContext";
import { Grid, Typography, Divider, Tooltip, InputBase } from "@material-ui/core";
import { Close as CloseButton, Search as SearchIcon, Clear as ClearIcon } from "@material-ui/icons";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { copy, deepEqual, deepEqualObjects } from "components/Shared/functions";
import { UPDATEMANYLAYERSETTINGS } from "graphQL/useMutationUpdateManyLayerSettings";
import { useMutation } from "@apollo/client";
import { IconButton } from "@material-ui/core";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { UPDATE_MANY_LAYER } from "graphQL/useMutationUpdateManyLayer";
import SourceManager from "./SourceManager";
import LayerManager from "./LayerManager";
import { useHookstate } from '@hookstate/core';
import { hookStateApp } from "hookstate";

const useStyles = makeStyles((theme) => ({
    search: {
        position: "relative",
        borderRadius: theme.shape.borderRadius,
        marginLeft: 0,
        marginTop: 0,
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            width: "auto",
        },
        "& .MuiInputBase-root": { width: "93% !important" },
    },
    iconSearch: {
        zIndex: 1,
        "&:hover": {
            cursor: "pointer",
        },
    },
    iconClear: {
        zIndex: 1,
        "&:hover": {
            cursor: "pointer",
        },
    },
    subHeaderItem: {
        backgroundColor: "#011133 !important",
        minWidth: "350px",
    },
    list: {
        border: "2px solid #A9A9A9",
        padding: "0px",
        margin: "8px 0px",
        borderRadius: "8px",
    },
    nested: {
        paddingLeft: theme.spacing(6),
        paddingRight: theme.spacing(6),
    },
    disabledLayerTitle: {
        "& span": { color: "rgb(127, 149, 199) !important" },
    },
    dropzoneClass: {
        "& .MuiDropzoneArea-text": {
            marginTop: 0,
            marginBottom: 0
        },
        "& .MuiDropzoneArea-icon": {
            display: "none",
        },
        minHeight: "0",
        marginBottom: "0px",
        border: "none",
    },
    url: {
        textDecoration: "underline",
        "&:hover": {
            color: "darkblue",
        },
    },
    uploaderText: {
        color: "#828282",
        fontSize: "1rem",
        backgroundColor: "#e8edefe8",
        border: "2px dashed #999",
        padding: "10px",
        borderRadius: "5px",
    },
    contentRoot: {
        padding: "15px",
        height: "calc(100% - 111px)",
        position: "absolute",
        overflow: "overlay",
    },
    footer: {
        position: "absolute",
        right: "0px",
        bottom: "0px",
        padding: "15px",
    },
    selectedType: {
        borderBottom: "4px solid #01B0F0",
        display: "inline",
        cursor: "pointer",
    },
    unSelectedType: {
        display: "inline",
        color: "#827F7F",
        cursor: "pointer",
    },
    moreIcon: {
        color: "#0000008a",
        marginRight: '15px',
        display: "none",
    }
}));

export default function SourceLayerManager(props) {
    const classes = useStyles();
    const [selectedType, setSelectedType] = useState('source');

    const [stateMapControls, setStateMapControls] = useContext(MapControlsContext);
    const [stateApp] = useContext(AppContext);
    const hookState = useHookstate(hookStateApp);
    const [currentLayers, setCurrentLayers] = React.useState([]);

    const [updateManyLayer] = useMutation(UPDATE_MANY_LAYER);
    const [updateManyUserLayerSettings] = useMutation(UPDATEMANYLAYERSETTINGS);


    const [searchState, setSearchState] = useState(false);
    const [search, setSearch] = useState();

    const clearSearch = () => {
        setTimeout(() => {
            setSearch(null);
            setSearchState(false);
        }, 200);
    };
    const setSearchValue = (value) => {
        setSearch(value);
    };

    useEffect(() => {
        if (!deepEqual(currentLayers, hookState.layers.get({ noproxy: true }))) {
            setCurrentLayers(copy(hookState.layers.get({ noproxy: true })));
        }
    }, [currentLayers, hookState.layers]);

    const handleClose = () => {
        setStateMapControls((stateMapControls) => ({
            ...stateMapControls,
            addLayer: false,
            manageSourceLayer: false,
            manageLayer: false,
        }));
    };

    const updateStateLayers = (currentLayers) => {
        stateApp.layers = currentLayers;
        hookStateApp.layers.set(currentLayers)
    }

    const handleApplyChange = () => {
        if (!deepEqual(currentLayers, hookState.layers.get({ noproxy: true }))) {
            const layersToUpdate = [];
            const layersSettingsToUpdate = [];
            for (let i = 0; i < currentLayers.length; i++) {
                if (!deepEqualObjects(currentLayers[i], hookState.layers.get({ noproxy: true }))) {
                    layersSettingsToUpdate.push({
                        _id: currentLayers[i]._id,
                        layerSettings: currentLayers[i].layerSettings,
                    });
                    layersToUpdate.push({
                        _id: currentLayers[i].layerId,
                        layerName: currentLayers[i].layerName,
                        groupName: currentLayers[i].groupName,
                    });
                }
            }

            //// saving to stateApp
            updateStateLayers([...currentLayers])
            //// saving to mongo
            if (layersToUpdate.length > 0) {
                updateManyLayer({
                    variables: {
                        layers: layersToUpdate,
                    },
                });

                updateManyUserLayerSettings({
                    variables: {
                        manySettings: layersSettingsToUpdate,
                    },
                });
            }
        }

        handleClose();
    };

    return (
        <ClickAwayListener onClickAway={handleApplyChange}>
            <Grid container direction="row" onClick={(e) => e.stopPropagation()}>
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                    style={{ padding: "15px" }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Grid item>
                        <Typography variant="h5">Source & Layer Manager</Typography>
                    </Grid>
                    <Grid item>
                        <IconButton size="small" onClick={handleApplyChange}>
                            <CloseButton />
                        </IconButton>
                    </Grid>
                </Grid>
                <Divider />

                <ListItem
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "start",
                    }}
                >
                    <ListItemText>
                        <h4
                            onClick={(e) => {
                                setSelectedType("source");
                                e.stopPropagation()
                            }}
                            className={selectedType === "source" ? classes.selectedType : classes.unSelectedType}
                        >
                            SOURCES
                        </h4>
                        <h4
                            onClick={(e) => {
                                setSelectedType("layer");
                                e.stopPropagation()
                            }}
                            className={selectedType === "layer" ? classes.selectedType : classes.unSelectedType}
                            style={{ marginLeft: "30px" }}
                        >
                            LAYERS
                        </h4>
                    </ListItemText>
                    <Grid item xs={7}>
                        <div className={classes.search}>
                            {
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'row-reverse'
                                }} >
                                    {searchState ? (
                                        <Tooltip title="Clear" className={classes.iconClear}>
                                            <IconButton size="small" htmlColor="white" onClick={clearSearch}>
                                                <ClearIcon />
                                            </IconButton>
                                        </Tooltip>
                                    ) : <Tooltip title="Search" className={classes.iconSearch} onClick={() => setSearchState(true)}>
                                        <SearchIcon />
                                    </Tooltip>}
                                    {searchState && <InputBase
                                        // id="searchInput"
                                        fullWidth
                                        placeholder={`Search by ${selectedType} name`}
                                        value={search}
                                        classes={{
                                            root: classes.inputRoot,
                                            input: classes.inputInput,
                                        }}
                                        autoComplete="off"
                                        inputProps={{ "aria-label": "search" }}
                                        onFocus={() => setSearchState(true)}
                                        onChange={(evt) => setSearchValue(evt.target.value)}
                                        autoFocus
                                    />
                                    }
                                </div>
                            }
                        </div>
                    </Grid>
                </ListItem>
                {selectedType === "source" && <SourceManager search={search} />}
                {selectedType === "layer" && <LayerManager search={search} />}
            </Grid>
        </ClickAwayListener>
    );
}
