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

export default (props) => {
  const { layer } = props;
  if (!layer || !layer.layerPaintProps || !layer.layerPaintProps[0]) return;

  const layerType = layer.layerPaintProps[0].paintType;
  const initialFillColor =
    layerType == "fill"
      ? layer.layerPaintProps[0].paintProps["fill-color"]
      : layer.layerPaintProps[0].paintProps["circle-color"];
  const initialStrokeColor =
    layerType == "fill"
      ? layer.layerPaintProps[0].paintProps["fill-outline-color"]
      : layer.layerPaintProps[0].paintProps["circle-stroke-color"];
  const [isOpen, setIsOpen] = useState(true);
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
    console.log(color);
    setFillColor(color);
  };

  const strokeColorChange = (color) => {
    console.log(color);
    setStrokeColor(color);
  };

  const handleApplyChanges = () => {
    if (
      stateApp.layers &&
      layer &&
      ((fillColor && fillColor.hex) || (strokeColor && strokeColor.hex))
    ) {
      let currentLayer = { ...layer };
      let fColor;
      let sColor;
      if (fillColor && fillColor.hex) fColor = "#" + fillColor.hex;
      if (strokeColor && strokeColor.hex) sColor = "#" + strokeColor.hex;

      if (
        currentLayer &&
        currentLayer.layerPaintProps &&
        currentLayer.layerPaintProps[0] &&
        currentLayer.layerPaintProps[0].paintType
      ) {
        const layerPaintProps = [...currentLayer.layerPaintProps];
        const layerType = layerPaintProps[0].paintType;

        if (
          layerType == "circle" &&
          layerPaintProps[0].paintProps &&
          layerPaintProps[0].clusterProps &&
          layerPaintProps[0].clusterProps.clusterPaintProps
        ) {
          if (
            fColor &&
            layerPaintProps[0].clusterProps.clusterPaintProps["circle-color"] &&
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
              paintProps: {
                ...layerPaintProps[0].paintProps,
                "circle-stroke-color": sColor,
              },
              clusterProps: {
                ...layerPaintProps[0].clusterProps,
                clusterPaintProps: {
                  ...layerPaintProps[0].clusterProps.clusterPaintProps,
                  "circle-stroke-color": sColor,
                },
              },
            };
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
      handleClose();
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Dialog open={isOpen} onClose={handleClose} maxWidth="xl">
        <DialogTitle>Color Selection</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <p>Fill Color</p>
              <Paper>
                <ColorBox
                  value={fillColor}
                  onChange={(color) => fillColorChange(color)}
                />
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <p>Stroke Color</p>
              <Paper>
                <ColorBox
                  value={strokeColor}
                  onChange={(color) => strokeColorChange(color)}
                />
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleApplyChanges} color="primary">
            Apply Changes
          </Button>
          <Button autoFocus onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </ClickAwayListener>
  );
};
