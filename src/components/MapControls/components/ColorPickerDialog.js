import React, { useContext, useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { MapControlsContext } from "../MapControlsContext";
import { AppContext } from "../../../AppContext";
import { ColorBox } from "material-ui-color";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { UPDATELAYERSETTINGS } from "../../../graphQL/useMutationUpdateLayerSettings";
import { FormLabel } from "@material-ui/core";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";

function trim(str) {
  return str.replace(/^\s+|\s+$/gm, "");
}
function RGBAToHexA(rgba) {
  var inParts = rgba.substring(rgba.indexOf("(")).split(","),
    r = parseInt(trim(inParts[0].substring(1)), 10),
    g = parseInt(trim(inParts[1]), 10),
    b = parseInt(trim(inParts[2]), 10),
    a = parseFloat(
      trim(inParts[3].substring(0, inParts[3].length - 1))
    ).toFixed(2);
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

export default (props) => {
  const { layer } = props;
  if (!layer || !layer.layerPaintProps || !layer.layerPaintProps[0])
    return null;

  const ifRgbaConvt = (color) => {
    if (color.slice(0, 4) === "rgba") return RGBAToHexA(color);
    else return color;
  };

  const layerType = layer.layerPaintProps[0].paintType;
  const initialFillColor =
    layerType == "fill"
      ? ifRgbaConvt(layer.layerPaintProps[0].paintProps["fill-color"])
      : layerType == "line"
      ? ifRgbaConvt(layer.layerPaintProps[0].paintProps["line-color"])
      : ifRgbaConvt(layer.layerPaintProps[0].paintProps["circle-color"]);
  const initialStrokeColor =
    layerType == "fill"
      ? ifRgbaConvt(layer.layerPaintProps[0].paintProps["fill-outline-color"])
      : layerType == "line"
      ? undefined
      : ifRgbaConvt(layer.layerPaintProps[0].paintProps["circle-stroke-color"]);

  let initialWidth;
  if (layerType == "circle")
    initialWidth = layer.layerPaintProps[0].paintProps["circle-stroke-width"]
      ? layer.layerPaintProps[0].paintProps["circle-stroke-width"]
      : 0;
  if (layerType == "line")
    initialWidth = layer.layerPaintProps[0].paintProps["line-width"]
      ? layer.layerPaintProps[0].paintProps["line-width"]
      : 1;

  const [isOpen, setIsOpen] = useState(true);
  const [width, setWidth] = useState(initialWidth);
  const [fillColor, setFillColor] = useState(initialFillColor);
  const [strokeColor, setStrokeColor] = useState(initialStrokeColor);
  const [, setStateMapControls] = useContext(MapControlsContext);
  const [stateApp, setStateApp] = useContext(AppContext);

  const [updateLayerSettings] = useMutation(UPDATELAYERSETTINGS);

  const handleClose = () => {
    setIsOpen(false);
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
    if (
      (stateApp.layers &&
        layer &&
        ((fillColor && fillColor.rgb && fillColor.alpha) ||
          (strokeColor && strokeColor.rgb && strokeColor.alpha))) ||
      width
    ) {
      let currentLayer = { ...layer };
      let fColor;
      let fColorOp;
      let sColor;
      let sColorOp;

      if (fillColor && fillColor.rgb)
        fColor =
          fillColor.rgb.length === 3
            ? "rgb(" + fillColor.rgb.join() + ")"
            : "rgba(" + fillColor.rgb.join() + ")";

      if (fillColor && fillColor.alpha) fColorOp = fillColor.alpha;
      if (strokeColor && strokeColor.alpha) sColorOp = strokeColor.alpha;

      if (strokeColor && strokeColor.rgb)
        sColor =
          strokeColor.rgb.length === 3
            ? "rgb(" + strokeColor.rgb.join() + ")"
            : "rgba(" + strokeColor.rgb.join() + ")";

      if (
        currentLayer &&
        currentLayer.layerPaintProps &&
        currentLayer.layerPaintProps[0] &&
        currentLayer.layerPaintProps[0].paintType
      ) {
        const layerPaintProps = [...currentLayer.layerPaintProps];
        const layerType = layerPaintProps[0].paintType;

        if (layerType == "circle" && layerPaintProps[0].paintProps) {
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
          if (
            layerPaintProps[0].clusterProps &&
            layerPaintProps[0].clusterProps.clusterPaintProps
          ) {
            if (
              fColor &&
              layerPaintProps[0].clusterProps.clusterPaintProps[
                "circle-color"
              ] &&
              layerPaintProps[0].clusterProps.clusterPaintProps["circle-color"]
                .stops &&
              layerPaintProps[0].clusterProps.clusterPaintProps["circle-color"]
                .stops[0] &&
              layerPaintProps[0].clusterProps.clusterPaintProps["circle-color"]
                .stops[1] &&
              layerPaintProps[0].clusterProps.clusterPaintProps["circle-color"]
                .stops[2]
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
                      ...layerPaintProps[0].clusterProps.clusterPaintProps[
                        "circle-color"
                      ],
                      stops: [
                        [
                          layerPaintProps[0].clusterProps.clusterPaintProps[
                            "circle-color"
                          ].stops[0][0],
                          fColor,
                        ],
                        [
                          layerPaintProps[0].clusterProps.clusterPaintProps[
                            "circle-color"
                          ].stops[1][0],
                          fColor,
                        ],
                        [
                          layerPaintProps[0].clusterProps.clusterPaintProps[
                            "circle-color"
                          ].stops[2][0],
                          fColor,
                        ],
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
        } else if (layerType == "fill" && layerPaintProps[0].paintProps) {
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
        } else if (layerType == "line" && layerPaintProps[0].paintProps) {
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
          layerPaintProps,
        };
      }

      //// saving to stateApp
      const currentLayers = [...stateApp.layers];
      const index = currentLayers.findIndex(
        (l) => l.layerName == currentLayer.layerName
      );
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
          marginLeft: layerType == "line" ? "130px" : "105px",
          flexDirection: "inherit",
          width: "130px",
        }}
      >
        <p style={{ marginRight: "10px" }}>Width</p>
        <Input
          style={{ width: "70px" }}
          value={width}
          onChange={(e) => {
            if (e.target.value) {
              if (e.target.value >= 0 && e.target.value <= 50)
                setWidth(e.target.value);
            } else setWidth(null);
          }}
          endAdornment={<InputAdornment position="end">Px</InputAdornment>}
          type="number"
        />
      </FormControl>
    );
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Dialog open={isOpen} onClose={handleClose} maxWidth="xl">
        <DialogTitle>Color Selection</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={initialStrokeColor ? 6 : 12}>
              <div
                style={{
                  display: "flex",
                }}
              >
                <p>Fill Color</p>
                {layerType == "line" && <WidthPicker />}
              </div>
              <Paper>
                <ColorBox
                  value={fillColor}
                  onChange={(color) => fillColorChange(color)}
                />
              </Paper>
            </Grid>
            {initialStrokeColor && (
              <Grid item xs={6}>
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <p>Stroke Color</p>
                  {layerType == "circle" && <WidthPicker />}
                </div>
                <Paper>
                  <ColorBox
                    value={strokeColor}
                    onChange={(color) => strokeColorChange(color)}
                  />
                </Paper>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button autoFocus onClick={handleApplyChanges} color="primary">
            Apply Changes
          </Button>
        </DialogActions>
      </Dialog>
    </ClickAwayListener>
  );
};
