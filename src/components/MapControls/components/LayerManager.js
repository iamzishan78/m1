import React, { useContext, useState, useEffect, useMemo } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { v4 as uuid } from "uuid";
import set from 'lodash/set';
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { MapControlsContext } from "../MapControlsContext";
import { AppContext } from "../../../AppContext";
import { ColorBox } from "material-ui-color";
import { Typography, Paper, Grid, Button, IconButton, Divider, FormControlLabel, Switch, Box, Tooltip, ClickAwayListener, TextField, Select, MenuItem, InputLabel } from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import { UPDATELAYERSETTINGS } from "../../../graphQL/useMutationUpdateLayerSettings";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import { copy } from "components/Shared/functions";
import { useDispatch } from "react-redux";
import { LAYERS_FEATURES_COUNT } from "graphQL/useQueryLayerFeaturesCount";
import { getDefaultSettings } from "./addUserHelper";
import { ADDLAYER } from "graphQL/useMutationAddLayer";

function trim(str) {
  return str.replace(/^\s+|\s+$/gm, "");
}
function RGBAToHexA(rgba) {
  var inParts = rgba.substring(rgba.indexOf("(")).split(","),
    r = parseInt(trim(inParts[0].substring(1)), 10),
    g = parseInt(trim(inParts[1]), 10),
    b = parseInt(trim(inParts[2]), 10),
    a = parseFloat(trim(inParts[3].substring(0, inParts[3].length - 1))).toFixed(2);
  var outParts = [
    r.toString(16),
    g.toString(16),
    b.toString(16),
    Math.round(a * 255)
      .toString(16)
      .substring(0, 2),
  ];

  // Pad single-digit output values
  outParts.forEach(function (part, i) {
    if (part.length === 1) {
      outParts[i] = "0" + part;
    }
  });

  return "#" + outParts.join("");
}

const ColorPickerStyledBox = withStyles((theme) => ({
  root: {
    width: "auto",
    "& .MuiBox-root": {
      width: "auto",
      padding: "30px",
      "& .muicc-colorbox-hsvgradient": {
        width: "84%",
      },
      "& .muicc-colorbox-sliders": {
        width: "auto",
      },
    },
  },
}))(ColorBox);

const useStyles = makeStyles((theme) => ({

  gridOnIcon: {
    color: "#d3d3d3",
    backgroundColor: "#1c2233",
    borderRadius: "0px",
    marginLeft: "5px",
    "&:hover ": {
      backgroundColor: "#626687",
      borderRadius: "0px",
    },
  }
}));

function LayerManager(props) {
  // const { layer, fileName } = props;
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const sourceProps = "" + uuid() + "_source"

  const [layer, setLayer] = useState({
    createBy: stateApp.user.mongoId,
    ...getDefaultSettings("Polygon", '', sourceProps)
  });

  const [addLayer, { data: newLayer }] = useMutation(ADDLAYER);
  // if (!layer || !layer.layerPaintProps || !layer.layerPaintProps[0])
  //   return null;

  const ifRgbaConvt = (color) => {
    if (color?.slice(0, 4) === "rgba") return RGBAToHexA(color);
    else return color;
  };
  const layerType = layer.layerPaintProps[0]?.paintType;
  const initialLayerLabelVisibility = layer.layerPaintProps[0]?.labelProps?.visibility === 'none' ? 'none' : 'visible';
  const initialLayerClickable = layer.layerSettings?.interaction?.interactionDetail?.click

  const initialFillColor =
    layerType === "fill"
      ? ifRgbaConvt(layer.layerPaintProps[0]?.paintProps["fill-color"])
      : layerType === "line"
        ? ifRgbaConvt(layer.layerPaintProps[0]?.paintProps["line-color"])
        : ifRgbaConvt(layer.layerPaintProps[0]?.paintProps["circle-color"]);
  const initialStrokeColor =
    layerType === "fill"
      ? ifRgbaConvt(layer.layerPaintProps[0]?.paintProps["fill-outline-color"])
      : layerType === "line"
        ? undefined
        : ifRgbaConvt(layer.layerPaintProps[0]?.paintProps["circle-stroke-color"]);

  let initialWidth;
  if (layerType === "circle")
    initialWidth = layer.layerPaintProps[0]?.paintProps["circle-stroke-width"]
      ? layer.layerPaintProps[0]?.paintProps["circle-stroke-width"]
      : 0;
  if (layerType === "line")
    initialWidth = layer.layerPaintProps[0]?.paintProps["line-width"] ? layer.layerPaintProps[0]?.paintProps["line-width"] : 1;

  const [width, setWidth] = useState(initialWidth);
  const [rows, setRows] = useState(0);
  const [fillColor, setFillColor] = useState(initialFillColor);
  const [layerLabelVisibility, setLayerLabelVisibility] = useState(initialLayerLabelVisibility);
  const [layerClickability, setLayerClickability] = useState(initialLayerClickable);
  const [strokeColor, setStrokeColor] = useState(initialStrokeColor);
  const [, setStateMapControls] = useContext(MapControlsContext);

  const [layerFeaturesCount, { data: layerDataCount }] = useLazyQuery(LAYERS_FEATURES_COUNT);

  useEffect(() => {
    setWidth(initialWidth);
    setFillColor(initialFillColor);
    setStrokeColor(initialStrokeColor);
  }, [initialFillColor, initialStrokeColor, initialWidth, layer]);

  useEffect(() => {
    setRows(layerDataCount?.layerFeaturesCount || 0)
  }, [layerDataCount])


  useEffect(() => {
    setRows(0)
    if (layer.file) {
      layerFeaturesCount({ variables: { fileId: layer.file } })
    }
  }, [layer.file, layerFeaturesCount])

  const fillColorChange = (color) => {
    setFillColor(color);
  };

  const strokeColorChange = (color) => {
    setStrokeColor(color);
  };

  const handleLayerChange = () => {
    if ((layer &&
      ((fillColor && fillColor.rgb && fillColor.alpha) || (strokeColor && strokeColor.rgb && strokeColor.alpha))) ||
      width || layer.layerPaintProps[0]?.labelProps?.visibility !== layerLabelVisibility ||
      layer.layerSettings?.interaction?.interactionDetail?.click !== layerClickability
    ) {
      let currentLayer = { ...layer };
      let fColor;
      let fColorOp;
      let sColor;
      let sColorOp;

      if (fillColor && fillColor.rgb)
        fColor = fillColor.rgb.length === 3 ? "rgb(" + fillColor.rgb.join() + ")" : "rgba(" + fillColor.rgb.join() + ")";

      if (fillColor && fillColor.alpha) fColorOp = fillColor.alpha;
      if (strokeColor && strokeColor.alpha) sColorOp = strokeColor.alpha;

      if (strokeColor && strokeColor.rgb)
        sColor = strokeColor.rgb.length === 3 ? "rgb(" + strokeColor.rgb.join() + ")" : "rgba(" + strokeColor.rgb.join() + ")";
      const layerSettings = copy(currentLayer.layerSettings);
      layerSettings.interaction.interactionDetail.click = layerClickability;

      if (currentLayer && currentLayer.layerPaintProps && currentLayer.layerPaintProps[0] && currentLayer.layerPaintProps[0].paintType) {
        const layerPaintProps = copy(currentLayer.layerPaintProps);

        for (let i = 0; i < layerPaintProps.length; i++) {
          layerPaintProps[i].sourceProps = layerName + uuid() + "_source"
          if (layerPaintProps[i]?.labelProps?.symbolProps?.visibility)
            delete layerPaintProps[i].labelProps.symbolProps.visibility;

          if (currentLayer.layerSettings?.colorable) {
            set(layerPaintProps, `[${i}]labelProps.visibility`, layerLabelVisibility)
          }
          const layerType = layerPaintProps[i].paintType;

          if (layerType === "circle" && layerPaintProps[i].paintProps) {
            if (fColor) {
              layerPaintProps[i] = {
                ...layerPaintProps[i],
                paintProps: {
                  ...layerPaintProps[i].paintProps,
                  "circle-color": fColor,
                },
              };
            }

            if (sColor) {
              layerPaintProps[i] = {
                ...layerPaintProps[i],
                paintProps: {
                  ...layerPaintProps[i].paintProps,
                  "circle-stroke-color": sColor,
                },
              };
            }
            if (fColorOp) {
              layerPaintProps[i] = {
                ...layerPaintProps[i],
                paintProps: {
                  ...layerPaintProps[i].paintProps,
                  "circle-opacity": fColorOp,
                },
              };
            }
            if (sColorOp) {
              layerPaintProps[i] = {
                ...layerPaintProps[i],
                paintProps: {
                  ...layerPaintProps[i].paintProps,
                  "circle-stroke-opacity": sColorOp,
                },
              };
            }

            if (width) {
              layerPaintProps[i] = {
                ...layerPaintProps[i],
                paintProps: {
                  ...layerPaintProps[i].paintProps,
                  "circle-stroke-width": parseFloat(width),
                },
              };
            }

            //// cluster updates
            if (layerPaintProps[i].clusterProps && layerPaintProps[i].clusterProps.clusterPaintProps) {
              if (
                fColor &&
                layerPaintProps[i].clusterProps.clusterPaintProps["circle-color"] &&
                layerPaintProps[i].clusterProps.clusterPaintProps["circle-color"].stops &&
                layerPaintProps[i].clusterProps.clusterPaintProps["circle-color"].stops[0] &&
                layerPaintProps[i].clusterProps.clusterPaintProps["circle-color"].stops[1] &&
                layerPaintProps[i].clusterProps.clusterPaintProps["circle-color"].stops[2]
              ) {
                layerPaintProps[i] = {
                  ...layerPaintProps[i],
                  paintProps: {
                    ...layerPaintProps[i].paintProps,
                    "circle-color": fColor,
                  },
                  clusterProps: {
                    ...layerPaintProps[i].clusterProps,
                    clusterPaintProps: {
                      ...layerPaintProps[i].clusterProps.clusterPaintProps,

                      "circle-color": {
                        ...layerPaintProps[i].clusterProps.clusterPaintProps["circle-color"],
                        stops: [
                          [layerPaintProps[i].clusterProps.clusterPaintProps["circle-color"].stops[0][0], fColor],
                          [layerPaintProps[i].clusterProps.clusterPaintProps["circle-color"].stops[1][0], fColor],
                          [layerPaintProps[i].clusterProps.clusterPaintProps["circle-color"].stops[2][0], fColor],
                        ],
                      },
                    },
                  },
                };
              }
              if (sColor) {
                layerPaintProps[i] = {
                  ...layerPaintProps[i],
                  clusterProps: {
                    ...layerPaintProps[i].clusterProps,
                    clusterPaintProps: {
                      ...layerPaintProps[i].clusterProps.clusterPaintProps,
                      "circle-stroke-color": sColor,
                    },
                  },
                };
              }
              if (fColorOp) {
                layerPaintProps[i] = {
                  ...layerPaintProps[i],
                  clusterProps: {
                    ...layerPaintProps[i].clusterProps,
                    clusterPaintProps: {
                      ...layerPaintProps[i].clusterProps.clusterPaintProps,
                      "circle-opacity": fColorOp,
                    },
                  },
                };
              }
              if (sColorOp) {
                layerPaintProps[i] = {
                  ...layerPaintProps[i],

                  clusterProps: {
                    ...layerPaintProps[i].clusterProps,
                    clusterPaintProps: {
                      ...layerPaintProps[i].clusterProps.clusterPaintProps,
                      "circle-stroke-opacity": sColorOp,
                    },
                  },
                };
              }

              if (width) {
                layerPaintProps[i] = {
                  ...layerPaintProps[i],
                  clusterProps: {
                    ...layerPaintProps[i].clusterProps,
                    clusterPaintProps: {
                      ...layerPaintProps[i].clusterProps.clusterPaintProps,
                      "circle-stroke-width": parseFloat(width),
                    },
                  },
                };
              }
            }
          } else if (layerType === "fill" && layerPaintProps[i].paintProps) {
            if (fColor) {
              layerPaintProps[i] = {
                ...layerPaintProps[i],
                paintProps: {
                  ...layerPaintProps[i].paintProps,
                  "fill-color": fColor,
                },
              };
            }
            if (sColor) {
              layerPaintProps[i] = {
                ...layerPaintProps[i],
                paintProps: {
                  ...layerPaintProps[i].paintProps,
                  "fill-outline-color": sColor,
                },
              };
            }
            if (fColorOp) {
              layerPaintProps[i] = {
                ...layerPaintProps[i],
                paintProps: {
                  ...layerPaintProps[i].paintProps,
                  "fill-opacity": fColorOp,
                },
              };
            }
          } else if (layerType === "line" && layerPaintProps[i].paintProps) {
            if (fColor) {
              layerPaintProps[i] = {
                ...layerPaintProps[i],
                paintProps: {
                  ...layerPaintProps[i].paintProps,
                  "line-color": fColor,
                },
              };
            }

            if (fColorOp) {
              layerPaintProps[i] = {
                ...layerPaintProps[i],
                paintProps: {
                  ...layerPaintProps[i].paintProps,
                  "line-opacity": fColorOp,
                },
              };
            }

            if (width) {
              layerPaintProps[i] = {
                ...layerPaintProps[i],
                paintProps: {
                  ...layerPaintProps[i].paintProps,
                  "line-width": parseFloat(width),
                },
              };
            }
          }
        }

        currentLayer = {
          ...currentLayer,
          layerSettings,
          layerPaintProps,
        };
      }

      currentLayer = {
        ...currentLayer,
        layerSettings,
      };

      //// saving to stateApp
      // const currentLayers = [...stateApp.layers];
      // const index = currentLayers.findIndex((l) => l.layerName === currentLayer.layerName);
      // currentLayers[index] = currentLayer;
      // setStateApp((stateApp) => ({ ...stateApp, layers: [...currentLayers] }));

      //// saving to mongo
      return {
        layerPaintProps: currentLayer.layerPaintProps,
        layerSettings: currentLayer.layerSettings
      }

      ////
    }
  };

  const WidthPicker = () => {
    return (
      <FormControl
        style={{
          display: "flex",
          right: "0",
          marginLeft: layerType === "line" ? "130px" : "105px",
          flexDirection: "inherit",
          width: "130px",
          alignItems: "center",
        }}
      >
        <p style={{ marginRight: "10px" }}>Width</p>
        <Input
          style={{ width: "70px" }}
          value={width}
          onChange={(e) => {
            if (e.target.value) {
              if (e.target.value >= 0 && e.target.value <= 50) setWidth(e.target.value);
            } else setWidth(null);
          }}
          endAdornment={<InputAdornment position="end">Px</InputAdornment>}
          type="number"
        />
      </FormControl>
    );
  };

  const [source, setSource] = useState()
  const [layerGeoType, setLayerGeoType] = useState()
  const [layerName, setLayerName] = useState()

  const setLayerHandler = (layerName, layerGeoType) => {
    setLayer({
      ...layer,
      layerName: layerName,
      identifier: layerName + uuid(),
      layerGeometry: layerGeoType || 'Polygon',
    })
  }

  const createLayer = () => {

    const dataset = stateApp.datasets.find((dataset) => dataset.name === source)

    addLayer({
      variables: {
        layer: {
          ...layer,
          groupId: dataset.categories[0].groupId,
          groupName: dataset.categories[0].groupName,
          file: dataset.categories[0].file,
          identifier: layerName + uuid(),
          layerType: "file layer",
          layerCategory: "UD layer",
          public: true,
          originalFile: dataset.categories[0].originalFile,

          defaultSettings: handleLayerChange(),

          layerPaintProps: undefined,
          layerSettings: undefined

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

  useEffect(() => {
    setLayerHandler(layerName, layerGeoType)
  }, [layerName, layerGeoType])

  const layerGeometries = useMemo(() => {

    const dataset = stateApp.datasets.find((dataset) => dataset.name === source)

    return dataset?.categories.map((category) => category.layerGeometry) || []

  }, [source])

  return (
    <ClickAwayListener >
      <div style={{ width: '100%' }}>
        <Grid container direction="row" justify="space-between" alignItems="center" style={{ padding: "15px" }}>
          <Grid item>
            <Typography variant="h5">Layer Manager</Typography>
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
              <FormControl fullWidth>
                <InputLabel className={classes.label}>
                  Select Source
                </InputLabel>
                <Select onChange={(evt) => setSource(evt.target.value)}>
                  {stateApp.datasets.map((dataset) => <MenuItem value={dataset.name}>{dataset.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel className={classes.label}>
                  Select Type
                </InputLabel>
                <Select onChange={(evt) => setLayerGeoType(evt.target.value)}>
                  {layerGeometries.map((layerGeometry) => <MenuItem value={layerGeometry}>{layerGeometry}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField margin="dense" id="layerName" label="Layer Name" fullWidth onChange={(e) => setLayerName(e.target.value)} />
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
                    {layerType === "line" && <WidthPicker />}
                  </div>
                  <Paper>
                    <ColorPickerStyledBox value={fillColor} onChange={(color) => fillColorChange(color)} />
                  </Paper>
                </Grid>
                {initialStrokeColor && (
                  <Grid item xs={12}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="h6">Stroke Color</Typography>
                      {layerType === "circle" && <WidthPicker />}
                    </div>
                    <Paper>
                      <ColorPickerStyledBox value={strokeColor} onChange={(color) => strokeColorChange(color)} />
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

export default LayerManager;
