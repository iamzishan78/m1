import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default function AlertDialogSlide(props) {
  const useStyles = makeStyles(() => ({
    dialog: {
      "&  .MuiPaper-root": {
        position: "fixed",
        top: "64px !important",
        right: "0px !important",
        width: props.width ? String(props.width) : null,
        maxWidth: "100% !important",
        height: "100% !important",
        margin: "0 !important",
        //backgroundColor: "#000"
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
        {props.children}
      </Dialog>
    </div>
  );
}
