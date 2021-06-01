import React, { useContext } from "react";
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
import ColorPickerDialog from "./components/ColorPickerDialog";
import AddUserData from "./components/addUserData";
import AddUserGroupData from "./components/addUserGroupData";
import AddALayer from "./components/addALayer";
import DrawShapes from "./components/DrawShapes/DrawShapes";
import GpsFixedIcon from "@material-ui/icons/GpsFixed";
import GpsNotFixedIcon from "@material-ui/icons/GpsNotFixed";
import GradientIcon from "@material-ui/icons/Gradient";
import { default as Cube3d } from "../Shared/svgIcons/cube-3d";
import AspectRatioOutlinedIcon from "@material-ui/icons/AspectRatioOutlined";
import { useDispatch, useSelector } from "react-redux";
import { toggleMapGridCardAtived, setMapGridCardState } from "../../actions";
import SidePanel from "../Shared/SidePanel/SidePanel";

const useStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor:'rgba(1, 17, 51, 0.97)',
    borderRadius: "50%",
    border: 0,
    backgroundColor: "rgba(1, 17, 51, 0.97)",
    color: "lightGray",
    "&:hover": {
      color: "#fff",
      background: "rgba(1, 17, 51, 1.0)",
    },
  },
  selected: {
    color: "lightGray !important",
    background: "rgba(1, 17, 51, 0.0) !important",
  },
  speedDial: {
    position: "absolute",
    top: "100px",
    right: theme.spacing(2),
    backgroundColor: "rgba(1, 17, 51, 0.0)",
    padding: "0px",
    zIndex: 5,
  },
  menuIcon: {
    padding: "0px",
    margin: "0px",
    backgroundColor: "rgba(1, 17, 51, 0.97)",
    color: "lightGray",
    "&:hover": {
      color: "#fff",
      background: "rgba(1, 17, 51, 1.0)",
    },
  },
  speedIcon: {
    backgroundColor: "rgba(1, 17, 51, 0.97)",
    color: "lightGray",
    "&:hover": {
      color: "#fff",
      background: "rgba(1, 17, 51, 1.0)",
    },
  },
  fab: {
    backgroundColor: "rgba(1, 17, 51, 0.97)",
    color: "lightGray",
    "&:hover": {
      color: "#fff",
      background: "rgba(1, 17, 51, 1.0)",
    },
  },
  fabActivated: {
    backgroundColor: "rgba(1, 17, 51, 0.97)",
    color: "#fff",
    "&:hover": {
      color: "#fff",
      background: "rgba(1, 17, 51, 1.0)",
    }
  },
  toggleButton: {
    backgroundColor: "rgba(1, 17, 51, 0)",
    border: "0px",
  },
}));

export default function MapControls(props) {
  const dispatch = useDispatch();
  const { mapGridCardActivated, mapGridCardActiveTap } = useSelector(
    ({ MapGridCard }) => MapGridCard
  );
  const [stateMapControls, setStateMapControls] = useContext(
    MapControlsContext
  );

  const [stateApp, setStateApp] = useContext(AppContext);
  const classes = useStyles();

  const toggleSpeedDial = (event) => {
    setStateMapControls({
      ...stateMapControls,
      openSpeedDial: !stateMapControls.openSpeedDial,
    });
  };

  const handleOpen = () => {
    setStateMapControls({ ...stateMapControls, openSpeedDial: true });
  };

  const handleFabClick = (e, action) => {
    let anchorEl = e.currentTarget;

    if (action === "track") {
      anchorEl = null;
      if (mapGridCardActiveTap === 1 && mapGridCardActivated) {
        dispatch(toggleMapGridCardAtived());
      } else {
        dispatch(
          setMapGridCardState({
            mapGridCardActivated: true,
            mapGridCardActiveTap: 1,
          })
        );
      }
    }

    if (action !== "track" && action !== "threed" && action !== "zoomout" && action !== 'draw') {
      setStateMapControls({
        ...stateMapControls,
        selectedControl: action,
        expandedPanel:
          action === stateMapControls.selectedControl &&
            stateMapControls.expandedPanel
            ? false
            : true,
        anchorEl: anchorEl,
      });
    }

    if (action === "draw") {

      setStateMapControls({
        ...stateMapControls,
        selectedMapControl: action,
        selectedControl: 'layer',
      });

      if(!stateApp.editDraw){
        setStateApp((state) => ({
          ...state,
          showDrawShapesPopup: !state.showDrawShapesPopup,
          editDraw: true,
        }));
        }

      if(stateApp.editDraw){
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
        }

    }



    setStateApp((stateApp) => ({
      ...stateApp,
      toggle3d: action === "threed" ? !stateApp.toggle3d : stateApp.toggle3d,
      toggleZoomOut:
        action === "zoomout" ? !stateApp.toggleZoomOut : stateApp.toggleZoomOut,
    }));

    if (stateApp.draw.getMode() !== "simple_select") {
      setStateApp({ ...stateApp, editDraw: false });
      stateApp.draw.changeMode("simple_select");
    }
  };

  const createSpeedDialActions = () => {
    const actions = [
      {
        icon:
          mapGridCardActiveTap === 1 && mapGridCardActivated ? (
            <GpsFixedIcon />
          ) : (
            <GpsNotFixedIcon />
          ),
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
        icon: !stateApp.editDraw ? <EditIcon /> : <CancelIcon />,
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
        name: "Toggle Zoom Out",
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
          fab: action.action === 'layer' && stateMapControls.expandedPanel ? classes.fabActivated : classes.fab,
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


  const openColorPickerControl = (selectedLayer) => {
    if (selectedLayer) {
      return <ColorPickerDialog layer={selectedLayer} />;
    }
  };

  const openAddLayerControl = () => {
    const { addLayer } = stateMapControls;
    if (addLayer) {
      return <AddALayer />;
    }
  };

  return (
    <div>
      <SpeedDial
        id="speed"
        ariaLabel="SpeedDial"
        className={classes.speedDial}
        icon={
          <MenuIcon
            fontSize="small"
            onClick={toggleSpeedDial}
            className={classes.menuIcon}
          />
        }
        onOpen={handleOpen}
        open={stateMapControls.openSpeedDial}
        direction="down"
        FabProps={{ size: "medium" }}
      >
        {createSpeedDialActions()}
      </SpeedDial>
      <SidePanel/>
      {stateMapControls.selectedMapControl === 'draw' ? <DrawShapes /> : null}
      {stateMapControls.selectedControl === 'add' ? <AddUserData /> : null}
      {stateMapControls.selectedControl === 'addGroup' ? <AddUserGroupData /> : null}
      {stateMapControls.selectedLayer
        ? openColorPickerControl(stateMapControls.selectedLayer)
        : null}
      {stateMapControls.addLayer ? openAddLayerControl() : null}
    </div>
  );
}
