import React, {
  useContext,
  useState,
  useEffect,
} from "react";
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


export default (props) => {
  const { layer } = props;
  const [isOpen, setIsOpen] = useState(true);
  const [fillColor, setFillColor] = useState(layer.idColor);
  const [strokeColor, setStrokeColor] = useState(layer.idColor);
  const [stateMapControls, setStateMapControls] = useContext(
    MapControlsContext
  );
  const [stateApp, setStateApp] = useContext(AppContext);

  

  const handleClose = () => {
    setIsOpen(false);
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
    console.log(fillColor, strokeColor);
    if (fillColor) {
      cpLayer.idColor = '#' + fillColor.hex;
      if (cpLayer.type == 'circle') {
        cpLayer.paintProps['circle-color'] = '#' + fillColor.hex;
      } else {
        cpLayer.paintProps['fill-color'] = '#' + fillColor.hex;
      }
    }
    if (strokeColor) {
      if (cpLayer.type == 'circle') {
        cpLayer.paintProps['circle-stroke-color'] = '#' + strokeColor.hex;
      } else {
        cpLayer.paintProps['fill-outline-color'] = '#' + strokeColor.hex;
      }
    }

    const index = stateApp.userFileLayers.findIndex((fileLayer) => fileLayer.layerName == cpLayer.layerName);
    const userFileLayers = stateApp.userFileLayers.slice(0);
    userFileLayers[index] = layer;
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