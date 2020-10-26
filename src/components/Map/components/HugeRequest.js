import React, { useEffect, useContext } from "react";
import { Modal } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../../../AppContext";

const useStyles = makeStyles((theme) => ({
  hugeRequestBox: {
    padding: "0px 15px",
    backgroundColor: "white",
    margin: 0,
    fontSize: 15,
    display: "flex",
    alignItems: "center",
    fontWeight: "bold",
    left: "2vw",
    top: "80px",
    height: "29px",
    position: "absolute",
    borderRadius: "4px",
    color: "#ff7b08",
  },
}));

export default function HugeRequest() {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  useEffect(() => {
    if (stateApp.hugeRequest) {
      setTimeout(() => {
        setStateApp((stateApp) => ({
          ...stateApp,
          hugeRequest: false,
        }));
      }, 10000);
    }
  }, [stateApp.hugeRequest]);

  if (stateApp.hugeRequest) {
    return <div className={classes.hugeRequestBox}>{stateApp.hugeRequest}</div>;
  } else {
    return null;
  }
}
