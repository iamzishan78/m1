import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Grid, Card, CardContent, Typography } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    padding: "75px",
  },
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
}));

export default function AnalyticsCards() {
  const classes = useStyles();
  return (
    <Grid container direction="row" display="flex" align="center" spacing={4} textAlign="left" className={classes.root}>
      <Grid item md={3}>
        <Card variant="outlined" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
              Total Properties
            </Typography>
            <Typography variant="h6" component="div" className={classes.cardNumberTypography}>
              1,463
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item md={3}>
        <Card variant="outlined" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
              Active
            </Typography>
            <Typography variant="h6" component="div" className={classes.cardNumberTypography}>
              992
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item md={3}>
        <Card variant="outlined" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
              Active
            </Typography>
            <Typography variant="h6" component="div" className={classes.cardNumberTypography}>
              992
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item md={3}>
        <Card variant="outlined" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
              Unmapped
            </Typography>
            <Typography variant="h6" component="div" className={classes.cardNumberTypography} style={{ color: "#b9b908" }}>
              17
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
