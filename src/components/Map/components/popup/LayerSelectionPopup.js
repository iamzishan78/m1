import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
    Grid, Card, CardHeader, CardContent, Accordion, AccordionSummary, Typography,
    List, ListItem, ListItemText, Tooltip
} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import _ from "lodash";
import LayerSelectionIcon from "components/Shared/svgIcons/layerSelection";

// contexts
import ExpandableSearch from "components/Shared/Forms/Fields/ExpandableSearch";
import capitalizeFirstLetter from "components/Shared/valueformatters/capitalize-first-letter";
import { copy } from "utils/helper";
import { drawBoundary } from "components/MapControls/components/DrawShapes/drawShapesHelpers";
import { ifFileShapeSource, parseUserDefinedLayerFeature } from "components/Shared/functions/shapeLayer";

const useStyles = makeStyles((theme) => ({
    root: {
    },
    card: {
        position: (props) => props.position,
        left: (props) => props.cardLeft,
        borderRadius: 0,
        top: (props) => props.cardTop,
        webkitTransform: "translateZ(0)",
        transition: "width 0.1s, height 0.1s, left 0.1s, top 0.1s",
        width: (props) => props.cardWidth,
        height: (props) => (props.expanded ? props.height : "inherit"),
        opacity: 0.85,
        background: "#0E111A",
        borderStyle: "solid",
        borderWidth: "thin",
        "& .MuiCardHeader-action": {
            alignSelf: "left",
        },
        zIndex: 1250,
    },
    title: {
        fontFamily: "Poppins",
        color: "#FFFFFF",
        fontSize: (props) => (["Contact", "Contact Details", "Add Activity", "Activity Details"].includes(props.title) ? "20px" : "15px"),
    },
    headerIcons: {
        "& .MuiBadge-anchorOriginTopRightRectangle": {
            right: "10px",
            top: "5px",
        },
    },
    subheader: {
        fontFamily: "Poppins",
        color: "#FFFFFF",
        fontSize: "11px",
    },
    content: {
        transition: "height 0.1s",
        background: "#0E111A",
        padding: "0 !important",
        overflowY: "auto",
        height: "325px",
        "&::-webkit-scrollbar": {
            width: "0.75em",
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#929292",
            borderRadius: 10,
        },
    },
    icons: {
        "&:hover": {
            backgroundColor: "#031d40",
        },
        color: "white",
    },
    heading: {
        width: '345px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    accordian: {
        color: 'white',
        background: '#0E111A',
        margin: '0px !important',
        '& ..MuiCardHeader-root': {
            paddingBottom: '0px'
        },
        '& .MuiSvgIcon-root': {
            color: 'white'
        },
        '& .MuiAccordionSummary-root.Mui-expanded': {
            minHeight: '48px'
        },
        '& .MuiAccordionSummary-content.Mui-expanded': {
            minHeight: '12px',
            margin: '0px'
        },
        '& .MuiListItem-button:hover': {
            backgroundColor: 'rgb(184 184 184 / 29%)'
        },
        '& .MuiListItem-root, & .MuiList-padding': {
            paddingTop: '0px',
            paddingBottom: '0px',
            color: '#d3d3d3'
        }
    }
}));


const startsWith = (value, keys) => {
    let val = false
    keys.forEach(key => {
        if (key && key.toString().toLowerCase().startsWith(value.toLowerCase())) {
            val = true
            return
        }
    })
    return val
}

function LayerSelectionPopup(props) {
    const classes = useStyles(props);
    const history = useHistory();
    const [search, setSearch] = useState('');
    // contexts
    let { selectionLayers } = props;

    const getSourceName = (name) => {
        name = name.replace('VT', '').replace('_source', '')
        return capitalizeFirstLetter(name)
    }

    const getLayerName = (layer) => {
        if (layer.properties) {
            const properties = layer?.properties
            if (layer.source === 'wellsVT') {
                return `${properties.api}-${properties.wellName}`
            } else if (layer.source === 'parcels_source' || layer.source === 'area of interest_source') {
                return properties.shapeLabel
            } else if (layer.source === 'units_source') {
                return `${properties.uNumber ? properties.uNumber + '-' : ''}${properties.shapeLabel}`
            } else if (properties.layerShapeName) {
                return layer.properties.Unit_Name || layer.layer.id
            } else
                return `${properties.agreementNumber ? properties.agreementNumber + '-' : ''}${properties.agreementName}`
        }
    }

    const selectLayer = (layer) => {
        if (ifFileShapeSource(layer.source) && layer.properties.layerShapeName) {
            const jsonLayer = copy(layer)

            const featureLayer = { ...jsonLayer.layer };
            const feature = parseUserDefinedLayerFeature(jsonLayer, featureLayer)

            if (props.map)
                drawBoundary(props.map, feature);

            props.setStateApp((state) => {
                return {
                    ...state,
                    selectedUserDefinedLayer: jsonLayer,
                    selectedParcel: null,
                };
            });
            props.setStateApp((state) => {
                if (!state.showDrawShapesPopup && state.shapeEditMode !== 'redraw') {
                    props.createUDPopUp(feature.properties);
                }
                return state;
            });
            props.map?.resize?.();

            return
        } else if (layer.source === "area of interest_source") {
            const selectedUserDefinedLayer = copy(layer)
            props.setStateApp((state) => {
                if (state.isDrawing) return state;
                state = {
                    ...state,
                    showShapeActionsPopup: true,
                    selectedUserDefinedLayer,
                    selectedParcel: null,
                    openDrawShapesControl: true,
                };
                drawBoundary(props.map, selectedUserDefinedLayer);
                if (!state.editDraw) {
                    state = {
                        ...state,
                        showDrawShapesPopup: !state.showDrawShapesPopup,
                        editDraw: true,
                    };
                } else {
                    state = {
                        ...state,
                        editDraw: false,
                        currentFeature: undefined,
                        isAbstractedLayersPolygon: false,
                        multiSelectLandGrids: false,
                        selectedAbstracts: [],
                        showShapeActionsPopup: false,
                        showDrawShapesPopup: false,
                    };
                }
                return state;
            });
            return
        }

        let newPath
        if (layer.source === 'wellsVT') {
            newPath = `/map/wells/${layer.properties.id}/${layer.properties.latitude}/${layer.properties.longitude}`;
        } else {
            newPath = `/map/${layer.source.replace("_source", "")}/${layer.properties.id}`;
        }

        history.location.pathname !== newPath && history.replace(newPath);
    }

    selectionLayers.forEach((selectionLayer) => {
        selectionLayer.sourceKey = selectionLayer.source
        if (ifFileShapeSource(selectionLayer.source) && selectionLayer?.properties?.layerShapeName)
            selectionLayer.sourceKey = selectionLayer?.properties.layerShapeName
    })

    if (search)
        selectionLayers = selectionLayers.filter((selectionLayer) => {
            const properties = selectionLayer?.properties
            if (selectionLayer.source === 'wellsVT') {
                return startsWith(search, [properties.api, properties.wellName])
            } else if (selectionLayer.source === 'parcels_source') {
                return startsWith(search, [properties.shapeLabel])
            } else if (selectionLayer.source === 'units_source') {
                return startsWith(search, [properties.uNumber, properties.shapeLabel])
            } else
                return startsWith(search, [properties.agreementNumber, properties.agreementName])
        })
    const groupFeatures = _.groupBy(selectionLayers, 'sourceKey');
    // console.log(groupFeatures)
    function GetTitle() {
        const classes = useStyles();

        const [clicked, setClicked] = useState(false);

        let style
        if (!clicked && search.length === 0) {
            style = { visibility: 'visible', }
        } else {
            style = { opacity: 0, height: 0, visibility: 'hidden' }
        }
        return (
            <Grid container direction="row" justifyContent="space-between" style={{ justifyContent: 'space-between' }} alignItems="center">
                <Grid item style={style}>
                    <Grid container direction="row" spacing={1} alignItems="center">
                        <Grid item>
                            <LayerSelectionIcon className={classes.icons} />
                        </Grid>
                        <Grid item>
                            Available Layers 123
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item >
                    <ExpandableSearch setSearch={setSearch} search={search} setClicked={setClicked} focusColor='inherit' hoverColor={'inherit'} />
                </Grid>
            </Grid>
        );
    };

    return (
        <React.Fragment>
            <Card className={classes.card}>
                <CardHeader
                    classes={{ title: classes.title, subheader: classes.subheader }}
                    title={GetTitle()}
                >
                </CardHeader >
                <CardContent className={classes.content}>
                    {
                        Object.keys(groupFeatures).map((key) =>
                            <Accordion key={key} defaultExpanded={true} className={classes.accordian}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    {
                                        getSourceName(key).length > 38 ? <Tooltip title={getSourceName(key)}>
                                            <Typography className={classes.heading}>{getSourceName(key)}</Typography>
                                        </Tooltip> : <Typography className={classes.heading}>{getSourceName(key)}</Typography>
                                    }
                                </AccordionSummary>
                                <List component="nav" aria-label="secondary mailbox folders">
                                    {
                                        groupFeatures[key].map((layer) =>
                                            <ListItem key={layer.layer.id} button onClick={() => { selectLayer(layer) }}>
                                                <ListItemText primary={getLayerName(layer)} />
                                            </ListItem>)
                                    }

                                </List>
                            </Accordion>
                        )
                    }
                </CardContent>
            </Card>
        </React.Fragment>
    );
}

export default React.memo(LayerSelectionPopup);
