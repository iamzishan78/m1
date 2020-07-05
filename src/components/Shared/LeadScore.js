import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

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
        <div>
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
          </div>
          <div
            style={{
              textAlign: "center",
            }}
          >
            <Typography variant="button" dispaly="block">
              Last Seen:
            </Typography>
            <Typography variant="overline" dispaly="block">
              {lastSeen}
            </Typography>
          </div>
          <div
            style={{
              textAlign: "center",
            }}
          >
            <Typography variant="button" dispaly="block">
              Last contacted:
            </Typography>
            <Typography variant="overline" dispaly="block">
              {lastContacted}
            </Typography>
          </div>
          <div
            style={{
              textAlign: "center",
            }}
          >
            <Typography variant="button" dispaly="block">
              Last modified:
            </Typography>
            <Typography variant="overline" dispaly="block">
              {lastModified}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
