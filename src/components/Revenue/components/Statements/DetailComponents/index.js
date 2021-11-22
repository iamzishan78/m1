import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Typography, IconButton } from "@material-ui/core";
import { LocalAtm as CurrencyIcon } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "95.2vh !important",
    backgroundColor: "#f3f3f3",
    padding: "55px",
  },
  detailHeader: {
    backgroundColor: "#fff",
    padding: "20px",
  },
  title: {
    display: "flex",
  },
  titleText: {
    margin: "2px 0px 0px 5px",
  },
  icon: {
    height: "65px",
    width: "65px",
    backgroundColor: "lightgrey",
  },
}));

export default function DetailComponents() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.detailHeader}>
        <div className={classes.title}>
          <IconButton className={classes.icon}>
            <CurrencyIcon />
          </IconButton>
          <div className={classes.titleText}>
            <Typography style={{ fontWeight: "bold", fontSize: "large" }}>43736848334 - Exxon Mobile Corp</Typography>
            <Typography variant="caption">10/3/2021</Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
