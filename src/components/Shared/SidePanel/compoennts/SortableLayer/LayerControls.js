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

import { Box, Grid } from "@material-ui/core";
import DonutSmallIcon from '@material-ui/icons/DonutSmall';
import { IconButton } from '@material-ui/core';


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
          interactionAble: true,
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
      return layer.layerSettings?.visiable !== false;
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

    <IconButton size='small'>
      <Tooltip title="Layer Styling" >
        <DonutSmallIcon htmlColor="#12abe0" onClick={() => handleColorPicker(layer)} />
      </Tooltip>
    </IconButton>

  );

  const control2 = (layer.layerSettings?.interaction?.interactionAble || layer.layerType === 'file layer') && (

    <Tooltip title="Clickable" >

      <Checkbox
        icon={

          <CancelOutlinedIcon
            fontSize='small'
            htmlColor={
              !ifLayerHaveData(layer, stateApp)
                ? "rgb(127, 149, 199)"
                : "#12abe0"
            }
          />

        }
        checkedIcon={
          <IconButton size='small'>
            <ClickIcon
              color={
                !ifLayerHaveData(layer, stateApp)
                  ? "rgb(127, 149, 199)"
                  : "#12abe0"
              }
              fontSize='small'
            />
          </IconButton>
        }
        checked={layer.layerSettings?.interaction?.interactionDetail?.click}
        tabIndex={-1}
        disableRipple
        inputProps={{
          "aria-labelledby": labelId,
        }}
        onChange={handleToggleInteraction(layer)}
        size='small'
      />
    </Tooltip>

  );

  return (
    <>

      <Grid container
        spacing={1}
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >

        <Grid item
          xs
          style={{
          }}
        >
          {control2}
        </Grid>

        <Grid item
          xs
          style={{
          }}
        >
          {control1}
        </Grid>

        <Grid item
          xs
          style={{
          }}
        >
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

        </Grid>



      </Grid>

    </>
  );
};

export default React.memo(LayerControls, deepEqualObjects);
