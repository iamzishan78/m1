import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
    Grid, Card, CardHeader, CardContent, Accordion, AccordionSummary, Typography,
    List, ListItem, ListItemText
} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import _ from "lodash";
import LayerSelectionIcon from "components/Shared/svgIcons/layerSelection";

// contexts
import ExpandableSearch from "components/Shared/Forms/Fields/ExpandableSearch";
import capitalizeFirstLetter from "components/Shared/valueformatters/capitalize-first-letter";

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
        background: "black",
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
        background: "black",
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
    contentGrid: {
        padding: 20,
    },
    accordian: {
        color: 'white',
        background: 'black',
        margin: '0px !important',
        '& .MuiSvgIcon-root': {
            color: 'white'
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
            color: '#8d8d8e'
        }
    }
}));

function GetTitle() {
    const classes = useStyles();

    const [search, setSearch] = useState('');
    return (
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
            <Grid item>
                <Grid container direction="row" spacing={1} alignItems="center">
                    <Grid item>
                        <LayerSelectionIcon className={classes.icons} />
                    </Grid>
                    <Grid item>
                        Available Layers
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <ExpandableSearch setSearch={setSearch} search={search} />
            </Grid>
        </Grid>
    );
};

function LayerSelectionPopup(props) {
    const classes = useStyles(props);
    const history = useHistory();
    // contexts
    const { selectionLayers } = props;

    const getSourceName = (name) => {
        name = name.replace('VT', '').replace('_source', '')
        return capitalizeFirstLetter(name)
    }

    const getLayerName = (layer) => {
        if (layer.source === 'wellsVT') {
            return layer.properties.wellName
        } else
            return layer.properties.shapeLabel
    }

    const selectLayer = (layer) => {
        let newPath
        if (layer.source === 'wellsVT') {
            newPath = `/map/wells/${layer.properties.id}/${layer.properties.latitude}/${layer.properties.longitude}`;
        } else {
            newPath = `/map/${layer.source.replace("_source", "")}/${layer.properties.id}`;
        }

        history.location.pathname !== newPath && history.replace(newPath);
    }

    const groupFeatures = _.groupBy(selectionLayers, 'source');
    console.log(groupFeatures)

    return (
        <React.Fragment>
            <Card className={classes.card}>
                <CardHeader
                    classes={{ title: classes.title, subheader: classes.subheader }}
                    title={GetTitle()}
                />
                <CardContent className={classes.content}>
                    {
                        Object.keys(groupFeatures).map((key) =>
                            <Accordion key={key} defaultExpanded={true} className={classes.accordian}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography className={classes.heading}>{getSourceName(key)}</Typography>
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
