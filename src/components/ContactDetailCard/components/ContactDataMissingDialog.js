import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import { Modals } from "styles/Modal";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

export default function ContactDataMissingDialog(props) {

  const modalClass = Modals();
  return (
    <Dialog
      open={true}
      onClose={props.onClose}
    >
      <React.Fragment>
        <DialogTitle className={modalClass.title} id="customized-dialog-title">
          Contact Data Missing
          <HighlightOffIcon
            fontSize="large"
            className={modalClass.titleClose}
            onClick={props.onClose}
          />
        </DialogTitle>
        <DialogContent>
          <h3 className={modalClass.inputLabel}>
            Required Fields (First Name, Last Name and Address) are missing for following contacts:
          </h3>
          {props.contacts.map(contact => {
            return (
              <div>{`${contact.firstName} ${contact.lastName}`}</div>
            )
          })}
          
        </DialogContent>
      </React.Fragment>
    </Dialog>
  );
}
