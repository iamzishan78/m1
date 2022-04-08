import React, { useContext, useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import set from 'lodash/set';
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { MapControlsContext } from "../MapControlsContext";
import { AppContext } from "../../../AppContext";
import { ColorBox } from "material-ui-color";
import { Typography, Paper, Grid, Button, IconButton, Divider, FormControlLabel, Switch, Box, Tooltip, ClickAwayListener } from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import { UPDATELAYERSETTINGS } from "../../../graphQL/useMutationUpdateLayerSettings";
import Input from "@material-ui/core/Input";
import GridOnIcon from "@material-ui/icons/GridOn";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import { copy } from "components/Shared/functions";
import { getLayerColor } from "components/Shared/SidePanel/compoennts/common";
import vf_number from "components/Shared/valueformatters/vf_number";
import { useDispatch } from "react-redux";
import { setMapGridCardState } from "actions";
import FeatureFlag from "components/Shared/FeatureFlag/FeatureFlagComponent.js";
import { FEATURES } from "components/Shared/FeatureFlag/common";

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

function LayerStyling(props) {
  const { layer, fileName } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
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
  const [stateApp, setStateApp] = useContext(AppContext);

  const [updateLayerSettings] = useMutation(UPDATELAYERSETTINGS);

  useEffect(() => {
    setWidth(initialWidth);
    setFillColor(initialFillColor);
    setStrokeColor(initialStrokeColor);
  }, [initialFillColor, initialStrokeColor, initialWidth, layer]);

  const setRowsCount = () => {
    const rows = stateApp.map.querySourceFeatures(layer.layerPaintProps[0].sourceProps, {
      sourceLayer: layer.identifier
    });
    if (rows) {
      setRows(vf_number(rows.length));
    }
    return rows
  }

  useEffect(() => {
    if (layer.file) {
      setRowsCount()
      const interval = setInterval(() => {
        if (setRowsCount().length > 0) clearInterval(interval);
      }, 1000);
    }
  }, [layer, stateApp.map])

  const handleClose = () => {
    setStateMapControls((stateMapControls) => ({
      ...stateMapControls,
      selectedLayer: null,
    }));
  };

  const fillColorChange = (color) => {
    setFillColor(color);
  };

  const strokeColorChange = (color) => {
    setStrokeColor(color);
  };

  const handleApplyChanges = () => {
    if ((stateApp.layers && layer &&
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

  return (
    <ClickAwayListener onClickAway={handleApplyChanges}>
      <div style={{ width: '100%' }}>
        <Grid container direction="row" justify="space-between" alignItems="center" style={{ padding: "15px" }}>
          <Grid item>
            <Typography variant="h5">{layer.layerName === "Parcels" ? "Tracts" : layer.layerName}</Typography>
          </Grid>
          <Grid item>
            <IconButton size="small" onClick={handleClose}>
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
                    <Typography variant="h6" noWrap>
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
                      <GridOnIcon />
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
        </Grid>
      </div>
    </ClickAwayListener>
  );
}

export default LayerStyling;
