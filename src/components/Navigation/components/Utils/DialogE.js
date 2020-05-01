import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default function DialogE(props) {
  const useStyles = makeStyles(theme => ({
    dialog: {
      top: "50%",
      left: "50%",
    }
  }));
  const classes = useStyles();

  return (
    <div>
      <Dialog
        className={classes.dialog}
        open={props.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={props.handleClickDialogClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        disablePortal={true}
      >
        {props.children}
      </Dialog>
    </div>
  );
}
