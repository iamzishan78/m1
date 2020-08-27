import React, {
  useContext,
  useState,
  useEffect,
} from "react";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { MapControlsContext } from "../MapControlsContext";
import { AppContext } from "../../../AppContext";
import { ColorBox } from 'material-ui-color';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import { UPDATEFILELAYER } from "../../../graphQL/useMutationUpdateFileLayer";


export default (props) => {
  const { layer } = props;
  const existStrokeColor = layer.type == 'fill' ? layer.paintProps['fill-outline-color'] : layer.paintProps['circle-stroke-color'];
  const [isOpen, setIsOpen] = useState(true);
  const [fillColor, setFillColor] = useState(layer.idColor);
  const [strokeColor, setStrokeColor] = useState(existStrokeColor);
  const [stateMapControls, setStateMapControls] = useContext(
    MapControlsContext
  );
  const [stateApp, setStateApp] = useContext(AppContext);

  const [tmpPaintProps, setPaintProps] = useState(null);

  const [updateFileLayer, { data: fileLayer }] = useMutation(
    UPDATEFILELAYER
  );

  const handleClose = () => {
    setIsOpen(false);
    setStateMapControls((stateMapControls) => ({
      ...stateMapControls,
      selectedFileLayer: null
    }));
  }

  const fillColorChange = (color) => {
    console.log(color);
    setFillColor(color);
  }

  const strokeColorChange = (color) => {
    console.log(color);
    setStrokeColor(color);
  }

  const handleApplyChanges = () => {
    let cpLayer = {...layer};
    let config = {};
    console.log(fillColor, strokeColor);
    if (fillColor && fillColor.hex) {
      cpLayer.idColor = '#' + fillColor.hex;
      config.fillColor = '#' + fillColor.hex;
      if (cpLayer.type == 'circle') {
        cpLayer.paintProps['circle-color'] = '#' + fillColor.hex;
      } else {
        cpLayer.paintProps['fill-color'] = '#' + fillColor.hex;
      }
    }
    if (strokeColor && strokeColor.hex) {
      config.strokeColor = '#' + strokeColor.hex;
      if (cpLayer.type == 'circle') {
        cpLayer.paintProps['circle-stroke-color'] = '#' + strokeColor.hex;
      } else {
        cpLayer.paintProps['fill-outline-color'] = '#' + strokeColor.hex;
      }
    }

    setPaintProps(config);

    const fileLayerId = layer.fileLayerId;

    updateFileLayer({
      variables: {
        fileLayerId: fileLayerId,
        fileLayer: {
          layerName: cpLayer.layerName,
          user: stateApp.user.mongoId,
          file: cpLayer.fileId,
          idColor: cpLayer.idColor,
          layerType: cpLayer.layerType,
          paintProps: cpLayer.paintProps
        }
      }
    });
  }

  useEffect(() => {
    if (fileLayer && fileLayer.updateFileLayer && fileLayer.updateFileLayer.success) {
      const index = stateApp.userFileLayers.findIndex((fileLayer) => fileLayer.layerName == layer.layerName);
      const userFileLayers = stateApp.userFileLayers.slice(0);

      const fileLayerData = fileLayer.updateFileLayer.fileLayer;
      const layerName = fileLayerData.layerName;
      const fileContent = layer.fileContent;
      const layerType = fileLayerData.layerType;
      if (tmpPaintProps.fillColor) {
        fileLayerData.idColor = tmpPaintProps.fillColor;
        if (fileLayerData.type == 'circle') {
          fileLayerData.paintProps['circle-color'] = tmpPaintProps.fillColor;
        } else {
          fileLayerData.paintProps['fill-color'] = tmpPaintProps.fillColor;
        }
      }
      if (tmpPaintProps.strokeColor) {
        if (fileLayerData.type == 'circle') {
          fileLayerData.paintProps['circle-stroke-color'] = tmpPaintProps.strokeColor;
        } else {
          fileLayerData.paintProps['fill-outline-color'] = tmpPaintProps.strokeColor;
        }
      }
      const paintProps = fileLayerData.paintProps;
      const idColor = fileLayerData.idColor;
      const fileId = fileLayerData.file._id;
      const fileLayerId = fileLayerData._id

      userFileLayers[index] = {fileLayerId, layerName, fileContent, idColor, layerType, paintProps, fileId};
      console.log(userFileLayers);
      setStateApp((stateApp) => ({
        ...stateApp,
        userFileLayers: userFileLayers
      }));
      setStateMapControls((stateMapControls) => ({
        ...stateMapControls,
        selectedFileLayer: null
      }))
    }
  }, [fileLayer])

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Dialog open={isOpen} onClose={handleClose} maxWidth='xl'>
        <DialogTitle>
          Color Selection
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <p>Fill Color</p>
              <Paper>
                <ColorBox value={fillColor} onChange={(color) => fillColorChange(color)} />
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <p>Stroke Color</p>
              <Paper>
                <ColorBox value={strokeColor} onChange={(color) => strokeColorChange(color)} />
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
}