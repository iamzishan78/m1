import React, { useContext, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default function AlertDialogSlide(props) {
  const useStyles = makeStyles((theme) => ({
    dialog: {
      "&  .MuiPaper-root": {
        position: "fixed",
        top: "0 !important",
        right: "0px !important",
        width: props.width ? String(props.width) : null,
        maxWidth: "100% !important",
        height: "100vh !important",
        margin: "0 !important",
      },
    },
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
      >
        {props.header && (
          <DialogTitle id="alert-dialog-slide-title">
            {props.header}
          </DialogTitle>
        )}

        {props.children}
      </Dialog>
    </div>
  );
}
