import React, { useEffect, useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Tooltip from "@material-ui/core/Tooltip";
import $ from "jquery";
import CircularProgress from "@material-ui/core/CircularProgress";

// contexts
import { AppContext } from "../../AppContext";

const useStyles = makeStyles((theme) => ({
  root: {
    // zIndex: 88888,
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
    background: "#112040",
    borderStyle: "solid",
    borderWidth: "thin",
    borderColor: "#112040",
    "& .MuiCardHeader-action": {
      alignSelf: "left",
    },
    zIndex: 1250,
    // "&.MuiCard-root": {
    //     maxWidth: props => props.width
    // }
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
    backgroundColor: "#fffff",
    transition: "height 0.1s",
    background: "#fff",
    padding: "0 !important",
    overflowY: "auto",
    height: "325px",
    "&::-webkit-scrollbar": {
      width: "0.75em",
    },
    // "&:hover::-webkit-scrollbar": {
    //     width: "1.0em",
    // },
    // "&::-webkit-scrollbar-track": {
    //     "-webkitBoxShadow": "inset 0 0 6px rgba(0,0,0,0.00)",
    // },

    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#929292",
      borderRadius: 10,
    },
    height: "fit-content",
  },
  icons: {
    "&:hover": {
      backgroundColor: "#031d40",
    },
    color: "white",
  },
  iconPolygon: {
    color: "#FFFFFF",
    stroke: "#FFFFFF",
    fill: "#FFFFFF",
    marginRight: "10px",
  },
}));

function UdLayerCard(props) {
  const classes = useStyles(props);
  // contexts
  const [, setStateApp] = useContext(AppContext);
  const {
    selectedUserDefinedLayer: { layer, properties },
    parent,
  } = props;

  //   const [openDialog, setOpenDialog] = useState(false);

  const handleClose = () => {
    if (parent === "map") {
      if ($("#tempPopupHolder").length) {
        let popUps = document.getElementsByClassName("mapboxgl-popup");
        if (popUps[0]) popUps[0].remove();
      }

      setStateApp((state) => ({
        ...state,
        popupOpen: false,
        selectedWell: null,
        selectedParcel: null,
        selectedPermit: null,
        expandedCard: false,
        viewDoc: null,
      }));
    }
    // props.handleCloseExpandableCard();
    //if EC is inside map popup you need to close it
  };

  const getTitle = () => {
    const { layerName, groupName } = layer;
    if (!layerName && !groupName) {
      return "--";
    }
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
          marginRight: "48px",
        }}
      >
        {!groupName ? <div>{layerName}</div> : <div>{groupName}</div>}
      </div>
    );
  };

  console.log("Title Rendered: ", props.title);

  //   useEffect(() => {
  //     ///Set body style overflow hidden when card is fully expanded
  //     const disableBodyScrollBarIfExpanded = () => {
  //       if (cardWidth === "100vw") {
  //         document.body.style.overflow = "hidden";
  //       }
  //     };

  //     disableBodyScrollBarIfExpanded();
  //     return () => {
  //       document.body.style.overflow = "auto";
  //     };
  //   }, [openDialog, props.targetLabel, isExpanded, width]);

  return (
    <React.Fragment>
      <Card className={classes.card}>
        <CardHeader
          classes={{ title: classes.title, subheader: classes.subheader }}
          action={
            <div className={classes.headerIcons}>
              <Tooltip title={"Close"} placement="top">
                <IconButton size={"small"} onClick={handleClose} aria-label="close" className={classes.icons}>
                  <CloseIcon color="secondary" />
                </IconButton>
              </Tooltip>
            </div>
          }
          // Expandable Card Title
          title={getTitle()}
          // Expandable Card Secondary Header
          subheader={layer.groupName ? layer.layerName : ""}
        />
        <CardContent className={classes.content}>
          <Grid container direction="row" alignItems="center" justify="flex" style={{ padding: 20 }}>
            {Object.keys(properties)
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
              ))}
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
}

UdLayerCard.whyDidYouRender = true;
export default React.memo(UdLayerCard);
