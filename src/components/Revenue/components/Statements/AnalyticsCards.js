import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Grid, Card, CardContent, Typography } from "@material-ui/core";
import { Warning as WarningIcon } from "@material-ui/icons";

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
    color: "red",
    height: "20px",
  },
}));

export default function AnalyticsCards(props) {
  const classes = useStyles();
  return (
    <Grid container direction="row" display="flex" align="center" spacing={4} textAlign="left" className={classes.root}>
      <Grid item md={3}>
        <Card variant="outlined" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
              Statements
            </Typography>
            <Typography variant="h6" component="div" className={classes.cardNumberTypography}>
              {props.checks}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item md={3}>
        <Card variant="outlined" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
              Approved
            </Typography>
            <Typography variant="h6" component="div" className={classes.cardNumberTypography}>
              {props.approvedCount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item md={3}>
        <Card variant="outlined" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
              Needs Approval
            </Typography>
            <Typography variant="h6" component="div" className={classes.cardNumberTypography} style={{ color: "#b9b908" }}>
              {props.unapprovedCount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item md={3}>
        <Card variant="outlined" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
              Potential Issues
            </Typography>
            <div className={classes.issuesBadges}>
              <div style={{marginRight: 6}}>
                <WarningIcon />
              </div>
              <div>4</div>
              &nbsp;
              <div style={{marginRight: 6}}>
                <WarningIcon />
              </div>
              <div>1 </div>
              &nbsp;
              <div style={{marginRight: 6}}>
                <WarningIcon />
              </div>
              <div>7</div>
            </div>
            <Typography variant="h6" component="div" className={classes.cardNumberTypography} style={{ color: "red" }}>
              12
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
