import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Tooltip from "@material-ui/core/Tooltip";
import $ from "jquery";

// contexts
import { AppContext } from "../../AppContext";
import { clearMapAndCloseShapeActionsPopup } from "components/MapControls/commonHelper";
import LayerIcon from "@material-ui/icons/Layers";
import { popupController } from "hookstate/popupStateController";
import { drawController } from "hookstate/drawStateController";
import { layerRefs } from "hookstate";
import { mapControlsController } from "hookstate/mapControlsController";

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
    background: "#112040",
    borderStyle: "solid",
    borderWidth: "thin",
    borderColor: "#112040",
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
  headerContainer: {
    wordBreak: 'break-word',
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

export const getUdLayerCardTitle = ({ layer, properties }) => {
  let { layerName, groupName, id } = layer;
  layerName = layerName || properties.Unit_Name || id
  if (!layerName && !groupName) {
    return "--";
  }
  return groupName || layerName;
};

function UdLayerCard(props) {
  const classes = useStyles(props);
  // contexts
  const [stateApp, setStateApp] = useContext(AppContext);

  const handleCloseLeftSidePanel = () => {
    // close layer manager
    console.log(2)

    mapControlsController.setState({ expandedPanel: false })
  };

  const handleCloseShapeDrawer = () => {
    drawController.reset();

    // Removing layer of AOI Label
    if (stateApp.map?.getLayer("aoi_label_layer")) {
      stateApp.map?.removeLayer("aoi_label_layer");
    }

    const sourceId = layerRefs.abstract_geo?.get({ noproxy: true })?.sourceId;

    if (!sourceId) return;

    // unselecting the grids
    const featuresList = window.mapRef?.getSource(sourceId)?._data?.features || [];
    for (let i = 0; i < featuresList.length; i++) {
      const id = featuresList[i].properties.Id;
      window.mapRef?.setFeatureState({ source: sourceId, id: id }, { click: false });
    }
  };

  const handleAddShapeClick = (e, action) => {
    if (!!popupController.getValue('expandedCard')) {
      handleCloseLeftSidePanel();
      handleCloseShapeDrawer();
    }

    if (e && action) {
      if (action === "draw") {
        mapControlsController.updateState({ selectedMapControl: action })

        if (!drawController.getValue('editDraw')) {
          popupController.reset();

          drawController.updateState({ showAddShapePopup: true });
        } else {
          clearMapAndCloseShapeActionsPopup(stateApp, setStateApp);
        }
      }
    }

    setStateApp((stateApp) => ({
      ...stateApp,
      toggle3d: action === "threed" ? !stateApp.toggle3d : stateApp.toggle3d,
      toggleZoomOut: action === "zoomout" ? !stateApp.toggleZoomOut : stateApp.toggleZoomOut,
    }));

    if (window.drawRef && window.drawRef.getMode() !== "simple_select") {
      drawController.updateState({
        editDraw: false,
      });
      window.drawRef.changeMode("simple_select");
    }
  };


  if (!props.selectedUserDefinedLayer) {
    return <></>
  }
  const {
    selectedUserDefinedLayer: { layer, properties },
    parent,
  } = props;

  const handleClose = () => {
    if (parent === "map") {
      if ($("#tempPopupHolder").length) {
        let popUps = document.getElementsByClassName("mapboxgl-popup");
        if (popUps[0]) popUps[0].remove();
      }

      popupController.reset();
      drawController.reset();

      setStateApp((state) => ({
        ...state,
        viewDoc: null,
      }));
    }
  };

  const getTitle = () => {
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
        {getUdLayerCardTitle({ layer, properties })}
      </div>
    );
  };

  return (
    <React.Fragment>
      <Card className={classes.card}>
        <CardHeader
          data-testid='ud-layer-card-header'
          classes={{ title: classes.title, subheader: classes.subheader }}
          className={classes.headerContainer}
          action={
            <div className={classes.headerIcons}>
              <Tooltip title={"Add Shape to Layer"} placement="top">
                <IconButton size={"small"} onClick={(e) => handleAddShapeClick(e, 'draw')} aria-label="close" className={classes.icons}>
                  <LayerIcon color="secondary" />
                </IconButton>
              </Tooltip>
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
          <Grid container direction="row" alignItems="center" justify="flex" className={classes.contentGrid}>
            {Object.keys(properties)
              .filter((prop) => prop !== "shapeCenter" && prop !== "originalProperties")
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
