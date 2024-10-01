import React, { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Typography, Paper, Grid, IconButton, Divider, FormControlLabel, Switch, Box, Tooltip, ClickAwayListener } from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import { UPDATELAYERSETTINGS } from "../../../../graphQL/useMutationUpdateLayerSettings";
import GridOnIcon from "@material-ui/icons/GridOn";
import { getLayerColor } from "components/Shared/SidePanel/compoennts/common";
import FeatureFlag from "components/Shared/FeatureFlag/FeatureFlagComponent.js";
import { FEATURES } from "components/Shared/FeatureFlag/common";
import { LAYERS_FEATURES_COUNT } from "graphQL/useQueryLayerFeaturesCount";
import { ColorPickerStyledBox, useLayerStyle, useStyles, WidthPicker } from "./Common";
import { globalStateController } from "hookstate/globalStateController";
import { mapControlsController } from "hookstate/mapControlsController";
import { layerController } from "hookstate/layerStateController";

function LayerStyling() {
  const classes = useStyles();

  const { mapControlsStateValues, ...mapControlStates } = mapControlsController.useState(['selectedLayer'], 'mapControlsStateValues');
  const selectedLayer = mapControlsStateValues.selectedLayer

  const layerType = selectedLayer.layerPaintProps[0]?.paintType;
  const { width, setWidth, fillColor, setFillColor, layerLabelVisibility, setLayerLabelVisibility, layerClickability, setLayerClickability, strokeColor, setStrokeColor, handleLayerChange
  } = useLayerStyle(selectedLayer)

  const [rows, setRows] = useState(0);

  const [layerFeaturesCount, { data: layerDataCount }] = useLazyQuery(LAYERS_FEATURES_COUNT);

  const [updateLayerSettings] = useMutation(UPDATELAYERSETTINGS);

  useEffect(() => {
    setRows(layerDataCount?.layerFeaturesCount || 0)
  }, [layerDataCount])


  useEffect(() => {
    setRows(0)
    if (selectedLayer.file) {
      layerFeaturesCount({ variables: { fileId: selectedLayer.file } })
    }
  }, [mapControlStates.selectedLayer.file, layerFeaturesCount])

  const handleClose = () => {
    mapControlsController.updateState({ selectedLayerControl: null })
  };

  const handleApplyChanges = () => {
    const hookStateAppLayers = globalStateController.getValue('layers')

    if (
      (hookStateAppLayers &&
        selectedLayer &&
        ((fillColor && fillColor.rgb && (fillColor.alpha || fillColor.alpha === 0)) ||
          (strokeColor &&
            strokeColor.rgb &&
            (strokeColor.alpha || strokeColor.alpha === 0)))) ||
      width ||
      selectedLayer.layerPaintProps[0]?.labelProps?.visibility !== layerLabelVisibility ||
      selectedLayer.layerSettings?.interaction?.interactionDetail?.click !== layerClickability
    ) {
      let { currentLayer } = handleLayerChange()
      //// saving to stateApp
      const currentLayers = [...hookStateAppLayers];
      const index = currentLayers.findIndex((l) => l._id === currentLayer._id);
      currentLayers[index] = currentLayer;
      globalStateController.updateState({ layers: currentLayers })
      layerController.handleDeckLayer(currentLayer)

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
            {/* Override layer styling names of Parcel and Wells */}
            <Typography variant="h5" noWrap>{selectedLayer.layerName === "Parcels" ? "Tracts" : selectedLayer.layerName === 'Wells' ? 'Platform Wells' : selectedLayer.layerName}</Typography>
          </Grid>
          <Grid item>
            <IconButton size="small" onClick={handleApplyChanges} data-testid="close">
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Divider />
        <FeatureFlag feature={FEATURES.SHAPEELASTIC}>
          {selectedLayer.file &&
            <>
              <Grid container spacing={3} style={{ padding: "10px 20px 10px 17px", justifyContent: "space-between" }}>
                <Grid item style={{ display: "flex" }}>
                  <Box borderColor={getLayerColor(selectedLayer, "layer", {})} borderLeft={4} style={{ padding: "0 0 0 16px" }}>
                  </Box>
                  <Box display='inline'>
                    <Typography className={classes.fileName} variant="h6" noWrap>
                      {selectedLayer.fileName}
                    </Typography>
                    <Typography id={selectedLayer.fileName} noWrap>
                      {rows} rows
                    </Typography>
                  </Box>

                </Grid>
                <Grid style={{ padding: '5px 27px 4px 0px' }}>
                  <Tooltip title="Grid">
                    <IconButton size="small" aria-label="Grid" className={classes.gridOnIcon} onClick={() => {
                      mapControlsController.updateState({ layerGridCard: true, mapGridCardActivated: true, selectedLayer })
                      handleClose()
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
          {selectedLayer.layerSettings?.colorable &&
            <Grid item xs={12}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">Layer label visibility</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={layerLabelVisibility === 'visible'}
                      onChange={() => setLayerLabelVisibility(layerLabelVisibility === 'visible' ? 'none' : 'visible')}
                      size="small"
                      data-testid="layer-label-visibility-toggle"
                    />
                  }
                />
              </div>
            </Grid>
          }

          {(selectedLayer.layerSettings?.interaction?.interactionAble || selectedLayer.layerType === 'file layer') &&
            <Grid item xs={12}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">Layer clickable</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={layerClickability}
                      onChange={(e) => setLayerClickability(!layerClickability)}
                      size="small"
                      data-testid="layer-pickability-toggle"
                    />
                  }
                />
              </div>
            </Grid>
          }

          {selectedLayer.layerSettings?.colorable &&
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
                <Paper id='fill-picker-box'>
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
                  <Paper id='stroke-picker-box'>
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
