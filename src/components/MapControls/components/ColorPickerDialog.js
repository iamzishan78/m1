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
import { UPDATELAYERCONFIG } from "../../../graphQL/useMutationUpdateLayerConfig";
import { UPSERTLAYERCONFIG } from "../../../graphQL/useMutationUpsertLayerConfig";


export default (props) => {
  const { layer } = props;
  const layerType = layer.layerPaintProps[0].paintType;
  const initialFillColor = layerType == 'fill' ? layer.layerPaintProps[0].paintProps['fill-color'] : layer.layerPaintProps[0].paintProps['circle-color']
  const initialStrokeColor = layerType == 'fill' ? layer.layerPaintProps[0].paintProps['fill-outline-color'] : layer.layerPaintProps[0].paintProps['circle-stroke-color'];
  const [isOpen, setIsOpen] = useState(true);
  const [fillColor, setFillColor] = useState(initialFillColor);
  const [strokeColor, setStrokeColor] = useState(initialStrokeColor);
  const [stateMapControls, setStateMapControls] = useContext(
    MapControlsContext
  );
  const [stateApp, setStateApp] = useContext(AppContext);

  const [tmpPaintProps, setPaintProps] = useState(null);
  const [tmplayerConfig, setLayerConfig] = useState(null);

  const [updateFileLayer, { data: fileLayer }] = useMutation(
    UPDATEFILELAYER
  );

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
      selectedLayer: null
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

  const processFileLayer = () => {
    let config = {};
    
    const fileLayersData = stateApp.userFileLayers;
    const layerIndex = fileLayersData.findIndex((fileLayer) => fileLayer.layerName == layer.layerName);
    let cpLayer = {...fileLayersData[layerIndex]};

    console.log(fillColor, strokeColor);
    if (fillColor && fillColor.hex) {
      cpLayer.idColor = '#' + fillColor.hex;
      config.fillColor = '#' + fillColor.hex;
      if (cpLayer.layerType == 'circle') {
        cpLayer.paintProps['circle-color'] = '#' + fillColor.hex;
      } else {
        cpLayer.paintProps['fill-color'] = '#' + fillColor.hex;
      }
    }
    if (strokeColor && strokeColor.hex) {
      config.strokeColor = '#' + strokeColor.hex;
      if (cpLayer.layerType == 'circle') {
        cpLayer.paintProps['circle-stroke-color'] = '#' + strokeColor.hex;
      } else {
        cpLayer.paintProps['fill-outline-color'] = '#' + strokeColor.hex;
      }
    }

    setPaintProps(config);

    const fileLayerId = cpLayer.fileLayerId;

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

  const processDataLayer = () => {
    const layerName = layer.layerName;
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

  const handleApplyChanges = () => {
    if (layer.layerType == 'data layer') {
      processDataLayer();
    } else {
      processFileLayer();
    }
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
        selectedLayer: null
      }))
    }
  }, [fileLayer])

  useEffect(() => {
    if (upsertedLayerConfig && upsertedLayerConfig.upsertLayerConfig && upsertedLayerConfig.upsertLayerConfig.success) {
      const udLayerConfig = stateApp.udLayerConfig.slice(0);
      const layerConfig = {...upsertedLayerConfig.upsertLayerConfig.layerConfig};
      udLayerConfig.push(layerConfig);
      setStateApp((stateApp) => ({
        ...stateApp,
        udLayerConfig
      }));
      setStateMapControls((stateMapControls) => ({
        ...stateMapControls,
        selectedLayer: null
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
      setStateMapControls((stateMapControls) => ({
        ...stateMapControls,
        selectedLayer: null
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