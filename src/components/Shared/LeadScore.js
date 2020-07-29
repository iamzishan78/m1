import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "23px 23px 0 23px",
  },
  leadScore: {
    width: "80px",
    height: "80px",
    border: `5px solid #BCE7EE`,
    borderRadius: "100%",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: { width: "100%", display: "flex" },
  leftColumn: {
    textAlign: "center",
    marginRight: "18px",
  },
  LCFooter: {
    fontWeight: "inherit",
    color: "#757575",
    marginTop: "0",
    float: "right",
  },
  lastContactedSpan: { fontWeight: "normal", marginBottom: "0" },
  scoreVariations: { color: "#757575", marginTop: "0", fontWeight: "normal" },
}));

export default function LeadScore({ score, lastContacted }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div>
        <h4 style={{ marginTop: "0", float: "left" }}>Lead Score</h4>
        <h4 className={classes.LCFooter}>Cold</h4>
      </div>
      <div className={classes.cardContent}>
        <div className={classes.leftColumn}>
          <div className={classes.leadScore}>
            <Typography variant="h4" style={{ color: "rgb(130 204 216)" }}>
              {score}
            </Typography>
          </div>
        </div>

        <div>
          <h5 className={classes.scoreVariations}>
            Lead score up 0% in the last 30 days
          </h5>
          <h5 style={{ color: "#757575" }}>
            Last Contacted
            <br />
            <span className={classes.lastContactedSpan}>{lastContacted}</span>
          </h5>
        </div>
      </div>
    </div>
  );
}
