import React, { useContext, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useMutation } from "@apollo/client";
import { UPDATELAYER } from "../../../graphQL/useMutationUpdateLayer";
import { AppContext } from "../../../AppContext";
import { useDispatch } from "react-redux";
import {
  setMainMapState,
  showErrorMessage,
  showSuccessMessage,
} from "../../../actions";
import { MapControlsContext } from "../MapControlsContext";

export default function DeleteConfirmationDialog(props) {
  const dispatch = useDispatch();
  const [, setStateApp] = useContext(AppContext);
  const [, setStateMapControls] = useContext(MapControlsContext);
  const [updateLayer, { data: layerDeleted }] = useMutation(UPDATELAYER);

  useEffect(() => {
    if (layerDeleted && layerDeleted.updateLayer) {
      if (layerDeleted.updateLayer.success) {
        dispatch(showSuccessMessage("The layer was successfully removed"));
        dispatch(setMainMapState({ removeLayerFromMap: props.layer }));
        setStateApp((state) => ({
          ...state,
          universalCircularLoaderAct: false,
        }));
        props.handleDialogClose(false);
      } else {
        dispatch(showErrorMessage("Error occurred"));
      }
    }
  }, [layerDeleted]);

  const handleAccept = () => {
    setStateApp((state) => ({ ...state, universalCircularLoaderAct: true }));
    setStateMapControls((stateMapControls) => ({
      ...stateMapControls,
      selectedControl: null,
    }));
    updateLayer({
      variables: {
        layer: {
          _id: props.layer.layerId,
          IsDeleted: true,
        },
      },
      refetchQueries: ["getAllLayerSettingsByUser"],
      // awaitRefetchQueries: true,
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
        <DialogTitle
          style={{ textAlign: "center", padding: "24px 24px 0 24px" }}
        >
          Do you want to delete the selected layer?
        </DialogTitle>

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
