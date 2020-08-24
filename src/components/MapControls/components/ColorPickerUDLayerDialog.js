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
  const [isOpen, setIsOpen] = useState(true);
  const [fillColor, setFillColor] = useState(layer.idColor);
  const [strokeColor, setStrokeColor] = useState(layer.idColor);
  const [stateMapControls, setStateMapControls] = useContext(
    MapControlsContext
  );
  const [stateApp, setStateApp] = useContext(AppContext);

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
    console.log(color);
    setFillColor(color);
  }

  const strokeColorChange = (color) => {
    console.log(color);
    setStrokeColor(color);
  }

  const handleApplyChanges = () => {
    const layerName = layer.name;
    const udLayerConfig = stateApp.udLayerConfig;
    const layerIndex = udLayerConfig.findIndex((config) => config.layerName == layerName);

    const config = {...layer};

    const type = config.layerProps[0].layerType;
    if (fillColor) {
      config.idColor = '#' + fillColor.hex;
      if (type == 'fill') {
        config.layerProps[0].paintProps['fill-color'] = '#' + fillColor.hex;
      }
      if (type == 'circle') {
        config.layerProps[0].paintProps['circle-color'] = '#' + fillColor.hex;
        if (config.layerProps[0].paintProps.clusterProps) {
          config.layerProps[0].paintProps.clusterProps.clusterPaintProps['circle-color'].stops[0][1] = '#' + fillColor.hex;
          config.layerProps[0].paintProps.clusterProps.clusterPaintProps['circle-color'].stops[1][1] = '#' + fillColor.hex;
          config.layerProps[0].paintProps.clusterProps.clusterPaintProps['circle-color'].stops[1][1] = '#' + fillColor.hex;
        }
      }
    }

    if (strokeColor) {
      if (type == 'fill') {
        config.layerProps[0].paintProps['fill-outline-color'] = '#' + strokeColor.hex;
      }
      if (type == 'circle') {
        config.layerProps[0].paintProps['circle-stroke-color'] = '#' + strokeColor.hex;
        if (config.layerProps[0].paintProps.clusterProps) {
          config.layerProps[0].paintProps.clusterProps.clusterPaintProps['circle-stroke-color'] = '#' + strokeColor.hex;
        }
      }
    }

    const layerConfig = {
      config,
      layerName,
      user: stateApp.user.mongoId
    }

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

    setStateMapControls((stateMapControls) => ({
      ...stateMapControls,
      selectedUDLayer: null
    }))
  }

  useEffect(() => {
    if (upsertedLayerConfig && upsertedLayerConfig.upsertLayerConfig && upsertedLayerConfig.upsertLayerConfig.success) {
      const udLayerConfig = stateApp.udLayerConfig.slice(0);
      const layerConfig = upsertedLayerConfig.upsertLayerConfig.layerConfig;
      udLayerConfig.push(layerConfig);
      setStateApp((stateApp) => ({
        udLayerConfig
      }));
    }
  }, [upsertedLayerConfig]);

  useEffect(() => {
    if (updatedLayerConfig && updatedLayerConfig.updateLayerConfig && updatedLayerConfig.updateLayerConfig.success) {
      const udLayerConfig = stateApp.udLayerConfig.slice(0);
      const layerConfig = upsertedLayerConfig.updateLayerConfig.layerConfig;
      const layerConfigIndex = udLayerConfig.findIndex((config) => config._id == layerConfig._id )
      udLayerConfig[layerConfigIndex] = layerConfig;
      setStateApp((stateApp) => ({
        udLayerConfig
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