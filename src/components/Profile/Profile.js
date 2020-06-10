import Dialog from "@material-ui/core/Dialog";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import React, { useState, useContext } from "react";
import ProfileContent from "./ProfileContent";
import ProfileTitle from "./ProfileTitle";
import ProfileActions from "./ProfileActions";
import { ProfileContextProvider, ProfileContext } from "./ProfileContext";
import { NavigationContext } from "../Navigation/NavigationContext";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(() => ({
  paper: {
    marginTop: "64px",
    marginLeft: "auto",
    marginBottom: "auto",
    minWidth: "400px",
    maxHeight: "calc(100% - 72px)",
  },
}));

const Profile = () => {
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const { isProfileOpen } = stateNav;
  const classes = useStyles();
  const history = useHistory();

  const handleClose = () => {
    setStateNav({ ...stateNav, isProfileOpen: false });
    history.goBack();
  };

  return (
    <ProfileContextProvider>
      <Dialog
        onClose={handleClose}
        aria-labelledby="profile-dialog"
        open={isProfileOpen}
        classes={{ paper: classes.paper }}
      >
        <ProfileTitle />
        <ProfileContent />
        <ProfileActions />
      </Dialog>
    </ProfileContextProvider>
  );
};

export default Profile;
