import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#F3F3F3",
    height: "273px",
    width: "273px",
    marginRight: "15px",
    border: "2px solid #C9C9C9",
    "& p": {
      textAlign: "center",
      margin: "auto 0",
      top: "calc( 50% - 8px)",
      position: "relative",
      fontSize: "0.72rem",
      color: "#757575",
    },
  },
  qrt: {
    height: "50%",
  },
  qrt2: {
    height: "50%",
  },
  qrt1: {
    position: "absolute",
    border: `2px solid ${theme.palette.secondary.main}`,
    borderRadius: "4px",
    height: "40px",
    width: "40px",
    color: theme.palette.secondary.main,
    backgroundColor: "#fff",
    "& p": {
      textAlign: "center",
      margin: "auto 0",
      top: "calc( 50% - 10px)",
      position: "relative",
    },
  },
  bb2: { borderBottom: "2px solid #C9C9C9" },
  br2: { borderRight: "2px solid #C9C9C9" },
  bb1: { borderBottom: "1px solid #C9C9C9" },
  br1: { borderRight: "1px solid #C9C9C9" },
}));

export default function QtrQtrSelector({ parcelData }) {
  const classes = useStyles();

  return (
    <div style={{ position: "relative" }}>
      <div
        className={classes.qrt1}
        style={{ top: "calc(50% - 20px)", left: "calc(50% - 28px)" }}
      >
        <p> ALL</p>
      </div>
      <div
        className={classes.qrt1}
        style={{ top: "calc(25% - 20px)", left: "calc(25% - 24px)" }}
      >
        <p> NW</p>
      </div>
      <div
        className={classes.qrt1}
        style={{ top: "calc(25% - 20px)", right: "calc(25% - 7px)" }}
      >
        <p> NE</p>
      </div>
      <div
        className={classes.qrt1}
        style={{ bottom: "calc(25% - 20px)", left: "calc(25% - 24px)" }}
      >
        <p> SW</p>
      </div>
      <div
        className={classes.qrt1}
        style={{ bottom: "calc(25% - 20px)", right: "calc(25% - 7px)" }}
      >
        <p> SE</p>
      </div>
      <Grid container className={classes.root} spacing={0}>
        {/* //// NW ////*/}
        <Grid
          item
          container
          sm={6}
          className={`${classes.qrt} ${classes.bb2} ${classes.br2}`}
        >
          <Grid
            item
            sm={6}
            className={`${classes.qrt2} ${classes.bb1} ${classes.br1}`}
          >
            <p> NWNW</p>
          </Grid>
          <Grid item sm={6} className={`${classes.qrt2} ${classes.bb1}`}>
            <p> NENW</p>
          </Grid>
          <Grid item sm={6} className={`${classes.qrt2} ${classes.br1}`}>
            <p> SWNW</p>
          </Grid>
          <Grid item sm={6} className={classes.qrt2}>
            <p> SENW</p>
          </Grid>
        </Grid>

        {/* //// NE ////*/}
        <Grid item container sm={6} className={`${classes.qrt} ${classes.bb2}`}>
          <Grid
            item
            sm={6}
            className={`${classes.qrt2} ${classes.bb1} ${classes.br1}`}
          >
            <p> NWNE</p>
          </Grid>
          <Grid item sm={6} className={`${classes.qrt2} ${classes.bb1}`}>
            <p> NENE</p>
          </Grid>
          <Grid item sm={6} className={`${classes.qrt2} ${classes.br1}`}>
            <p> SWNE</p>
          </Grid>
          <Grid item sm={6} className={classes.qrt2}>
            <p> SENE</p>
          </Grid>
        </Grid>

        {/* //// SW ////*/}
        <Grid item container sm={6} className={`${classes.qrt} ${classes.br2}`}>
          <Grid
            item
            sm={6}
            className={`${classes.qrt2} ${classes.bb1} ${classes.br1}`}
          >
            <p> NWSW</p>
          </Grid>
          <Grid item sm={6} className={`${classes.qrt2} ${classes.bb1}`}>
            <p> NESW</p>
          </Grid>
          <Grid item sm={6} className={`${classes.qrt2} ${classes.br1}`}>
            <p> SWSW</p>
          </Grid>
          <Grid item sm={6} className={classes.qrt2}>
            <p> SESW</p>
          </Grid>
        </Grid>

        {/* //// SE ////*/}
        <Grid item container sm={6} className={classes.qrt}>
          <Grid
            item
            sm={6}
            className={`${classes.qrt2} ${classes.bb1} ${classes.br1}`}
          >
            <p> NWSE</p>
          </Grid>
          <Grid item sm={6} className={`${classes.qrt2} ${classes.bb1}`}>
            <p> NESE</p>
          </Grid>
          <Grid item sm={6} className={`${classes.qrt2} ${classes.br1}`}>
            <p> SWSE</p>
          </Grid>
          <Grid item sm={6} className={classes.qrt2}>
            <p> SESE</p>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
