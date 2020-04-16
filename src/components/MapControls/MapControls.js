import React, { useContext } from "react";
import { MapControlsContext } from "./MapControlsContext";
import { AppContext } from "../../AppContext";
import { MapContext } from "../Map/MapContext";

//material-ui components
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import LayersIcon from "@material-ui/icons/Layers";
import LanguageIcon from "@material-ui/icons/Language";
import EditIcon from "@material-ui/icons/Edit";
import MenuIcon from "@material-ui/icons/Menu";
//import ToggleButton from "@material-ui/lab/ToggleButton";
// import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
// import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import CancelIcon from "@material-ui/icons/Cancel";
import { makeStyles } from "@material-ui/core/styles";
//components
import BaseMapStyles from "./components/BaseMapStyles";
import CheckboxList from "./components/CheckboxList";
import CheckboxListHeatmaps from "./components/CheckboxListHeatmaps";
import DrawShapes from "./components/DrawShapes/DrawShapes";
import TrackedWellsMapCard from "./components/TrackedWellsMapCard";
import GpsFixedIcon from "@material-ui/icons/GpsFixed";
import GpsNotFixedIcon from "@material-ui/icons/GpsNotFixed";
import GradientIcon from "@material-ui/icons/Gradient";
import { default as Cube3d } from "../Shared/svgIcons/cube-3d";

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
  toggleButton: {
    backgroundColor: "rgba(1, 17, 51, 0)",
    border: "0px",
  },
}));

export default function MapControls(props) {
  const [stateMapControls, setStateMapControls] = useContext(
    MapControlsContext
  );
  const [stateMap, setStateMap] = useContext(MapContext);
  const [stateApp, setStateApp] = useContext(AppContext);
  const classes = useStyles();
  const { changeHeatmaps, changeLayers } = props;

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
      if (stateMapControls.selectedControl === "track") {
        action = null;
      }
    }

    setStateMapControls({
      ...stateMapControls,
      selectedControl: action,
      anchorEl: anchorEl,
    });

    // setStateMap({
    //   ...stateMap,
    //   openTrack: action === "track" ? !stateMap.openTrack : stateMap.openTrack,
    // });

    setStateMap({
      ...stateMap,
      toggle3d: action === "threed" ? !stateMap.toggle3d : stateMap.toggle3d,
    });
    // console.log(stateMap.toggle3d);

    if (stateMap.draw.getMode() !== "simple_select") {
      setStateApp({ ...stateApp, editDraw: false });
      stateMap.draw.changeMode("simple_select");
    }
  };

  const createSpeedDialActions = () => {
    const actions = [
      {
        icon: stateMapControls.selectedControl !== "track" ? <GpsNotFixedIcon /> : <GpsFixedIcon />,
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
    ];

    return actions.map((action) => (
      <SpeedDialAction
        classes={{
          fab: classes.fab,
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

  const openSelectedControl = () => {
    const { selectedControl } = stateMapControls;
    switch (selectedControl) {
      case "base":
        return <BaseMapStyles />;
      case "layer":
        return <CheckboxList changeLayers={changeLayers} />;
      case "heatMaps":
        return <CheckboxListHeatmaps changeHeatmaps={changeHeatmaps} />;
      case "draw":
        return <DrawShapes />;
      case "track":
        return <TrackedWellsMapCard />;
      default:
        return null;
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
        //onClose={handleClose}
        onOpen={handleOpen}
        open={stateMapControls.openSpeedDial}
        direction="down"
        FabProps={{ size: "medium" }}
      >
        {createSpeedDialActions()}
      </SpeedDial>
      {stateMapControls.selectedControl ? openSelectedControl() : null}
    </div>
  );
}
