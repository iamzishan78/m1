import React from "react";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

export default function DeleteConfirmationDialogContent(props) {
  return (
    <React.Fragment>
      <DialogTitle style={{ textAlign: "center", padding: "24px 24px 0 24px" }}>
        {props.children}
      </DialogTitle>
      <DialogActions>
        <Button
          onClick={() => {
            props.deleteFunc(props.idOrIds);
            props.onClose();
          }}
          color="primary"
        >
          Delete
        </Button>
        <Button
          onClick={() => {
            props.onClose();
          }}
          color="primary"
        >
          Cancel
        </Button>
      </DialogActions>
    </React.Fragment>
  );
}
