import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import React, { useContext, useState, useEffect } from "react";
import { NavigationContext } from "../Navigation/NavigationContext";
import { ProfileContext } from "./ProfileContext";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

const ProfileTitle = (props) => {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [stateProfile, setStateProfile] = useContext(ProfileContext);
  const [defaultProfile, setDefaultProfile] = useState(null);

  // Destructure fields from stateProfile
  const { fields } = stateProfile;

  // Store the initial state when the dialog opens
  useEffect(() => {
    // check if defaultProfile is null and any field is defined
    if (!defaultProfile && Object.values(fields).some(field => field)) {
      setDefaultProfile(stateProfile);
    }
  }, [stateProfile, defaultProfile]);

  const handleClose = () => {
    setStateNav({ ...stateNav, isProfileOpen: false });
    
    // Revert to the initial state if changes were not saved
    if (defaultProfile) {
      setStateProfile(defaultProfile);
    }
  };

  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h5">My Account Settings</Typography>
      <IconButton
        aria-label="close"
        className={classes.closeButton}
        onClick={(e) => handleClose(e)}
      >
        <CloseIcon />
      </IconButton>
    </MuiDialogTitle>
  );
};

export default ProfileTitle;
