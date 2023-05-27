import React, { useContext, useState, useMemo } from "react";
import { useMutation } from "@apollo/client";
import { v4 as uuid } from "uuid";
import { MapControlsContext } from "../../MapControlsContext";
import { Typography, Paper, Grid, Button, IconButton, Divider, FormControlLabel, Switch, ClickAwayListener, TextField } from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import { getDefaultSettings } from "../addUserHelper";
import { ADDLAYER } from "graphQL/useMutationAddLayer";
import { AppContext } from "AppContext";
import { ColorPickerStyledBox, useLayerStyle, useStyles, WidthPicker } from "./Common";
import { Autocomplete } from "@material-ui/lab";

function NewLayerManager(props) {
  const [stateApp] = useContext(AppContext);
  const sourceProps = "" + uuid() + "_source"

  const [layer, setLayer] = useState({
    createBy: stateApp.user.mongoId,
    ...getDefaultSettings("Polygon", '', sourceProps)
  });

  const [addLayer] = useMutation(ADDLAYER);

  const layerType = layer.layerPaintProps[0]?.paintType;

  const { layerName, setLayerName, width, setWidth, fillColor, setFillColor, layerLabelVisibility, setLayerLabelVisibility, layerClickability, setLayerClickability, strokeColor, setStrokeColor, handleLayerChange
  } = useLayerStyle(layer)
  const [, setStateMapControls] = useContext(MapControlsContext);

  const [source, setSource] = useState()
  const [selectCategory, setCategory] = useState()

  // const setLayerHandler = (layerName, layerGeoType) => {
  //   setLayer({
  //     ...layer,
  //     layerName: layerName,
  //     identifier: layerName + uuid(),
  //     layerGeometry: layerGeoType || 'Polygon',
  //   })
  // }

  const createLayer = () => {
    addLayer({
      variables: {
        layer: {
          ...layer,
          groupId: null,
          groupName: null,
          file: source.file,
          layerName: layerName,
          identifier: layerName + uuid(),
          layerType: "file layer",
          layerGeometry: selectCategory.layerGeometry,
          layerCategory: selectCategory.name,
          originalFile: source.originalFile,
          defaultSettings: handleLayerChange(),
          layerPaintProps: undefined,
          layerSettings: undefined,
          public: true,

        },
      },
      refetchQueries: ["getAllLayerSettingsByUser"],
      awaitRefetchQueries: true,
    }).then(() => {
      handleClose()
    });
  }

  const handleClose = () => {
    setStateMapControls((stateMapControls) => ({ ...stateMapControls, manageLayer: false }));
  }

  // useEffect(() => {
  //   setLayerHandler(layerName, selectCategory)
  // }, [layerName, selectCategory])

  const datasets = useMemo(() => {
    const datasets = stateApp.datasets?.filter((dataset) => dataset.name !== 'M1 Platform')
    return datasets || [];
  }, [stateApp.datasets])

  const layerCategories = useMemo(() => {
    const dataset = stateApp.datasets.find((dataset) => dataset.name === source?.name)
    return dataset?.categories || []
  }, [source])

  return (
    <ClickAwayListener >
      <div style={{ width: '100%' }}>
        <Grid container direction="row" justify="space-between" alignItems="center" style={{ padding: "15px" }}>
          <Grid item>
            <Typography variant="h5">Create New Map Layer</Typography>
          </Grid>
          <Grid item>
            <IconButton size="small" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Divider />
        <div style={{ height: 'calc(100vh - 125px)', overflowY: 'scroll', overflowX: 'hidden' }}>
          <Grid container spacing={3} style={{ padding: "20px" }}>
            <Grid item xs={12}>
              <Autocomplete
                id="data-source"
                options={datasets}
                getOptionLabel={(option) => option.name}
                value={source}
                onChange={(_, dataset) => setSource(dataset)}
                renderInput={(params) => <TextField {...params} label="Select Data Source" />}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                id="layer-category"
                options={layerCategories}
                value={selectCategory}
                getOptionLabel={(option) => `${option.name}(${option.layerGeometry})`}
                onChange={(_, layerCategory) => setCategory(layerCategory)}
                renderInput={(params) => <TextField {...params} label="Select Category" />}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField margin="dense" id="layerName" label="Enter Layer Name" fullWidth onChange={(e) => setLayerName(e.target.value)} />
            </Grid>
          </Grid>

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

            <div style={{ position: "absolute", bottom: '0px', width: '100%' }}>
              <Grid container direction="row" justify="space-between" alignItems="center" style={{ padding: "20px" }}>
                <Grid item>
                  <Button autoFocus onClick={handleClose} color="primary">
                    Cancel
                  </Button>
                </Grid>
                <Grid item>
                  <Button autoFocus onClick={createLayer} color="primary">
                    Create layer
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </div>
      </div >
    </ClickAwayListener >
  );
}

export default NewLayerManager;
