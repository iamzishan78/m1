import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function DeleteDocumentConfirmation({
  open,
  handleClose,
  handleAccept,
}) {
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to delete the selected document(s)?
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Cancel
          </Button>
          <Button onClick={handleAccept} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
