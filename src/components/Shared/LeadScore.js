import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fff",
    marginTop: "8px",
    marginBottom: "8px",
  },
  leadScore: {
    width: "120px",
    height: "120px",
    backgroundColor: "white",
    color: "#0033de",
    border: "4px solid",
    borderRadius: "100%",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  leadTitle: {
    justifyContent: "center",
    alignItems: "center"
  },
  leadInfoTitle: {
    fontWeight: 'bold'
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
      <CardActions classes={classes.leadTitle}>
        <Typography variant="button" gutterBottom>
          Lead Score
        </Typography>
      </CardActions>
      <CardContent>
        <div>
          <div
            style={{
              textAlign: "center",
            }}
          >
            <div className={classes.leadScore}>
              <Typography variant="h4">
                {score}
              </Typography>
            </div>
          </div>
          <div
            style={{
              textAlign: "center",
              marginBottom: "15px",
            }}
          >
            <Typography variant="button" component="p" className={classes.leadInfoTitle}>
              Last Seen:
            </Typography>
            <Typography variant="caption" component="p">
              {lastSeen || "--"}
            </Typography>
          </div>
          <div
            style={{
              textAlign: "center",
              marginBottom: "15px",
            }}
          >
            <Typography variant="button" component="p" className={classes.leadInfoTitle}>
              Last contacted:
            </Typography>
            <Typography variant="caption" component="p">
              {lastContacted || "--"}
            </Typography>
          </div>
          <div
            style={{
              textAlign: "center",
              marginBottom: "15px",
            }}
          >
            <Typography variant="button" component="p" className={classes.leadInfoTitle}>
              Last modified:
            </Typography>
            <Typography variant="caption" component="p">
              {lastModified || "--"}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
