import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import { MapControlsContext } from "components/MapControls/MapControlsContext";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import ClickIcon from "../../../svgIcons/cursor-click.js";
import ColorControl from "../../../svgIcons/color-control.js";
import { Tooltip, FormControlLabel, Switch } from "@material-ui/core";
import { deepEqualObjects } from "../../../functions";
import { ifLayerHaveData } from "../common.js";
import { AppContext } from "AppContext.js";

const useStyles = makeStyles(() => ({
  disabledLayerTitle: {
    "& span": { color: "rgb(127, 149, 199) !important" },
  },
}));

const LayerControls = ({ type, layer, labelId, index, updateLayer }) => {
  const classes = useStyles();
  const [stateApp] = useContext(AppContext);

  const [, setStateMapControls] = useContext(MapControlsContext);

  const handleToggleInteraction = (layer) => () => {
    const updatedLayer = {
      ...layer,
      layerSettings: {
        ...layer.layerSettings,
        interaction: {
          ...layer.layerSettings.interaction,
          interactionDetail: {
            hover: !layer.layerSettings.interaction.interactionDetail.hover,
            click: !layer.layerSettings.interaction.interactionDetail.click,
          },
        },
      },
    };
    updateLayer(updatedLayer);
  };

  const handleToggleVisibilty = (layer) => {
    const updatedLayer = {
      ...layer,
      layerSettings: {
        ...layer.layerSettings,
        visiable: !layer.layerSettings.visiable,
      },
    };
    updateLayer(updatedLayer);
  };

  const handleColorPicker = (layer) => {
    setStateMapControls((stateMapControls) => ({
      ...stateMapControls,
      selectedLayer: layer,
    }));
  };

  const getLayerChecked = ({ layer, index }) => {
    if (type === "layer" && layer) {
      return layer.layerSettings.visiable !== false;
    } else if (
      type === "base" &&
      typeof index === "number" &&
      stateApp.checkedBaseLayers
    ) {
      return stateApp.checkedBaseLayers.indexOf(index) !== -1;
    } else if (
      type === "heatMaps" &&
      typeof index === "number" &&
      stateApp.checkedHeats
    ) {
      return stateApp.checkedHeats.indexOf(index) !== -1;
    } else {
      return false;
    }
  };

  const control1 = layer.layerSettings?.colorable && (
    <div
      // style={{
      //   paddingRight: !layer.layerSettings.interaction.interactionAble
      //     ? "40"
      //     : "",
      // }}

      style={{
        paddingRight: 20,
        // height: "42px",
        // width: "42px",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}

    >
      <ListItemIcon onClick={() => handleColorPicker(layer)} style={{ verticalAlign: "bottom" }}>
        <Tooltip title="Layer Styling">
          <ColorControl />
        </Tooltip>
      </ListItemIcon>
    </div>
  );

  const control2 = layer.layerSettings?.interaction?.interactionAble && (
    <div
      style={{
        paddingRight: 20,
        // height: "42px",
        // width: "42px",        
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Checkbox
        icon={
          <CancelOutlinedIcon
            htmlColor={
              !ifLayerHaveData(layer, stateApp)
                ? "rgb(127, 149, 199)"
                : "#12abe0"
            }
          />
        }
        checkedIcon={
          <ClickIcon
            color={
              !ifLayerHaveData(layer, stateApp)
                ? "rgb(127, 149, 199)"
                : "#12abe0"
            }
          />
        }
        edge="start"
        checked={layer.layerSettings?.interaction?.interactionDetail?.click}
        tabIndex={-1}
        disableRipple
        inputProps={{
          "aria-labelledby": labelId,
        }}
        onChange={handleToggleInteraction(layer)}
      />
    </div>
  );

  return (
    <>
      {control2}
      <FormControlLabel
        control={
          <Switch
            disabled={
              !ifLayerHaveData(layer, stateApp)
                ? classes.disabledLayerTitle
                : ""
            }
            checked={getLayerChecked({
              layer,
              index,
            })}
            onChange={() => handleToggleVisibilty(layer)}
            size="small"
          />
        }


      />

      {control1}

    </>
  );
};

export default React.memo(LayerControls, deepEqualObjects);
