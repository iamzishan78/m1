import React, { useEffect } from "react";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { useDispatch, useSelector } from "react-redux";
import {
  hideInfoMessage,
  hideSuccessMessage,
  hideWarningMessage,
  hideErrorMessage,
} from "../../actions";
import "react-notifications/lib/notifications.css";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  notifications: {
    "& .notification-container": {
      top: "90px",
    },
  },
}));

export default function Notifications(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    infoMessage,
    successMessage,
    warningMessage,
    errorMessage,
  } = useSelector(({ notifications }) => notifications);

  useEffect(() => {
    if (infoMessage && infoMessage !== "")
      NotificationManager.info(infoMessage, null, 3000, () => {
        dispatch(hideInfoMessage);
      });
  }, [infoMessage]);

  useEffect(() => {
    if (successMessage && successMessage !== "")
      NotificationManager.success(successMessage, "Success", 3000, () => {
        dispatch(hideSuccessMessage);
      });
  }, [successMessage]);

  useEffect(() => {
    if (warningMessage && warningMessage !== "")
      NotificationManager.warning(warningMessage, "Warning", 3000, () => {
        dispatch(hideWarningMessage);
      });
  }, [warningMessage]);

  useEffect(() => {
    if (errorMessage && errorMessage !== "")
      NotificationManager.error(errorMessage, "Error", 3000, () => {
        dispatch(hideErrorMessage);
      });
  }, [errorMessage]);

  return (
    <div className={classes.notifications}>
      <NotificationContainer />
    </div>
  );
}
