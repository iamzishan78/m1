import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import { Modals } from "../../../../../styles/Modal";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

export default function DeleteConfirmationDialogContent(props) {
  const modalClass = Modals();
  return (
    <Dialog style={{ zIndex: 9999999999 }} open={true}>
      <DialogTitle className={modalClass.title} id="customized-dialog-title">
        {props.header}
        <HighlightOffIcon fontSize="large" className={modalClass.titleClose} onClick={props.onClose} />
      </DialogTitle>
      <DialogContent>
        <h3 className={modalClass.inputLabel}>{props.children}</h3>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            props.onClose();
          }}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          id="deleteButton"
          onClick={() => {
            props.completelyDelete
              ? props.deleteFunc(props.m1nSelectedRowsIds, props.completelyDelete === "false" ? false : true)
              : props.deleteFunc(props.m1nSelectedRowsIds);
            props.onClose();
            if (props.setM1nSelectedRowsIndexes) {
              props.setM1nSelectedRowsIndexes([]);
            }
          }}
          color="secondary"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
