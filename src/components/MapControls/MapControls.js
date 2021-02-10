import React, { useContext } from "react";
import { MapControlsContext } from "./MapControlsContext";
import { AppContext } from "../../AppContext";
import { useMutation } from "@apollo/client";
//material-ui components
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import LayersIcon from "@material-ui/icons/Layers";
import LanguageIcon from "@material-ui/icons/Language";
import EditIcon from "@material-ui/icons/Edit";
import MenuIcon from "@material-ui/icons/Menu";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import QueueIcon from "@material-ui/icons/Queue";
//import ToggleButton from "@material-ui/lab/ToggleButton";
// import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
// import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import CancelIcon from "@material-ui/icons/Cancel";
import { makeStyles } from "@material-ui/core/styles";
//components
import ColorPickerDialog from "./components/ColorPickerDialog";
// import ColorPickerUDLayerDialog from './components/ColorPickerUDLayerDialog';
import BaseMapStyles from "./BaseMapStyles";
import CheckboxList from "./CheckboxList";
import CheckboxListHeatmaps from "./CheckboxListHeatmaps";
import AddUserData from "./components/addUserData";
import AddALayer from "./components/addALayer";
import DrawShapes from "./components/DrawShapes/DrawShapes";
import TrackedWellsMapCard from "./components/TrackedWellsMapCard";
import GpsFixedIcon from "@material-ui/icons/GpsFixed";
import GpsNotFixedIcon from "@material-ui/icons/GpsNotFixed";
import GradientIcon from "@material-ui/icons/Gradient";
import { default as Cube3d } from "../Shared/svgIcons/cube-3d";
import AspectRatioOutlinedIcon from "@material-ui/icons/AspectRatioOutlined";
import { useDispatch, useSelector } from "react-redux";
import { toggleMapGridCardAtived, setMapGridCardState } from "../../actions";
import { UPDATELAYERSETTINGS } from "../../graphQL/useMutationUpdateLayerSettings";
import { UPDATEMANYLAYERSETTINGS } from "../../graphQL/useMutationUpdateManyLayerSettings";
import SidePanel from "../Shared/SidePanel";

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

const reorderBasemap = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const reorderLayers = (list, startPosition, endPosition) => {
  const reorderedLayers = Array.from(list);
  let startIndex = reorderedLayers.findIndex(
    (layer) => layer.position == startPosition
  );
  let endIndex = reorderedLayers.findIndex(
    (layer) => layer.position == endPosition
  );

  //// switch positions between layers
  let endI = endIndex;
  while (endI > startIndex) {
    let temp = reorderedLayers[endI].position;
    reorderedLayers[endI] = {
      ...reorderedLayers[endI],
      position: reorderedLayers[endI - 1].position,
    };
    reorderedLayers[endI - 1] = {
      ...reorderedLayers[endI - 1],
      position: temp,
    };
    endI--;
  }
  while (endI < startIndex) {
    let temp = reorderedLayers[endI].position;
    reorderedLayers[endI] = {
      ...reorderedLayers[endI],
      position: reorderedLayers[endI + 1].position,
    };
    reorderedLayers[endI + 1] = {
      ...reorderedLayers[endI + 1],
      position: temp,
    };
    endI++;
  }

  //// reorder the stateApp.layers
  const [removed] = reorderedLayers.splice(startIndex, 1);
  reorderedLayers.splice(endIndex, 0, removed);

  //// separate the layers to update
  let layersToUpdate = reorderedLayers
    .filter(
      (currentValue, index) =>
        (startIndex < endIndex && startIndex <= index && index <= endIndex) ||
        (startIndex > endIndex && startIndex >= index && index >= endIndex)
    )
    .map((layer) => ({ _id: layer._id, position: layer.position }));

  return { reorderedLayers, layersToUpdate };
};

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
  const { changeHeatmaps, changeLayers } = props;

  const [updateLayerSettings] = useMutation(UPDATELAYERSETTINGS);
  const [updateManyUserLayerSettings] = useMutation(UPDATEMANYLAYERSETTINGS);

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

    setStateMapControls({
      ...stateMapControls,
      selectedControl: action,
      anchorEl: anchorEl,
    });

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
      // { icon: <QueueIcon id="add" />, name: "Add Data", action: "add" },
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

  const handleToggleBasemap = ({ index }) => {
    const currentIndex = stateApp.checkedBaseLayers.indexOf(index);
    const newChecked = [...stateApp.checkedBaseLayers];
    if (currentIndex === -1) {
      newChecked.push(index);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setStateApp((stateApp) => ({ ...stateApp, checkedBaseLayers: newChecked }));
  };

  const handleToggleLayer = ({ layer, index }) => {
    const currentLayers = [...stateApp.layers];
    const updatedLayer = {
      ...layer,
      layerSettings: {
        ...layer.layerSettings,
        visiable: !layer.layerSettings.visiable,
      },
    };

    //// saving to stateApp
    currentLayers[index] = updatedLayer;
    setStateApp((stateApp) => ({ ...stateApp, layers: [...currentLayers] }));

    //// saving to mongo
    updateLayerSettings({
      variables: {
        settings: {
          _id: updatedLayer._id,
          layerSettings: updatedLayer.layerSettings,
        },
      },
    });
  };

  const onDragEndLayer = (result) => {
    if (!result.destination) {
      return;
    }

    if (result.source.index !== result.destination.index) {
      const { reorderedLayers, layersToUpdate } = reorderLayers(
        stateApp.layers,
        result.source.index,
        result.destination.index
      );

      //// saving to stateApp
      setStateApp({
        ...stateApp,
        layers: [...reorderedLayers],
      });

      //// saving to mongo
      updateManyUserLayerSettings({
        variables: {
          manySettings: layersToUpdate,
        },
      });
    }
  };

  const onDragEndBasemap = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorderBasemap(
      stateApp.baseMapLayers,
      result.source.index,
      result.destination.index
    );

    let checkedBaseLayers = stateApp.checkedBaseLayers.slice(0);
    const sourceIndex = checkedBaseLayers.indexOf(result.source.index);

    let direction = 0;
    let from,
      to = 0;
    if (result.destination.index > result.source.index) {
      direction = -1;
      from = result.source.index;
      to = result.destination.index;
    } else {
      direction = 1;
      to = result.source.index;
      from = result.destination.index;
    }

    for (let i = 0; i < checkedBaseLayers.length; i++) {
      if (checkedBaseLayers[i] <= to && checkedBaseLayers[i] >= from) {
        checkedBaseLayers[i] += direction;
      }
    }

    if (sourceIndex !== -1) {
      checkedBaseLayers[sourceIndex] = result.destination.index;
    }

    setStateApp({
      ...stateApp,
      baseMapLayers: items,
      checkedBaseLayers: checkedBaseLayers,
    });
  };

  const openSelectedControl = () => {
    const { selectedControl } = stateMapControls;
    switch (selectedControl) {
      case "base":
        return (
          <SidePanel
            panelName={selectedControl}
            handleToggle={handleToggleBasemap}
            onDragEnd={onDragEndBasemap}
            panelItems={stateApp.baseMapLayers}
          />
        );
      // return <BaseMapStyles />;
      case "layer":
        return (
          <SidePanel
            changeLayers={changeLayers}
            panelName={selectedControl}
            handleToggle={handleToggleLayer}
            onDragEnd={onDragEndLayer}
            panelItems={stateApp.layers}
          />
        );
      // return <CheckboxList changeLayers={changeLayers} />;
      case "heatMaps":
        return <CheckboxListHeatmaps changeHeatmaps={changeHeatmaps} />;
      case "add":
        return <AddUserData />;
      case "draw":
        return <DrawShapes />;
      // case "track":
      //   return <TrackedWellsMapCard />;
      default:
        return null;
    }
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
      {stateMapControls.selectedControl ? openSelectedControl() : null}
      {stateMapControls.selectedLayer
        ? openColorPickerControl(stateMapControls.selectedLayer)
        : null}
      {/* {stateMapControls.selectedUDLayer ? openColorPickerUDControl() : null} */}
      {stateMapControls.addLayer ? openAddLayerControl() : null}
    </div>
  );
}
