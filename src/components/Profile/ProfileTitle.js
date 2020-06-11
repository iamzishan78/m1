import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { NavigationContext } from "../Navigation/NavigationContext";


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
  const history = useHistory();
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);

  const handleClose = () => {
    setStateNav({ ...stateNav, isProfileOpen: false });
    history.goBack()
  };

  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h5">Edit your profile</Typography>
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
