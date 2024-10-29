import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
    Grid, Card, CardHeader, CardContent, Accordion, AccordionSummary, Typography,
    List, ListItem, ListItemText, Tooltip, IconButton 
} from "@material-ui/core";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import _ from "lodash";
import LayerSelectionIcon from "components/Shared/svgIcons/layerSelection";

// contexts
import ExpandableSearch from "components/Shared/Forms/Fields/ExpandableSearch";
import capitalizeFirstLetter from "components/Shared/valueformatters/capitalize-first-letter";
import onFeatureClick from "components/Map/DeckGL/helpers/onFeatureClick";
import mglStreetViewControl from 'components/Map/DeckGL/helpers/mglStreetViewControl';

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
    },
    locationIcon: {
        paddingTop: "5px",
        marginRight: "-25px"
    }
}));


const includes = (value, keys) => {
    let val = false
    keys.forEach(key => {
        if (key && key.toString().toLowerCase().includes(value.toLowerCase())) {
            val = true
            return
        }
    })
    return val
}

function LayerSelectionPopup(props) {
    const classes = useStyles(props);
    const [search, setSearch] = useState('');
    // contexts
    let { selectionLayers } = props;

    const getSourceName = (name) => {
        return capitalizeFirstLetter(name)
    }

    const getLayerName = layer => {
        const object = layer.object || layer;

        if (object.properties) {
            const properties = object?.properties;

            const labels = [];

            switch (layer.sourceKey) {
                case 'Wells':
                case 'My Wells':
                    labels.push(properties.api);
                    labels.push(properties.wellName);
                    break;

                case 'Parcels':
                case 'Area of Interest':
                    labels.push(properties.shapeLabel || properties.label);
                    break;

                case 'Units':
                    labels.push(properties.uNumber);
                    labels.push(properties.shapeLabel || properties.label);
                    break;

                case 'Recent Submitted Permits':
                    labels.push(properties.PermitId);
                    break;

                default:
                    if (properties.layerShapeName) {
                        labels.push(
                            properties.Unit_Name || properties.layerShapeName || layer.layer.id
                        );
                    } else {
                        labels.push(properties.agreementNumber);
                        labels.push(properties.agreementName);
                    }
                    break;
            }

            return labels.filter(Boolean).join(' - ');
        }
    };

    const selectLayer = (layer) => {
        onFeatureClick(layer);
    }

    selectionLayers.forEach((selectionLayer) => {
        selectionLayer.sourceKey = selectionLayer.layer.id.split('_')[0];
        if (selectionLayer?.object?.properties?.layerShapeName) {
            selectionLayer.sourceKey = selectionLayer?.object?.properties?.layerShapeName
        }
    })

    if (search)
        selectionLayers = selectionLayers.filter((selectionLayer) => {
            const properties = selectionLayer?.object?.properties;
            if (selectionLayer.sourceKey === 'Wells') {
                return includes(search, [properties.api, properties.wellName])
            } else if (selectionLayer.sourceKey === 'Parcels') {
                return includes(search, [properties.shapeLabel])
            } else if (selectionLayer.sourceKey === 'Units') {
                return includes(search, [properties.uNumber, properties.shapeLabel])
            } else if (selectionLayer.sourceKey === 'Recent Submitted Permits') {
                return includes(search, [properties.PermitId])
            } else
                return includes(search, [properties.agreementNumber, properties.agreementName])
        })
    const groupFeatures = _.groupBy(selectionLayers, 'sourceKey');

    const handleLocationClick = () => {
        const coordinate = selectionLayers[0].object.properties.shapeCenter
        const latitude = coordinate[1]; 
        const longitude = coordinate[0]; 
        // Google Maps Street View URL
        const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latitude},${longitude}`;

        window.open(streetViewUrl, '_blank');
    };


    function GetTitle({ handleLocationClick}) {
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
                            Available Layers
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item >
                    <IconButton
                        className={classes.locationIcon}
                        color="inherit"
                        onClick={handleLocationClick}
                    >
                        <LocationOnIcon />
                    </IconButton>
                    <ExpandableSearch setSearch={setSearch} search={search} setClicked={setClicked} focusColor='inherit' hoverColor={'inherit'} />
                </Grid>
            </Grid>
        );
    };

    return (
        <React.Fragment>
            <Card className={classes.card} data-testid='layer-selection-popup' >
                <CardHeader
                    classes={{ title: classes.title, subheader: classes.subheader }}
                    title={<GetTitle handleLocationClick={handleLocationClick} />}
                >
                </CardHeader >
                <CardContent className={classes.content}>
                    {
                        Object.keys(groupFeatures).map((key) =>
                            <Accordion key={key} defaultExpanded={true} className={classes.accordian} data-testid={`${key}-group`} >
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
