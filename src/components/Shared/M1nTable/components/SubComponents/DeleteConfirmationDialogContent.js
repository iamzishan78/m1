import React from "react";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import { Modals } from "../../../../../styles/Modal";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormLabel from "@material-ui/core/FormLabel";

export default function DeleteConfirmationDialogContent(props) {
  const modalClass = Modals();
  return (
    <React.Fragment>
      <DialogTitle className={modalClass.title} id="customized-dialog-title">
        {props.header}
        <HighlightOffIcon
          fontSize="large"
          className={modalClass.titleClose}
          onClick={props.onClose}
        />
      </DialogTitle>
      <DialogContent>
        <h3 className={modalClass.inputLabel}>{props.children}</h3>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            props.completelyDelete
              ? props.deleteFunc(
                  props.m1nSelectedRowsIds,
                  props.completelyDelete === "false" ? false : true
                )
              : props.deleteFunc(props.m1nSelectedRowsIds);
            props.onClose();
            props.setM1nSelectedRowsIndexes([]);
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
