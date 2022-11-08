import React, { useContext, useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { MapControlsContext } from "../../MapControlsContext";
import { AppContext } from "AppContext";
import { Typography, Paper, Grid, IconButton, Divider, FormControlLabel, Switch, Box, Tooltip, ClickAwayListener } from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import { UPDATELAYERSETTINGS } from "../../../../graphQL/useMutationUpdateLayerSettings";
import GridOnIcon from "@material-ui/icons/GridOn";
import { getLayerColor } from "components/Shared/SidePanel/compoennts/common";
import { useDispatch } from "react-redux";
import { setMapGridCardState } from "actions";
import FeatureFlag from "components/Shared/FeatureFlag/FeatureFlagComponent.js";
import { FEATURES } from "components/Shared/FeatureFlag/common";
import { LAYERS_FEATURES_COUNT } from "graphQL/useQueryLayerFeaturesCount";
import { ColorPickerStyledBox, useLayerStyle, useStyles, WidthPicker } from "./Common";

function LayerStyling(props) {
  const { layer, fileName } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  const layerType = layer.layerPaintProps[0]?.paintType;
  const { width, setWidth, fillColor, setFillColor, layerLabelVisibility, setLayerLabelVisibility, layerClickability, setLayerClickability, strokeColor, setStrokeColor, handleLayerChange
  } = useLayerStyle(layer)

  const [rows, setRows] = useState(0);
  const [, setStateMapControls] = useContext(MapControlsContext);
  const [stateApp, setStateApp] = useContext(AppContext);
  const [layerFeaturesCount, { data: layerDataCount }] = useLazyQuery(LAYERS_FEATURES_COUNT);

  const [updateLayerSettings] = useMutation(UPDATELAYERSETTINGS);

  useEffect(() => {
    setRows(layerDataCount?.layerFeaturesCount || 0)
  }, [layerDataCount])


  useEffect(() => {
    setRows(0)
    if (layer.file) {
      layerFeaturesCount({ variables: { fileId: layer.file } })
    }
  }, [layer.file, layerFeaturesCount])

  const handleClose = () => {
    setStateMapControls((stateMapControls) => ({
      ...stateMapControls,
      selectedLayer: null,
    }));
  };

  const handleApplyChanges = () => {
    if ((stateApp.layers && layer &&
      ((fillColor && fillColor.rgb && fillColor.alpha) || (strokeColor && strokeColor.rgb && strokeColor.alpha))) ||
      width || layer.layerPaintProps[0]?.labelProps?.visibility !== layerLabelVisibility ||
      layer.layerSettings?.interaction?.interactionDetail?.click !== layerClickability
    ) {
      let { currentLayer } = handleLayerChange()
      //// saving to stateApp
      const currentLayers = [...stateApp.layers];
      const index = currentLayers.findIndex((l) => l.layerName === currentLayer.layerName);
      currentLayers[index] = currentLayer;
      setStateApp((stateApp) => ({ ...stateApp, layers: [...currentLayers] }));

      //// saving to mongo
      updateLayerSettings({
        variables: {
          settings: {
            _id: currentLayer._id,
            layerPaintProps: currentLayer.layerPaintProps,
            layerSettings: currentLayer.layerSettings
          },
        },
      });

      ////
    }
    handleClose();
  };

  return (
    <ClickAwayListener onClickAway={handleApplyChanges}>
      <div style={{ width: '100%' }}>
        <Grid container direction="row" justify="space-between" alignItems="center" style={{ padding: "15px" }}>
          <Grid item md={11}>
            <Typography variant="h5" noWrap>{layer.layerName === "Parcels" ? "Tracts" : layer.layerName}</Typography>
          </Grid>
          <Grid item>
            <IconButton size="small" onClick={handleApplyChanges}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Divider />
        <FeatureFlag feature={FEATURES.SHAPEELASTIC}>
          {layer.file &&
            <>
              <Grid container spacing={3} style={{ padding: "10px 20px 10px 17px", justifyContent: "space-between" }}>
                <Grid item style={{ display: "flex" }}>
                  <Box borderColor={getLayerColor(layer, "layer", {})} borderLeft={4} style={{ padding: "0 0 0 16px" }}>
                  </Box>
                  <Box display='inline'>
                    <Typography className={classes.fileName} variant="h6" noWrap>
                      {fileName}
                    </Typography>
                    <Typography id={layer.fileName} noWrap>
                      {rows} rows
                    </Typography>
                  </Box>

                </Grid>
                <Grid style={{ padding: '25px 25px 0 0' }}>
                  <Tooltip title="Grid">
                    <IconButton size="small" aria-label="Grid" className={classes.gridOnIcon} onClick={() => {
                      setStateApp((state) => ({
                        ...state,
                        layerGridCard: true,
                      }));
                      handleClose()
                      dispatch(setMapGridCardState({ mapGridCardActivated: true }));
                    }}>
                      <GridOnIcon fontSize="large" />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
              <Divider />
            </>
          }
        </FeatureFlag>
        <Grid container spacing={3} style={{ padding: "20px" }}>
          {layer.layerSettings?.colorable &&
            <Grid item xs={12}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">Layer label visibility</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={layerLabelVisibility === 'visible'}
                      onChange={() => setLayerLabelVisibility(layerLabelVisibility === 'visible' ? 'none' : 'visible')}
                      size="small"
                    />
                  }
                />
              </div>
            </Grid>
          }

          {(layer.layerSettings?.interaction?.interactionAble || layer.layerType === 'file layer') &&
            <Grid item xs={12}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">Layer clickable</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={layerClickability}
                      onChange={(e) => setLayerClickability(!layerClickability)}
                      size="small"
                    />
                  }
                />
              </div>
            </Grid>
          }

          {layer.layerSettings?.colorable &&
            <>
              <Grid item xs={12}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6">Fill Color</Typography>
                  {layerType === "line" && <WidthPicker width={width} setWidth={setWidth} layerType={layerType} />}
                </div>
                <Paper>
                  <ColorPickerStyledBox value={fillColor} onChange={(color) => setFillColor(color)} />
                </Paper>
              </Grid>
              {strokeColor && (
                <Grid item xs={12}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="h6">Stroke Color</Typography>
                    {layerType === "circle" && <WidthPicker width={width} setWidth={setWidth} layerType={layerType} />}
                  </div>
                  <Paper>
                    <ColorPickerStyledBox value={strokeColor} onChange={(color) => setStrokeColor(color)} />
                  </Paper>
                </Grid>
              )}
            </>}
        </Grid>
      </div>
    </ClickAwayListener>
  );
}

export default LayerStyling;
