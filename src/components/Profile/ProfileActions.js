import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import React, { useState, useContext } from "react";
import { ProfileContext } from "./ProfileContext";
import { NavigationContext } from "../Navigation/NavigationContext";
import { useHistory } from "react-router-dom";

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const ProfileActions = () => {
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [stateProfile, setStateProfile] = useContext(ProfileContext);
  const { isProfileOpen } = stateNav;
  const history = useHistory();

  const handleClose = () => {
    // console.log(history)
    setStateNav({ ...stateNav, isProfileOpen: false });
    history.goBack();
  };

  const handleSubmit = () => {
    console.log(stateProfile.fields);
    // setStateNav({ ...stateNav, isProfileOpen: false });
    // history.goBack()
  };

  return (
    <DialogActions>
      <Button
        variant="outlined"
        onClick={handleClose}
        color="primary"
        style={{ textTransform: "none" }}
      >
        Cancel
      </Button>
      <Button
        style={{
          textTransform: "none",
          color: "white",
          background: "#0e5721",
        }}
        variant="outlined"
        onClick={handleSubmit}
      >
        Save changes
      </Button>
    </DialogActions>
  );
};

export default ProfileActions;
