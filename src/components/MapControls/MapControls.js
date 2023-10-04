import React, { useEffect, useContext } from "react";
import { MapControlsContext } from "./MapControlsContext";
import { AppContext } from "../../AppContext";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import LayersIcon from "@material-ui/icons/Layers";
import LanguageIcon from "@material-ui/icons/Language";
import EditIcon from "@material-ui/icons/Edit";
import MenuIcon from "@material-ui/icons/Menu";
import CancelIcon from "@material-ui/icons/Cancel";
import { makeStyles } from "@material-ui/core/styles";
import AddUserData from "./components/addUserData";
import AddUserGroupData from "./components/addUserGroupData";
import DrawShapes from "./components/DrawShapes/DrawShapes";
import GpsFixedIcon from "@material-ui/icons/GpsFixed";
import GpsNotFixedIcon from "@material-ui/icons/GpsNotFixed";
import GradientIcon from "@material-ui/icons/Gradient";
import { default as Cube3d } from "../Shared/svgIcons/cube-3d";
import AspectRatioOutlinedIcon from "@material-ui/icons/AspectRatioOutlined";
import { useDispatch, useSelector } from "react-redux";
import { toggleMapGridCardAtived, setMapGridCardState } from "../../actions";
import SidePanel from "../Shared/SidePanel/SidePanel";
import { clearMapAndCloseShapeActionsPopup } from "./commonHelper";
import { fade } from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor:'rgba(1, 17, 51, 0.97)',
    borderRadius: "50%",
    border: 0,
    // backgroundColor: "rgba(1, 17, 51, 0.97)",
    // backgroundColor: "#0e111a",
    // color: "lightGray",
    "&:hover": {
      color: "#fff",
      // background: "rgba(1, 17, 51, 1.0)",
    },
  },
  selected: {
    // color: "lightGray !important",
    // background: "rgba(1, 17, 51, 0.0) !important",
  },
  speedDial: {
    position: "absolute",
    top: "100px",
    right: theme.spacing(2),
    // backgroundColor: "rgba(1, 17, 51, 0.0)",
    padding: "0px",
    zIndex: 5,
  },
  menuIcon: {
    padding: "0px",
    margin: "0px",
    backgroundColor: "rgba(1, 17, 51, 0.97)",
    // backgroundColor: "#0e111a",

    color: "lightGray",
    "&:hover": {
      color: "#fff",
      background: "rgba(1, 17, 51, 1.0)",
    },
  },
  speedIcon: {
    // backgroundColor: "rgba(1, 17, 51, 0.97)",
    backgroundColor: "#0e111a",

    color: "lightGray",
    "&:hover": {
      color: "#fff",
      // background: "rgba(1, 17, 51, 1.0)",
    },
  },
  fab: {
    // backgroundColor: "rgba(1, 17, 51, 0.97)",
    backgroundColor: "#0e111a",
    color: "lightGray",
    "&:hover": {
      color: "#fff",
      // background: "rgba(1, 17, 51, 1.0)",
      backgroundColor: fade(theme.palette.common.white, 0.25),

    },
  },
  fabActivated: {
    // backgroundColor: "rgba(1, 17, 51, 0.97)",
    backgroundColor: "#0e111a",
    color: "rgba(23, 170, 221, 1)",
    "&:hover": {
      color: "#fff",
      // background: "rgba(1, 17, 51, 1.0)",
      backgroundColor: fade(theme.palette.common.white, 0.25),

    },
  },
  toggleButton: {
    // backgroundColor: "rgba(1, 17, 51, 0)",
    border: "0px",
  },
}));

export default function MapControls(props) {
  const dispatch = useDispatch();
  const { mapGridCardActivated, mapGridCardActiveTap } = useSelector(({ MapGridCard }) => MapGridCard);
  const [stateMapControls, setStateMapControls] = useContext(MapControlsContext);

  const [stateApp, setStateApp] = useContext(AppContext);
  const classes = useStyles();

  useEffect(() => {
    if (stateMapControls.expandedPanel !== props.expandedPanel || stateMapControls.openSpeedDial !== props.openSpeedDial) {
      setStateMapControls((state) => ({ ...state, expandedPanel: props.expandedPanel, openSpeedDial: props.openSpeedDial }));
    }
  }, []);

  useEffect(() => {
    if (stateApp.selectedUserDefinedLayer) {
      setStateMapControls((state) => ({ ...state, selectedMapControl: "draw", selectedControl: "layer" }));
    }
  }, [stateApp.selectedUserDefinedLayer]);

  useEffect(() => {
    if (stateApp.selectedAbstracts.length > 0) {
      setStateApp((state) => ({ ...state, showDrawShapesPopup: true }));
      setStateMapControls((state) => ({ ...state, selectedMapControl: "draw", selectedControl: "layer" }));
    }
  }, [stateApp.selectedAbstracts]);

  const toggleSpeedDial = (event) => {
    setStateMapControls({
      ...stateMapControls,
      openSpeedDial: !stateMapControls.openSpeedDial,
    });
  };

  const handleOpen = () => {
    setStateMapControls({ ...stateMapControls, openSpeedDial: true });
  };

  const handleCloseLeftSidePanel = () => {
    // close layer manager
    setStateMapControls({
      ...stateMapControls,
      expandedPanel: false,
      anchorEl: null,
    });
  };

  const handleCloseShapeDrawer = () => {
    const { map } = stateApp;
    setStateApp((state) => ({
      ...state,
      editDraw: false,
      currentFeature: undefined,
      isAbstractedLayersPolygon: false,
      multiSelectLandGrids: false,
      selectedAbstracts: [],
      showShapeActionsPopup: false,
      showDrawShapesPopup: false,
    }));

    // unselecting the grids
    const featuresList = map?.getSource("abstract_geo_source")?._data?.features || [];
    for (let i = 0; i < featuresList.length; i++) {
      const id = featuresList[i].properties.Id;
      map.setFeatureState({ source: "abstract_geo_source", id: id }, { click: false });
    }

    // Removing layer of AOI Label
    if (stateApp.map?.getLayer("aoi_label_layer")) {
      stateApp.map?.removeLayer("aoi_label_layer");
    }
    setStateApp((state) => ({
      ...state,
      selectedAoi: null,
      featureOrMapShape: null,
    }));
  };

  const handleCloseDetailedCards = () => {
    // close detailed cards
    setStateApp((state) => ({
      ...state,
      popupOpen: false,
      selectedWell: null,
      selectedParcel: null,
      expandedCard: false,
      activateWellDetailsFromTable: false,
    }));

    // close doc viewer
    setStateApp((state) => ({
      ...state,
      viewDoc: null,
    }));
  };

  const handleFabClick = (e, action) => {
    if (stateApp.expandedCard === true) {
      handleCloseLeftSidePanel();
      handleCloseShapeDrawer();
    }

    if (e && action) {
      let anchorEl = e.currentTarget;

      if (action === "track") {
        anchorEl = null;
        handleCloseLeftSidePanel();
        handleCloseShapeDrawer();
        handleCloseDetailedCards();

        if (mapGridCardActiveTap === 1 && mapGridCardActivated) {
          dispatch(toggleMapGridCardAtived());
        } else {
          dispatch(toggleMapGridCardAtived());
          // dispatch(
          //   setMapGridCardState({
          //     mapGridCardActivated: true,
          //     mapGridCardActiveTap: 1,
          //   })
          // );
        }
      }

      if (action === "base" || action === "heatMaps" || action === "layer") {
        setStateMapControls({
          ...stateMapControls,
          selectedControl: action,
          expandedPanel: action === stateMapControls.selectedControl && stateMapControls.expandedPanel ? false : true,
          anchorEl: anchorEl,
        });
        handleCloseDetailedCards();
      }

      if (action === "draw") {
        setStateMapControls({
          ...stateMapControls,
          selectedMapControl: action,
          // selectedControl: 'layer',
        });

        if (!stateApp.editDraw) {
          setStateApp((state) => ({
            ...state,
            popupOpen: false,
            currentFeature: undefined,
            showDrawShapesPopup: true,
            editDraw: true,
            showAddShapePopup: false,
          }));
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

    if (stateApp.draw && stateApp.draw.getMode() !== "simple_select") {
      setStateApp({ ...stateApp, editDraw: false });
      stateApp.draw.changeMode("simple_select");
    }
  };

  const createSpeedDialActions = () => {
    const actions = [
      {
        icon: mapGridCardActiveTap === 1 && mapGridCardActivated ? <GpsFixedIcon /> : <GpsNotFixedIcon />,
        name: "Tracked",
        action: "track",
      },
      { icon: <LanguageIcon id="base" />, name: "Base Map", action: "base" },
      { icon: <LayersIcon id="layer" />, name: "Layers", action: "layer" },
      {
        icon: <GradientIcon id="heatMaps" />,
        name: "Heatmaps",
        action: "heatMaps",
      },
      {
        icon: !stateApp.editDraw ? <EditIcon id="mapEditIcon" /> : <CancelIcon />,
        name: "Draw",
        action: "draw",
      },
      {
        icon: <Cube3d />,
        name: "Toggle 3D",
        action: "threed",
      },
      {
        icon: <AspectRatioOutlinedIcon />,
        name: "Zoom To Default Map Position",
        action: "zoomout",
      },
      // temp delete for marketplace
      // {
      //   icon: <AttachMoneyIcon />,
      //   name: "Marketplace",
      //   action: "marketplace",
      // },
    ];

    return actions.map((action) => (
      <SpeedDialAction
        classes={{
          fab: action.action === stateMapControls.selectedControl && stateMapControls.expandedPanel ? classes.fabActivated : classes.fab,
        }}
        id={action.name}
        key={action.name}
        icon={action.icon}
        tooltipTitle={action.name}
        onClick={(e) => {
          handleFabClick(e, action.action);
        }}
      />
    ));
  };

  useEffect(() => {
    if (stateApp.expandedCard) {
      handleFabClick();
    }
  }, [stateApp.expandedCard]);

  // useEffect(() => {
  //   if (stateApp.openDrawShapesControl === true) {
  //     setStateMapControls((state) => ({
  //       ...state,
  //       selectedMapControl: "draw",
  //       // openDrawShapesControl: true,
  //     }));

  //     handleFabClick();
  //   }
  // }, [stateApp.openDrawShapesControl]);

  return (
    <div>
      {props.openSpeedDial !== false && (
        <SpeedDial
          id="speed"
          ariaLabel="SpeedDial"
          className={classes.speedDial}
          icon={<MenuIcon fontSize="small" onClick={toggleSpeedDial} className={classes.menuIcon} />}
          onOpen={handleOpen}
          open={stateMapControls.openSpeedDial}
          direction="down"
          FabProps={{ size: "medium" }}
        >
          {createSpeedDialActions()}
        </SpeedDial>
      )}

      {!props.showExpandableCard && !props.expandedCard && <SidePanel />}

      {stateMapControls.selectedMapControl === "draw" ? <DrawShapes /> : null}
      {stateMapControls.layerAddControl === "add" ? <AddUserData /> : null}
      {stateMapControls.layerAddControl === "addGroup" ? <AddUserGroupData /> : null}
    </div>
  );
}
