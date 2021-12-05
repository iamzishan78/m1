import React from "react";

import { makeStyles } from "@material-ui/styles";
import { Grid, Card, CardContent, Typography } from "@material-ui/core";
import { Warning as WarningIcon } from "@material-ui/icons";

const useStyles = makeStyles(() => ({
  root: {
    padding: "30px 75px",
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
  issuesBadges: {
    display: "flex",
    alignItems: "center",
    color: "red",
    height: "20px",
  },
}));

export default function AnalyticsCards(props) {
  const classes = useStyles();
  const { cards } = props;

  return (
    <Grid container direction="row" display="flex" align="center" spacing={4} textAlign="left" className={classes.root}>
      {cards.map((card, index) => (
        <Grid item md={3}>
          <Card variant="outlined" className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
                {card.heading}
              </Typography>
              {card.type === "error" && (
                <div className={classes.issuesBadges}>
                  <div>
                    <WarningIcon />
                  </div>{" "}
                  <div>3</div>
                  &nbsp;
                  <div>
                    <WarningIcon />
                  </div>
                  <div>4</div>
                  &nbsp;
                  <div>
                    <WarningIcon />
                  </div>{" "}
                  <div>1</div>
                </div>
              )}
              <Typography
                variant="h6"
                component="div"
                className={classes.cardNumberTypography}
                style={{ color: card.type === "warning" ? "#b9b908" : "" }}
              >
                {card.points}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
