import React, { useContext, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Avatar, { ConfigProvider } from "react-avatar";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import { makeStyles } from "@material-ui/core/styles";
import M1nTable from "../../Shared/M1nTable/M1nTable";

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
        minHeight: "100vh !important",
        margin: "0 !important",
      },
      "& .MuiListItem-container": {
        borderBottom: "1px solid #c7c7c7",
      },
      "& .MuiListItemText-primary": {
        color: "#c8c8c8",
      },
      "& .MuiListItemText-secondary": {
        color: "#c7c7c7!important",
      },
      "& .MuiList-padding": {
        padding: "23px 23px 8px",
      },
      "& svg": {
        fill: "#c8c8c8",
      },
    },
  }));

  const classes = useStyles();
  return (
    <Dialog
      className={classes.dialog}
      open={props.open}
      TransitionComponent={Transition}
      keepMounted
      onClose={props.handleClickDialogClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      style={{ zIndex: 9999 }}
    >
      {props.header && (
        <DialogTitle id="alert-dialog-slide-title">{props.header}</DialogTitle>
      )}

      {props.children}
    </Dialog>
  );
}
