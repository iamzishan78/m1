import React, { useState } from "react";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import { useMutation, useLazyQuery } from "@apollo/client";
import { Modals } from "../../../../../styles/Modal";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { REINVITEUSER } from "../../../../../graphQL/useMutationReinviteUser";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormLabel from "@material-ui/core/FormLabel";
import {Select, InputLabel, FormControl, MenuItem, TextField, Grid} from "@material-ui/core";

import gql from "graphql-tag";

export default function ReinviteUserDialog(props) {

  const modalClass = Modals();
  const [reinviteUser] = useMutation(REINVITEUSER);
  const { selectedUser } = props;

  const resendInvite = (id) => {
    reinviteUser({variables: {userId: id}});
    props.onClose();
    props.onCloseMenu();
  }

  return (
    <React.Fragment>
      <DialogTitle className={modalClass.title} id="customized-dialog-title">
        Resend Invitation
        <HighlightOffIcon
          fontSize="large"
          className={modalClass.titleClose}
          onClick={props.onClose}
        />
      </DialogTitle>
      <DialogContent>
        <h3 className={modalClass.inputLabel}>Resend Invite for {selectedUser.displayName}({selectedUser.emails})</h3>
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
          onClick={() => {
            resendInvite(selectedUser.id);
          }}
          color="secondary"
        >
          Confirm
        </Button>
      </DialogActions>
    </React.Fragment>
  );
}
