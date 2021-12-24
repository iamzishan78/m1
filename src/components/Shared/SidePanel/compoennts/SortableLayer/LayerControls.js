import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import { MapControlsContext } from "components/MapControls/MapControlsContext";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import ClickIcon from "../../../svgIcons/cursor-click.js";
import { Tooltip, FormControlLabel, Switch } from "@material-ui/core";
import { deepEqualObjects } from "../../../functions";
import { ifLayerHaveData } from "../common.js";
import { AppContext } from "AppContext.js";

import { Grid } from "@material-ui/core";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import { IconButton } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  disabledLayerTitle: {
    "& span": { color: "rgb(127, 149, 199) !important" },
  },
  formControl: {
    "& .MuiFormControlLabel-root": {
      margin: "0px !important",
      // backgroundColor: 'red',
    }
  }
}));


const LayerControls = ({ type, layer, labelId, index, updateLayer, isHover }) => {
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
      addLayer: false
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

  const layerStylingControl = (layer.layerSettings?.colorable || layer.layerSettings?.interaction?.interactionAble) && (
    <IconButton size='small'>
      <Tooltip title="Layer Styling" >
        <KeyboardArrowRightIcon
          fontSize='small'
          htmlColor={isHover ? "white" : "#808ba3"} onClick={() => handleColorPicker(layer)} />
      </Tooltip>
    </IconButton>
  );

  const layerClickabilityControl = isHover && (layer.layerSettings?.interaction?.interactionAble || layer.layerType === 'file layer') && (
    <Tooltip title="Clickable" >
      <Checkbox
        icon={
          <CancelOutlinedIcon
            fontSize='small'
            htmlColor={!ifLayerHaveData(layer, stateApp) ? "rgb(127, 149, 199)" : "#12abe0"}
          />
        }
        checkedIcon={
          <IconButton size='small'>
            <ClickIcon
              color={!ifLayerHaveData(layer, stateApp) ? "rgb(127, 149, 199)" : "#12abe0"}
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
        style={{
          display: 'flex',
          flexDirection: 'row',
          // justifyContent: 'flex-end',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* <Grid item xs={4}>
          {layerClickabilityControl}
        </Grid> */}
        <Grid item xs={4}>
          {/* {layerClickabilityControl} */}
        </Grid>
        <Grid item xs={4} className={classes.formControl}>
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
        <Grid item xs={4}>
          {layerStylingControl}
        </Grid>
      </Grid>
    </>
  );
};

export default React.memo(LayerControls, deepEqualObjects);
