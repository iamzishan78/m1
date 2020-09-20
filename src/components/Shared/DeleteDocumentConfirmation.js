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
          Are you sure you want to delete this document?
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleAccept} color="primary">
            Delete
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
