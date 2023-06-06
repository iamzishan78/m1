import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Grid, Card, CardContent, Typography } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  card: { borderRadius: "8px" },
  cardHeaderTypography: {
    fontWeight: "bolder",
    marginBottom: "25px",
  },
  cardNumberTypography: {
    fontWeight: 900,
    fontSize: "xx-large",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "160px",
    textAlign: "left",
  },
  issuesBadges: {
    display: "flex",
    alignItems: "center",
    color: "#ff0000",
    height: "20px",
  },
  tooltip: {
    position: "absolute",
    top: 72,
    color: "rgb(255, 0, 0)",
    width: 200,
    left: -148,
  },
  tooltipText: {
    fontSize: 14,
    lineHeight: "120%",
    textAlign: "left"
  }
}));

export default function AnalyticsCards(props) {
  const classes = useStyles();
  return (
    <Grid container direction="row" display="flex" align="center" spacing={4} textAlign="left" style={{ margin: "5px" }} className={classes.root}>
      <Grid item md={3}>
        <Card variant="outlined" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
              Total Properties
            </Typography>
            <Typography variant="h6" component="div" className={classes.cardNumberTypography}>
              {props?.properties || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item md={3}>
        <Card variant="outlined" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
              Mismatched Interests
            </Typography>
            <Typography variant="h6" component="div" className={classes.cardNumberTypography}>
              {props?.misMatchedInterests || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item md={3}>
        <Card variant="outlined" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
              Potential Gain/Loss
            </Typography>
            <Typography variant="h6" component="div" className={classes.cardNumberTypography}>
              {props?.potentialGainLossSum || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
