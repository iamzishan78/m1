import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import React, { useState , useContext} from "react";
import ProfileContent from "./ProfileContent";
import ProfileTitle from "./ProfileTitle";
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

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const Profile = () => {
  const [stateProfile, setStateProfile] = useContext(ProfileContext);
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const { isProfileOpen } = stateNav;
  const classes = useStyles();
  const history = useHistory();
  // const [open, setOpen] = useState(true);

  // console.log(stateProfile, stateNav)

  const handleClose = () => {
    // console.log(history)
    setStateNav({ ...stateNav, isProfileOpen: false });
    history.goBack()
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
            onClick={handleClose}
          >
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </ProfileContextProvider>
  );
};

export default Profile;
