import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";

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
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h5">Edit your profile</Typography>
      <IconButton
        aria-label="close"
        className={classes.closeButton}
        onClick={() => console.log("close")}
      >
        <CloseIcon />
      </IconButton>
    </MuiDialogTitle>
  );
};

export default ProfileTitle;
