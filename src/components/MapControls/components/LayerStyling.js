import React, { useContext, useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { withStyles } from "@material-ui/core/styles";
import { MapControlsContext } from "../MapControlsContext";
import { AppContext } from "../../../AppContext";
import { ColorBox } from "material-ui-color";
import { Typography, Paper, Grid, Button, IconButton, Divider, FormControlLabel, Switch } from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import { UPDATELAYERSETTINGS } from "../../../graphQL/useMutationUpdateLayerSettings";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import { copy } from "components/Shared/functions";

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

function LayerStyling(props) {
  const { layer } = props;
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
      width || layer.layerPaintProps[0].labelProps?.visibility !== layerLabelVisibility ||
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


        if (layerPaintProps[0]?.labelProps?.symbolProps?.visibility)
          delete layerPaintProps[0].labelProps.symbolProps.visibility;

        if (layerPaintProps[0]?.labelProps?.visibility)
          layerPaintProps[0].labelProps.visibility = layerLabelVisibility
        const layerType = layerPaintProps[0].paintType;

        if (layerType === "circle" && layerPaintProps[0].paintProps) {
          if (fColor) {
            layerPaintProps[0] = {
              ...layerPaintProps[0],
              paintProps: {
                ...layerPaintProps[0].paintProps,
                "circle-color": fColor,
              },
            };
          }

          if (sColor) {
            layerPaintProps[0] = {
              ...layerPaintProps[0],
              paintProps: {
                ...layerPaintProps[0].paintProps,
                "circle-stroke-color": sColor,
              },
            };
          }
          if (fColorOp) {
            layerPaintProps[0] = {
              ...layerPaintProps[0],
              paintProps: {
                ...layerPaintProps[0].paintProps,
                "circle-opacity": fColorOp,
              },
            };
          }
          if (sColorOp) {
            layerPaintProps[0] = {
              ...layerPaintProps[0],
              paintProps: {
                ...layerPaintProps[0].paintProps,
                "circle-stroke-opacity": sColorOp,
              },
            };
          }

          if (width) {
            layerPaintProps[0] = {
              ...layerPaintProps[0],
              paintProps: {
                ...layerPaintProps[0].paintProps,
                "circle-stroke-width": parseFloat(width),
              },
            };
          }

          //// cluster updates
          if (layerPaintProps[0].clusterProps && layerPaintProps[0].clusterProps.clusterPaintProps) {
            if (
              fColor &&
              layerPaintProps[0].clusterProps.clusterPaintProps["circle-color"] &&
              layerPaintProps[0].clusterProps.clusterPaintProps["circle-color"].stops &&
              layerPaintProps[0].clusterProps.clusterPaintProps["circle-color"].stops[0] &&
              layerPaintProps[0].clusterProps.clusterPaintProps["circle-color"].stops[1] &&
              layerPaintProps[0].clusterProps.clusterPaintProps["circle-color"].stops[2]
            ) {
              layerPaintProps[0] = {
                ...layerPaintProps[0],
                paintProps: {
                  ...layerPaintProps[0].paintProps,
                  "circle-color": fColor,
                },
                clusterProps: {
                  ...layerPaintProps[0].clusterProps,
                  clusterPaintProps: {
                    ...layerPaintProps[0].clusterProps.clusterPaintProps,

                    "circle-color": {
                      ...layerPaintProps[0].clusterProps.clusterPaintProps["circle-color"],
                      stops: [
                        [layerPaintProps[0].clusterProps.clusterPaintProps["circle-color"].stops[0][0], fColor],
                        [layerPaintProps[0].clusterProps.clusterPaintProps["circle-color"].stops[1][0], fColor],
                        [layerPaintProps[0].clusterProps.clusterPaintProps["circle-color"].stops[2][0], fColor],
                      ],
                    },
                  },
                },
              };
            }
            if (sColor) {
              layerPaintProps[0] = {
                ...layerPaintProps[0],
                clusterProps: {
                  ...layerPaintProps[0].clusterProps,
                  clusterPaintProps: {
                    ...layerPaintProps[0].clusterProps.clusterPaintProps,
                    "circle-stroke-color": sColor,
                  },
                },
              };
            }
            if (fColorOp) {
              layerPaintProps[0] = {
                ...layerPaintProps[0],
                clusterProps: {
                  ...layerPaintProps[0].clusterProps,
                  clusterPaintProps: {
                    ...layerPaintProps[0].clusterProps.clusterPaintProps,
                    "circle-opacity": fColorOp,
                  },
                },
              };
            }
            if (sColorOp) {
              layerPaintProps[0] = {
                ...layerPaintProps[0],

                clusterProps: {
                  ...layerPaintProps[0].clusterProps,
                  clusterPaintProps: {
                    ...layerPaintProps[0].clusterProps.clusterPaintProps,
                    "circle-stroke-opacity": sColorOp,
                  },
                },
              };
            }

            if (width) {
              layerPaintProps[0] = {
                ...layerPaintProps[0],
                clusterProps: {
                  ...layerPaintProps[0].clusterProps,
                  clusterPaintProps: {
                    ...layerPaintProps[0].clusterProps.clusterPaintProps,
                    "circle-stroke-width": parseFloat(width),
                  },
                },
              };
            }
          }
        } else if (layerType === "fill" && layerPaintProps[0].paintProps) {
          if (fColor) {
            layerPaintProps[0] = {
              ...layerPaintProps[0],
              paintProps: {
                ...layerPaintProps[0].paintProps,
                "fill-color": fColor,
              },
            };
          }
          if (sColor) {
            layerPaintProps[0] = {
              ...layerPaintProps[0],
              paintProps: {
                ...layerPaintProps[0].paintProps,
                "fill-outline-color": sColor,
              },
            };
          }
          if (fColorOp) {
            layerPaintProps[0] = {
              ...layerPaintProps[0],
              paintProps: {
                ...layerPaintProps[0].paintProps,
                "fill-opacity": fColorOp,
              },
            };
          }
        } else if (layerType === "line" && layerPaintProps[0].paintProps) {
          if (fColor) {
            layerPaintProps[0] = {
              ...layerPaintProps[0],
              paintProps: {
                ...layerPaintProps[0].paintProps,
                "line-color": fColor,
              },
            };
          }

          if (fColorOp) {
            layerPaintProps[0] = {
              ...layerPaintProps[0],
              paintProps: {
                ...layerPaintProps[0].paintProps,
                "line-opacity": fColorOp,
              },
            };
          }

          if (width) {
            layerPaintProps[0] = {
              ...layerPaintProps[0],
              paintProps: {
                ...layerPaintProps[0].paintProps,
                "line-width": parseFloat(width),
              },
            };
          }
        }

        currentLayer = {
          ...currentLayer,
          layerSettings,
          layerPaintProps,
        };
      }

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

  // console.log("LayerStyling", layer)

  return (
    <div style={{ width: '100%' }}>
      <Grid container direction="row" justify="space-between" alignItems="center" style={{ padding: "15px" }}>
        <Grid item>
          <Typography variant="h5">{layer.layerName}</Typography>
        </Grid>
        <Grid item>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Divider />
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
      <div
        style={{
          position: "absolute",
          right: "0px",
          bottom: "0px",
          padding: "15px",
        }}
      >
        <Button autoFocus onClick={handleClose} color="primary" >
          Cancel
        </Button>
        <Button autoFocus onClick={handleApplyChanges} color="primary">
          Apply Changes
        </Button>
      </div>
    </div>
  );
}

export default LayerStyling;
