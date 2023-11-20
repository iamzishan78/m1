import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import _ from "lodash";
import { Modals } from "../../../../../styles/Modal";
import { tableController } from "hookstate/tableController";

export default function DeleteConfirmationDialogContent(props) {
  const modalClass = Modals();
  return (
    <Dialog style={{ zIndex: 9999999999 }} open={true}>
      <DialogTitle className={modalClass.title} id="customized-dialog-title">
        {props.header} {props.deletedData.length > 20 && `(${props.deletedData.length})`}
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
          disabled={!props.deletedData || props.deletedData.length === 0}
          onClick={() => {
            const selectedRows = props.deletedData

            const deletedKeys = tableController(props.tableKey).getValue('deletedKeys') || {
              mainRecord: { key: '_id' },
            };
            const deletedData = Object.keys(deletedKeys).reduce((acc, key) => {
              const { key: originalKey, func } = deletedKeys[key];
              acc[key] =
                selectedRows?.length > 0
                  ? selectedRows.map(item => {
                    let val = _.get(item, originalKey);
                    if (func) val = func(val);
                    return val;
                  })
                  : null;
              return acc;
            }, {});

            props.deleteFunc(deletedData);

            props.onClose();
          }}
          color="secondary"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
