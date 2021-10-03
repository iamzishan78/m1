import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import { Modals } from "styles/Modal";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import get from 'lodash/get';

export default function ContactDataMissingDialog(props) {

  const modalClass = Modals();

  const getMissingKeys = (contact) => {
    const keys = []
    if(!contact.firstName){
      keys.push('First Name')
    }
    if(!contact.lastName){
      keys.push('Last Name')
    }
    if(!contact.address1){
      keys.push('Address')
    }
    return <span className="red">({keys.map(key=> {
      return <span> {key} </span>
    })})</span>
    

  }
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
              <div> {`${get(contact,'firstName', '')} ${get(contact,'lastName','')}`}   {getMissingKeys(contact)}  {`${get(contact,'address1', '')}`} {`${get(contact,'city', '')}`} {`${get(contact,'state', '')}`} {`${get(contact,'zip', '')}`}     </div>
            )
          })}
          
        </DialogContent>
      </React.Fragment>
    </Dialog>
  );
}
