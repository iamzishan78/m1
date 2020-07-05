import React, { useState, useEffect, useContext } from "react";
import { useMutation } from "@apollo/react-hooks";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { AppContext } from "../../AppContext";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fff",
  },
  leadScore: {
    width: "80px",
    height: "80px",
    backgroundColor: "white",
    color: "#0033de",
    border: "4px solid",
    borderRadius: "100%",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}));

export default function LeadScore({
  score,
  lastSeen,
  lastContacted,
  lastModified,
}) {
  // const [stateTransact, setStateTransact] = useContext(TransactContext);

  const classes = useStyles();

  return (
    <Card className={classes.root} variant="outlined">
      <CardActions>
        <div
          style={{
            textAlign: "center",
          }}
        >
          <Typography variant="button" gutterBottom>
            Lead Score
          </Typography>
        </div>
      </CardActions>
      <CardContent>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <div
            style={{
              textAlign: "center",
            }}
          >
            <div className={classes.leadScore}>
              <Typography variant="button">
                {score}
              </Typography>
            </div>
            <Typography variant="button">
              Last Seen:
            </Typography>
            <Typography variant="small">
              {lastSeen}
            </Typography>
            <Typography variant="button">
              Last contacted:
            </Typography>
            <Typography variant="small">
              {lastContacted}
            </Typography>
            <Typography variant="button">
              Last modified:
            </Typography>
            <Typography variant="button">
              {lastModified}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
