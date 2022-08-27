import React, { useContext, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useMutation } from "@apollo/client";
import { AppContext } from "AppContext";
import { useDispatch } from "react-redux";
import { setMainMapState, showErrorMessage, showSuccessMessage } from "actions";
import { MapControlsContext } from "../../MapControlsContext";
import { UPDATE_MANY_LAYER } from "graphQL/useMutationUpdateManyLayer";
import { UPDATE_DATASET } from "graphQL/useMutationDataset";

export default function DeleteSourceAndCategoryConfirmationDialog(props) {
  const dispatch = useDispatch();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [, setStateMapControls] = useContext(MapControlsContext);
  const [updateDataset] = useMutation(UPDATE_DATASET, { refetchQueries: ["getDatasets"], awaitRefetchQueries: true });

  const [updateManyLayer, { data: layersDeleted }] = useMutation(UPDATE_MANY_LAYER);

  const isSource = !props.actionItem?.category
  const title = isSource ? 'Datasource' : 'Category';
  const layers = stateApp.layers.filter((layer) => (isSource ? layer.file === props.actionItem.dataset.file : layer.file === props.actionItem.dataset.file && layer.layerGeometry === props.actionItem.category.layerGeometry))

  useEffect(() => {
    if (layersDeleted && layersDeleted.updateManyLayer) {
      if (layersDeleted.updateManyLayer.success) {
        dispatch(showSuccessMessage("The Group was successfully removed"));
        dispatch(setMainMapState({ removeLayerFromMap: layers }));
        setStateApp((state) => ({
          ...state,
          universalCircularLoaderAct: false,
        }));
        props.handleDialogClose(false);
      } else {
        setStateApp((state) => ({
          ...state,
          universalCircularLoaderAct: false,
        }));
        dispatch(showErrorMessage("Error occurred"));
      }
    }
  }, [layersDeleted]);

  const handleAccept = () => {
    setStateApp((state) => ({ ...state, universalCircularLoaderAct: true }));
    setStateMapControls((stateMapControls) => ({
      ...stateMapControls,
      // selectedControl: 'layer'
    }));

    if (isSource) {
      props.actionItem.dataset.IsDeleted = true
    } else {
      const category = props.actionItem.dataset.categories.find((category) => category.name === props.actionItem.category.name)
      category.IsDeleted = true
    }
    updateDataset({ variables: { dataset: props.actionItem.dataset } })
    updateManyLayer({
      variables: {
        layers: layers.map((layer) => ({ _id: layer.layerId, IsDeleted: true })),
      },
      refetchQueries: ["getAllLayerSettingsByUser"],
    });
  };

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth="xs"
        open={props.openDialog}
        onClose={() => {
          props.handleDialogClose(false);
        }}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle style={{ textAlign: "center", padding: "24px 24px 0 24px" }}>Do you want to permanently delete the selected {title}? This action will also delete all layers tied to selected {title}?</DialogTitle>

        <DialogActions>
          <Button
            onClick={() => {
              props.handleDialogClose(false);
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleAccept();
            }}
            color="primary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
