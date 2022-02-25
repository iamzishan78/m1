import React from "react";
import { Typography, Grid, Card, CardContent, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import TrackChangesIcon from "@material-ui/icons/TrackChanges";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import CampaignIcon from "components/Shared/svgIcons/campaign";

const cardsDefault = [
  {
    heading: "Active",
    points: 4,
  },
  {
    heading: "Inactive",
    points: 145,
  },
];

const useStyles = makeStyles(() => ({
  root: {
    padding: "30px",
  },
  card: { borderRadius: "8px" },
  noBorderCard: {
    border: "none",
    "& svg": {
      fontSize: "5rem",
      fill: "#b6d2f6",
    },
    "& .MuiTypography-root": {
      fontWeight: "bold",
    },
    "& button": {
      backgroundColor: "#eeeeee",
      color: "black",
      textTransform: "capitalize",
      fontSize: 15,
      fontWeight: "bold",
      boxShadow: "none",
      width: "300px",
    },
  },
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
    height: "235px",
    textAlign: "left",
    padding: "30px 16px",
  },
  buttonCardContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "235px",
    alignItems: "center",
  },
  issuesBadges: {
    display: "flex",
    alignItems: "center",
    color: "red",
    height: "20px",
  },
}));

const CampaignAnalytics = () => {
  const classes = useStyles();

  return (
    <Grid container direction="row" display="flex" align="center" spacing={4} textAlign="left" className={classes.root}>
      <Grid item md={3}>
        <Card variant="outlined" className={classes.noBorderCard}>
          <CardContent className={classes.buttonCardContent}>
            <CampaignIcon />
            <Typography variant="h6" component="div">
              Classic Campaign
            </Typography>
            <Button variant="contained">Create Classic Campaign</Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item md={3}>
        <Card variant="outlined" className={classes.noBorderCard}>
          <CardContent className={classes.buttonCardContent}>
            <MyLocationIcon />
            <Typography variant="h6" component="div">
              Classic Campaign
            </Typography>
            <Button variant="contained">Create Smart Campaign</Button>
          </CardContent>
        </Card>
      </Grid>
      {cardsDefault.map((card, index) => (
        <Grid item md={3} key={index}>
          <Card variant="outlined" className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography variant="h4" component="div" className={classes.cardHeaderTypography}>
                {card.heading}
              </Typography>
              <Typography variant="h4" component="div" className={classes.cardNumberTypography}>
                {card.points}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CampaignAnalytics;
