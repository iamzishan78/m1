import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import ProfileContent from "./ProfileContent";
import ProfileTitle from "./ProfileTitle";
import { ProfileContextProvider } from "./ProfileContext";

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
  const classes = useStyles();
  const [open, setOpen] = useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ProfileContextProvider>
      <Dialog
        onClose={handleClose}
        aria-labelledby="profile-dialog"
        open={open}
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
