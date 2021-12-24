import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Tooltip from "@material-ui/core/Tooltip";
import LayerSelectionIcon from "components/Shared/svgIcons/layerSelection";
import $ from "jquery";

// contexts
import { AppContext } from "AppContext";
import ExpandableSearch from "components/Shared/Forms/Fields/ExpandableSearch";

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
        opacity: 0.7,
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
    // contexts
    const [, setStateApp] = useContext(AppContext);
    const { selectionLayers, parent } = props;

    const handleClose = () => {
        if (parent === "map") {
            if ($("#tempPopupHolder").length) {
                let popUps = document.getElementsByClassName("mapboxgl-popup");
                if (popUps[0]) popUps[0].remove();
            }

            setStateApp((state) => ({
                ...state,
                layerSelectionPopup: false, popupOpen: false
            }));
        }
    };



    return (
        <React.Fragment>
            <Card className={classes.card}>
                <CardHeader
                    classes={{ title: classes.title, subheader: classes.subheader }}
                    // action={
                    //     <div className={classes.headerIcons}>
                    //         <Tooltip title={"Close"} placement="top">
                    //             <IconButton size={"small"} onClick={handleClose} aria-label="close" className={classes.icons}>
                    //                 <CloseIcon color="secondary" />
                    //             </IconButton>
                    //         </Tooltip>
                    //     </div>
                    // }
                    // Expandable Card Title
                    title={GetTitle()}
                // Expandable Card Secondary Header
                // subheader={layer.groupName ? layer.layerName : ""}
                />
                <CardContent className={classes.content}>
                    <Grid container direction="row" alignItems="center" justify="flex" className={classes.contentGrid}>
                        {/* {Object.keys(properties)
                            .filter((prop) => prop !== "shapeCenter")
                            .map((prop) => (
                                <>
                                    <Grid item xs={5}>
                                        {prop}
                                    </Grid>
                                    <Grid item xs={7} style={{ fontWeight: "bold" }}>
                                        {properties[prop]}
                                    </Grid>
                                </>
                            ))} */}
                    </Grid>
                </CardContent>
            </Card>
        </React.Fragment>
    );
}

export default React.memo(LayerSelectionPopup);
