import React, { useState } from "react";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import { Modals } from "../../../../../styles/Modal";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormLabel from "@material-ui/core/FormLabel";
import {Select, InputLabel, FormControl, MenuItem, TextField, Grid} from "@material-ui/core";

export default function InviteUserDialog(props) {

  const modalClass = Modals();
  const [displayName, setName] = useState("");
  const [emails, setEmails] = useState("");
  const [user_type, setUserType] = useState("Member");
  const [role, setUserRole] = useState("Member");

  const submitInvite = () => {
    const rowData = props.rows;
    rowData.push({displayName, emails, user_type, role, adminAccess: false, last_login: "Invite sent" });
    props.setRows(rowData);
    props.onClose();
  }

  return (
    <React.Fragment>
      <DialogTitle className={modalClass.title} id="customized-dialog-title">
        Invite a New User
        <HighlightOffIcon
          fontSize="large"
          className={modalClass.titleClose}
          onClick={props.onClose}
        />
      </DialogTitle>
      <DialogContent>

      <Grid container spacing={2}>
        <FormControl style={{minWidth: 350}}>
          <Grid item xs={12}>
            <h3>Name</h3>
            <TextField
              size="small"
              placeholder="E.g. Jacob"
              fullWidth
              value={displayName}
              onChange={e=> setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <h3>Email</h3>
            <TextField
              size="small"
              placeholder="E.g. jacob@mineral.com"
              fullWidth
              value={emails}
              onChange={e=> setEmails(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <h3>User Type</h3>
            <Select
                fullWidth
                value={user_type}
                onChange={e=> setUserType(e.target.value)}
            >
                <MenuItem value="Member">Member</MenuItem>
                <MenuItem value="Guest">Guest</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12}>
            <h3>User Role</h3>
            <Select
                fullWidth
                value={role}
                onChange={e=> setUserRole(e.target.value)}
            >
                <MenuItem value="Member">Member</MenuItem>
                <MenuItem value="user">User</MenuItem>
            </Select>
          </Grid>
        </FormControl>
        </Grid>

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
            submitInvite();
          }}
          color="secondary"
        >
          Send Invite
        </Button>
      </DialogActions>
    </React.Fragment>
  );
}
