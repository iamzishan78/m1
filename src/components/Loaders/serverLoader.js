import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { toast } from "react-toastify";
import { Grid } from "@material-ui/core";

function CircularProgressWithLabel(props) {
  const color =
    props.type === "inprogress"
      ? "#7ca3c1"
      : props.type === "success"
      ? "#04AA6D"
      : "#A52A20";
  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      spacing={2}
    >
      <Grid item md={4}>
        <Box position="relative" display="inline-flex">
          <CircularProgress
            variant="determinate"
            {...props}
            style={{ width: "70px", height: "70px", color: color }}
          />
          <Box
            top={0}
            left={0}
            bottom={0}
            right={0}
            position="absolute"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography
              variant="caption"
              component="div"
              color="textSecondary"
            >{`${Math.round(props.value)}%`}</Typography>
          </Box>
        </Box>
      </Grid>
      <Grid item md={8}>
        <Typography variant="caption" component="div" color="textSecondary">
          {" "}
          {props.message}
        </Typography>
      </Grid>
    </Grid>
  );
}
const toastMeta = {};

const getOptions = (id, className, onClose) => {
  return {
    onClose: () => {
      if (toastMeta[id]){
        toastMeta[id].isOpen = false;
        if(onClose){
          onClose(id)
        }
      } 
    },
    hideProgressBar: true,
    pauseOnHover: true,
    closeOnClick: false,
    progress: 0.2,
    className: className || "",
  };
};

export const createToast = (id, message, progress, onClose) => {
  if (toastMeta[id] && toastMeta[id].isOpen) {
    return false;
  }

  const toastId = toast(
    <CircularProgressWithLabel
      toastId={id}
      value={progress}
      type="inprogress"
      message={message}
    />,
    getOptions(id, "", onClose)
  );

  toastMeta[id] = { message, toastId, progress, isOpen: true };
  return toastId;
};

export const updateToast = (id, message, progress) => {
  if (toastMeta[id]?.isOpen) {
    toast.update(toastMeta[id].toastId, {
      render: (
        <CircularProgressWithLabel
          toastId={id}
          value={progress}
          type="inprogress"
          message={message}
        />
      ),
    });
  }
};

export const successToast = (id, newMessage, onClose) => {
  if (toastMeta[id]) {
    const { message, isOpen } = toastMeta[id];
    let { toastId } = toastMeta[id];

    if (isOpen)
      toast.update(toastId, {
        className: "Toastify__toast_success",
        render: (
          <CircularProgressWithLabel
            toastId={id}
            value={100}
            type="success"
            message={newMessage || message}
          />
        ),
      });
    else {
      toastId = toast(
        <CircularProgressWithLabel
          toastId={id}
          value={100}
          type="success"
          message={newMessage || message}
        />,
        getOptions(id, "Toastify__toast_success", onClose)
      );
      toastMeta[id].toastId = toastId;
      toastMeta[id].isOpen = true;
    }
    // setTimeout(() => {
    //   toast.dismiss(toastId);
    //   delete toastMeta[id];
    // }, 4000);
  }
};

export const errorToast = (id, newMessage, onClose) => {
  if (toastMeta[id]) {
    const { message, progress, isOpen } = toastMeta[id];
    let { toastId } = toastMeta[id];

    if (isOpen)
      toast.update(toastId, {
        className: "Toastify__toast_error",
        render: (
          <CircularProgressWithLabel
            toastId={id}
            value={100}
            type="error"
            message={newMessage || message}
          />
        ),
      });
    else {
      toastId = toast(
        <CircularProgressWithLabel
          toastId={id}
          value={progress}
          type="error"
          message={newMessage || message}
        />,
        getOptions(id, "Toastify__toast_error", onClose)
      );
      toastMeta[id].toastId = toastId;
      toastMeta[id].isOpen = true;
    }
  }
};

export default {
  errorToast,
  createToast,
  successToast,
  updateToast,
};
