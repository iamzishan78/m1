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

import { UPDATELAYERCONFIG } from "../../../graphQL/useMutationUpdateLayerConfig";
import { UPSERTLAYERCONFIG } from "../../../graphQL/useMutationUpsertLayerConfig";


export default (props) => {
  const { layer } = props;
  const existStrokeColor = layer.layerProps[0].layerType == 'fill' ? layer.layerProps[0].paintProps["fill-outline-color"] : layer.layerProps[0].paintProps["circle-stroke-color"];
  const [isOpen, setIsOpen] = useState(true);
  const [fillColor, setFillColor] = useState(layer.idColor);
  const [strokeColor, setStrokeColor] = useState(existStrokeColor);
  const [stateMapControls, setStateMapControls] = useContext(
    MapControlsContext
  );
  const [stateApp, setStateApp] = useContext(AppContext);

  const [tmplayerConfig, setLayerConfig] = useState(null);

  const [updateLayerConfig, { data: updatedLayerConfig }] = useMutation(
    UPDATELAYERCONFIG
  );

  const [upsertLayerConfig, { data: upsertedLayerConfig }] = useMutation(
    UPSERTLAYERCONFIG
  );

  const handleClose = () => {
    setIsOpen(false);
    setStateMapControls((stateMapControls) => ({
      ...stateMapControls,
      selectedUDLayer: null
    }));
  }

  const fillColorChange = (color) => {
    setFillColor(color);
  }

  const strokeColorChange = (color) => {
    setStrokeColor(color);
  }

  const handleApplyChanges = () => {
    const layerName = layer.name;
    const udLayerConfig = stateApp.udLayerConfig;
    const layerIndex = udLayerConfig.findIndex((config) => config.layerName == layerName);

    console.log("before apply cahnge", stateApp.udLayerConfig);

    let config = {};
    if (fillColor && fillColor.hex) {
      config.fillColor = '#' + fillColor.hex;
    }

    if (strokeColor && strokeColor.hex) {
      config.strokeColor = '#' + strokeColor.hex;
    }

    if (Object.keys(config).length == 0) {
      alert("Please select the color");
    } else {
      const layerConfig = {
        config,
        layerName,
        user: stateApp.user.mongoId
      }
  
      console.log(layerConfig);
  
      setLayerConfig(layerConfig);
  
      if (layerIndex == -1) {
        upsertLayerConfig({
          variables: {
            layerConfig
          }
        });
      } else {
        const id = udLayerConfig[layerIndex]._id;
        updateLayerConfig({
          variables: {
            layerConfigId: id,
            layerConfig
          }
        });
      }
    }
  }

  useEffect(() => {
    if (upsertedLayerConfig && upsertedLayerConfig.upsertLayerConfig && upsertedLayerConfig.upsertLayerConfig.success) {
      const udLayerConfig = stateApp.udLayerConfig.slice(0);
      const layerConfig = {...upsertedLayerConfig.upsertLayerConfig.layerConfig};
      udLayerConfig.push(layerConfig);
      setStateApp((stateApp) => ({
        ...stateApp,
        udLayerConfig
      }));
      setIsOpen(false);
      setStateMapControls((stateMapControls) => ({
        ...stateMapControls,
        selectedUDLayer: null
      }));
    }
  }, [upsertedLayerConfig]);

  useEffect(() => {
    if (updatedLayerConfig && updatedLayerConfig.updateLayerConfig && updatedLayerConfig.updateLayerConfig.success) {
      console.log(stateApp.udLayerConfig);
      const udLayerConfig = stateApp.udLayerConfig.slice(0);
      const layerConfig = {...updatedLayerConfig.updateLayerConfig.layerConfig};
      const layerConfigIndex = udLayerConfig.findIndex((config) => config._id == layerConfig._id )
      udLayerConfig[layerConfigIndex] = {...tmplayerConfig, _id: layerConfig._id};
      console.log("before set state value", udLayerConfig);
      setStateApp((stateApp) => ({
        ...stateApp,
        udLayerConfig: udLayerConfig
      }));
      setIsOpen(false);
      setStateMapControls((stateMapControls) => ({
        ...stateMapControls,
        selectedUDLayer: null
      }));
    }
  }, [updatedLayerConfig]);

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