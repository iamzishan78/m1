import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    padding: 5,
    backgroundColor: "#efefef",
    marginRight: 20,
  },
  card: {
    backgroundColor: "#fff",
    textAlign: "center",
    minWidth: 200,
    padding: 10,
    borderRadius: 5,
  },
  large: {
    fontSize: 30,
    margin: 0,
    color: "#555",
  },
  small: {
    fontSize: 15,
    margin: 0,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
}));

const DealDislay = ({ dealSum, dealType, dealLength, color }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.card}>
        <h4 className={classes.large}>{dealSum}</h4>
        <h5 className={classes.small} style={{ color }}>
          {dealLength} {dealType} {dealLength === 1 ? "DEAL" : "DEALS"}
        </h5>
      </div>
    </div>
  );
};

export default DealDislay;
