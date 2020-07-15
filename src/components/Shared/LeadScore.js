import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "23px",
  },
  leadScore: {
    width: "90px",
    height: "90px",
    border: `5px solid #63E1F7`,
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
  LCFooter: { width: "100%", color: "#757575", marginBottom: "0" },
  lastContactedSpan: { fontWeight: "normal", marginBottom: "0" },
  scoreVariations: { color: "#757575", marginTop: "0", fontWeight: "normal" },
}));

export default function LeadScore({ score, lastContacted }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h4 style={{ width: "100%" }}>Lead Score</h4>
      <div className={classes.cardContent}>
        <div className={classes.leftColumn}>
          <div className={classes.leadScore}>
            <Typography variant="h4">{score}</Typography>
          </div>
          <h4 className={classes.LCFooter}>Cold</h4>
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
