import React, { useState, useEffect, useContext, } from "react";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import { useMutation, useLazyQuery } from "@apollo/client";
import { Modals } from "../../../../../styles/Modal";
import { AppContext } from "../../../../../AppContext";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { ADDUSER } from "../../../../../graphQL/useMutationAddUser";
import { UPDATEUSER } from "../../../../../graphQL/useMutationUpdateUser";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormLabel from "@material-ui/core/FormLabel";
import {Select, InputLabel, FormControl, MenuItem, TextField, Grid} from "@material-ui/core";

export default function InviteUserDialog(props) {

  const modalClass = Modals();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [displayName, setName] = useState("");
  const [emails, setEmailAddress] = useState("");
  const [userType, setUserType] = useState("Member");
  const [role, setUserRole] = useState("Member");
  const [adminAccess, setAdminAccess] = useState(false);
  const [lastLogin, setLastLogin] = useState();
  const [addUser] = useMutation(ADDUSER, { 
    onCompleted: () => {
      setLoading(false);
      handleClose();
    },
    refetchQueries: [   
      "getAllUsers",
    ],
    awaitRefetchQueries: true,
  });
  const [updateUser] = useMutation(UPDATEUSER, { 
    onCompleted: () => {
      setLoading(false);
      handleClose();
    },
    refetchQueries: [   
      "getAllUsers",
    ],
    awaitRefetchQueries: true,
  });

  useEffect(() => {
    if (stateApp.activeUser) {
      setName(stateApp.activeUser.displayName);
      setEmailAddress(stateApp.activeUser.emails);
      setUserRole(stateApp.activeUser.role);
      setLastLogin(stateApp.activeUser.lastLogin);
    }
  }, [stateApp.activeUser]);

  const submitAddUser = () => {
    setLoading(true);
    // const rowData = props.rows;
    // let temp_last_ts = new Date();
    // setLastLogin(temp_last_ts.toString());
    // rowData.push({displayName, emails, userType, role, adminAccess, lastLogin: "Invite sent" });
    addUser({variables: {user: {
      displayName,
      emailAddress: emails,
      role
      // identities: [{
      //     signInType: "emailAddress",
      //     issuer: "mineralb2c.onmicrosoft.com",
      //     issuerAssignedId: emails
      //   },],
      // passwordProfile : {
      //   forceChangePasswordNextSignIn: false,
      //   password: "1"
      // },
      // passwordPolicies: "DisablePasswordExpiration,DisableStrongPassword",
      // extension_ecdc741a6b2c415893d3b5bccc2d7e76_mustResetPassword: true
    }}});

    // props.setRows(rowData);
  }

  const submitUpdateUser = () => {
    setLoading(true);
    // const rowData = props.rows;
    // let temp_last_ts = new Date();
    // setLastLogin(temp_last_ts.toString());
    // rowData.push({displayName, emails, userType, role, adminAccess, lastLogin: "Invite sent" });
    updateUser({variables: {user: {
      id: stateApp.activeUser.id,
      displayName,
      emailAddress: emails,
      role
      // identities: [{
      //     signInType: "emailAddress",
      //     issuer: "mineralb2c.onmicrosoft.com",
      //     issuerAssignedId: emails
      //   },],
      // passwordProfile : {
      //   forceChangePasswordNextSignIn: false,
      //   password: "1"
      // },
      // passwordPolicies: "DisablePasswordExpiration,DisableStrongPassword",
      // extension_ecdc741a6b2c415893d3b5bccc2d7e76_mustResetPassword: true
    }}});

    // props.setRows(rowData);
  }

  const handleClose = () => {
    setName("");
    setEmailAddress("");
    setUserRole("Member");
    setLastLogin(null);

    setStateApp((state) => {
      return {
        ...stateApp,
        activeUser: null,
      };
    });
    
    props.onClose();
  }

  return (
    <React.Fragment>
      <DialogTitle className={modalClass.title} id="customized-dialog-title">
      {stateApp.activeUser ? "Update User" : "Invite a New User"}
        <HighlightOffIcon
          fontSize="large"
          className={modalClass.titleClose}
          onClick={handleClose}
        />
      </DialogTitle>
      <DialogContent>

      <Grid container spacing={2}>
        <FormControl style={{minWidth: 350}}>
          <Grid item xs={12}>
            <h3>Name</h3>
            <TextField
              size="small"
              fullWidth
              value={displayName}
              onChange={e=> setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <h3>Email</h3>
            <TextField
              size="small"
              fullWidth
              disabled={stateApp.activeUser}
              value={emails}
              onChange={e=> setEmailAddress(e.target.value)}
            />
          </Grid>
          {/* <Grid item xs={12}>
            <h3>User Type</h3>
            <Select
                fullWidth
                value={userType}
                onChange={e=> setUserType(e.target.value)}
            >
                <MenuItem value="Member">Member</MenuItem>
                <MenuItem value="Guest">Guest</MenuItem>
            </Select>
          </Grid> */}
          <Grid item xs={12}>
            <h3>User Role</h3>
            <Select
                fullWidth
                value={role}
                onChange={e=> setUserRole(e.target.value)}
            >
                <MenuItem value="Owner">Owner</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="User">User</MenuItem>
            </Select>
          </Grid>
        </FormControl>
        </Grid>

      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          onClick={stateApp.activeUser ? submitUpdateUser : submitAddUser}
          color="secondary"
        >
          {stateApp.activeUser ? "Update" : "Send Invite"}
        </Button>
      </DialogActions>
    </React.Fragment>
  );
}
