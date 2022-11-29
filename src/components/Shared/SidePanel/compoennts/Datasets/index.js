import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/styles";
import { Typography } from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import DatabaseIcon from "components/Shared/svgIcons/DatabaseIcon";
import LayersIcon from "@material-ui/icons/Layers";
import GridOnIcon from "@material-ui/icons/GridOn";
import FileDatasetIcon from "components/Shared/svgIcons/FileDatasetIcon";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

import { copy, deepEqualObjects } from "components/Shared/functions";

import { StyledListItemSecondaryAction, StyledMenuSecondaryHeaderItem, } from "../style";
import { AppContext } from "AppContext";
import { useDispatch } from "react-redux";
import { setMapGridCardState } from "actions";
import { snapGridSideBarData } from "components/MapGridCard/components/data";
import { GET_DATASETS } from "graphQL/useQueryDataset";
import { USER_MAP_SETTINGS_QUERY } from "graphQL/useQueryUserMapSettings";
import { scrollbarStyle } from "styles/common";
import DatasetMenu from "./Menu";
import { update } from "immutable";
import { UPDATEMANYLAYERSETTINGS } from "graphQL/useMutationUpdateManyLayerSettings";
import { UPDATE_USER_MAP_SETTINGS } from "graphQL/useMutationUserMapSettings";
import { MapControlsContext } from "components/MapControls/MapControlsContext";


const useStyles = makeStyles((theme) => ({
    root: (props) => ({
        background: '#0e111a',
        overflow: 'auto',
        maxHeight: '274px',
        paddingTop: '10px',
        borderBottom: '1px solid #263451',
        paddingBottom: '20px',
        ...scrollbarStyle,

        "& .item": {
            "&:hover": {
                background: "#506187",
                // "& .actionIcon": {
                //     color: '#FFFF'
                // },
                "& .dIcon": {
                    fill: '#ffff ',
                },
            },
            cursor: "pointer",
            paddingLeft: '10px',
            marginBottom: '15px',
            paddingBottom: "10px"
        },

        "& .dIcon": {
            fill: '#506187',
            position: 'absolute',
            height: '53px',
            width: '43px'
        },

        "& .actionIcons": {
            paddingRight: '20px', display: 'flex', position: 'relative', top: '7px',
            "& .actionIcon": {
                color: '#3b4663',
                "&:hover": {
                    color: '#FFFF'
                }
            }
        },
        fontFamily: "Poppins",

        position: "relative",
        disabledLayerTitle: {
            "& span": { color: "rgb(127, 149, 199) !important" },
        },
        "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
            color: theme.palette.common.white,
            minWidth: "40px", // for some reason controls the icon spacing
        },
        "& .MuiTypography-root": {
            color: theme.palette.common.white,
        },
        paddingLeft: "10px",
        justifyContent: "center",
        alignItems: "center",
    }),
    subContainer: (props) => ({
        marginLeft: theme.spacing(props.depth * 2),
    }),
    item: {
        paddingLeft: '10px', marginBottom: '15px'
    }
}));

const DatasetsMemo = memo(Datasets);
export default function DatasetsContainer(props) {
    const [stateApp, setStateApp] = useContext(AppContext);

    const setStateAppCallback = useCallback(setStateApp, [])
    const stateAppMemo = useMemo(() => ({ layers: stateApp.layers, user: stateApp.user, selectedDataset: stateApp.selectedDataset }), [stateApp])

    return <DatasetsMemo stateApp={stateAppMemo} setStateApp={setStateAppCallback} {...props} />
}

function Datasets({ headerButton, search, stateApp, setStateApp }) {

    const classes = useStyles();
    const [_, setStateMapControls] = useContext(MapControlsContext);
    const dispatch = useDispatch();

    const [getDatasets, { data: _datasets }] = useLazyQuery(GET_DATASETS);
    const [updateManyUserLayerSettings] = useMutation(UPDATEMANYLAYERSETTINGS);
    const [updateUserMapSettings] = useMutation(UPDATE_USER_MAP_SETTINGS, { refetchQueries: ["getUserMapSettings"], awaitRefetchQueries: true });
    const [userMapSettings, { data: mapSettings }] = useLazyQuery(USER_MAP_SETTINGS_QUERY);
    const [changedDataset, setChangedDataset] = useState()

    useEffect(() => {
        userMapSettings({ variables: { user: stateApp.user._id, type: 'DatasetVisibility' } })
        getDatasets({ variables: { userId: stateApp.user._id } })
    }, [])

    const datasets = useMemo(() => {
        if (_datasets?.getDatasets?.length && mapSettings?.userMapSettings?.message) {
            let datasets = copy(_datasets.getDatasets)
            const settings = mapSettings?.userMapSettings?.settings?.settings || {}

            datasets.forEach((dataset) => {
                dataset.name = dataset.sourceName
                if (dataset.sourceName === 'M1 Platform') {
                    dataset.Icon = DatabaseIcon
                    dataset.visibility = true
                    dataset.categoryCount = snapGridSideBarData.length
                    dataset.categories = snapGridSideBarData
                } else {
                    dataset.Icon = FileDatasetIcon
                    dataset.categoryCount = dataset.categories.length
                    dataset.visibility = typeof settings[dataset._id] === 'undefined' ? true : settings[dataset._id]
                    dataset.categories.forEach((category) => {
                        category.file = dataset.file
                        category.layerName = category.name
                    })
                }
            })
            setStateApp((state) => ({ ...state, datasets }));
            datasets = datasets.filter((dataset) => {
                if (dataset._id === changedDataset?._id) dataset.visibility = changedDataset.visibility
                return dataset.visibility
            })
            if (search)
                datasets = datasets.filter((dataset) => dataset.name.toLowerCase().includes(search.toLowerCase()))
            return datasets
        } else
            return []
    }, [_datasets, mapSettings, search, changedDataset])

    const getBorderColor = useCallback((name) => (stateApp?.selectedDataset?.sourceName === name ? '#05aff0' : '#263451'), [stateApp.selectedDataset])

    const onItemClick = (dataset) => {
        dispatch(setMapGridCardState({ mapGridCardActivated: false }));
        if (dataset.sourceName === 'M1 Platform' && stateApp?.selectedDataset?.sourceName !== dataset.sourceName) {
            setStateApp((state) => ({ ...state, layerGridCard: false }));
            dispatch(setMapGridCardState({ mapGridCardActivated: true }));
        } else {
            setStateApp((state) => ({
                ...state,
                selectedLayer: { ...dataset.categories[0] },
                layerGridCard: true,
            }));
            dispatch(setMapGridCardState({ mapGridCardActivated: true }));
        }

        setStateApp((state) => ({ ...state, selectedDataset: dataset }))
    }

    const handleRemove = (dataset, value) => {
        dataset.visibility = value
        setChangedDataset({ ...dataset })

        const updatefn = {};
        const layersSettingsToUpdate = [];
        stateApp.layers.forEach((clayer, layerIndex) => {
            if (clayer.file === dataset.file) {
                updatefn[layerIndex] = { layerSettings: { showable: { $set: value } } };
                layersSettingsToUpdate.push({
                    _id: clayer._id,
                    layerSettings: { ...clayer.layerSettings, showable: value }
                });
            }
        });
        updateUserMapSettings({
            variables: {
                settings: {
                    user: stateApp.user.mongoId,
                    type: 'DatasetVisibility',
                    settings: { [dataset._id]: value },
                },
            },
        });
        if (layersSettingsToUpdate.length > 0)
            updateManyUserLayerSettings({
                variables: {
                    manySettings: layersSettingsToUpdate,
                },
            });

        const newLayers = update(stateApp.layers, updatefn)
        setTimeout(() => { setStateApp({ ...stateApp, layers: newLayers }); }, 0)
    }

    const handleTransfer = (dataset) => {
        setStateApp((state) => ({ ...state, selectedDataset: dataset }))

        setStateMapControls((stateMapControls) => ({
            ...stateMapControls,
            manageSourceLayer: false,
            manageLayer: false,
            manageTransferData: true,
            selectedLayer: null,
        }));
    }

    return (
        <>
            <StyledMenuSecondaryHeaderItem>
                <ListItemText primary={'Data Sources'} />
                {headerButton && (
                    <StyledListItemSecondaryAction>
                        <Button id="managerButton" onClick={() => headerButton.fn('manageSourceLayer')} color="secondary" variant="outlined" startIcon={<LayersIcon fontSize="medium" />}>
                            Manager
                        </Button>
                    </StyledListItemSecondaryAction>
                )}
            </StyledMenuSecondaryHeaderItem>
            <div className={classes.root}>
                {datasets?.map(({ sourceName, Icon, categories, ...rest }) => (
                    <Grid className="item" key={sourceName} onClick={() => onItemClick({ sourceName, Icon, categories, ...rest })}>
                        <Box borderColor={getBorderColor(sourceName)} borderLeft={4} margin={1} marginLeft={0} >

                            <Icon className='dIcon' />
                            <Grid container direction="column" justifyContent="center" style={{ paddingLeft: '45px' }}>
                                <Grid item md={12}>
                                    <Grid container direction="row" justifyContent="space-between" alignItems="center" style={{ width: '100%' }}>
                                        <Grid item style={{ display: 'flex', flexDirection: 'inline' }}>

                                            <Typography style={{
                                                color: '#ffff', textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                width: '254px'
                                            }}>{sourceName}</Typography>
                                        </Grid>
                                        <Grid item className='actionIcons'>
                                            <GridOnIcon className='actionIcon' />
                                            {sourceName === 'M1 Platform' && <Box paddingRight='24px' />}
                                            {sourceName !== 'M1 Platform' && <DatasetMenu setChangedDataset={setChangedDataset} handleRemove={handleRemove} handleTransfer={handleTransfer} dataset={{ sourceName, Icon, categories, ...rest }} />}
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item md={12}>
                                    <Typography variant="body2" gutterBottom style={{ color: 'lightgray' }}>{rest.categoryCount} categories</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                ))}
            </div>
        </>
    );
}

// export default React.memo(Datasets, deepEqualObjects);
