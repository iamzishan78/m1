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
    "&:hover": {
      backgroundColor: "rgb(195 217 224) !important",
    },
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
    "&:hover": {
      backgroundColor: "rgb(195 217 224) !important",
    },
  },
  bb2: { borderBottom: "2px solid #C9C9C9" },
  br2: { borderRight: "2px solid #C9C9C9" },
  bb1: { borderBottom: "1px solid #C9C9C9" },
  br1: { borderRight: "1px solid #C9C9C9" },
  backgrounSecondaryQrt1: {
    backgroundColor: `${theme.palette.secondary.main} !important`,
    color: "#fff !important",
  },
  backgrounSecondaryQrt2: {
    backgroundColor: `rgb(195 217 224) !important`,
    "& p": { color: `${theme.palette.primary.main} !important` },
  },
}));

export default function QtrQtrSelector({ parcelData, setQtrQtr }) {
  const classes = useStyles();

  return (
    <div style={{ position: "relative", cursor: "pointer" }}>
      {/* //// all //// */}
      <div
        className={`${classes.qrt1} ${
          Object.entries(parcelData.qtrQtr).every(([key, value]) => {
            return value;
          })
            ? classes.backgrounSecondaryQrt1
            : ""
        }`}
        style={{ top: "calc(50% - 20px)", left: "calc(50% - 28px)" }}
        onClick={() => {
          if (
            Object.entries(parcelData.qtrQtr).every(([key, value]) => {
              return value;
            })
          ) {
            setQtrQtr({
              nwnw: false,
              nenw: false,
              swnw: false,
              senw: false,
              nwne: false,
              nene: false,
              swne: false,
              sene: false,
              nwsw: false,
              nesw: false,
              swsw: false,
              sesw: false,
              nwse: false,
              nese: false,
              swse: false,
              sese: false,
            });
          } else {
            setQtrQtr({
              nwnw: true,
              nenw: true,
              swnw: true,
              senw: true,
              nwne: true,
              nene: true,
              swne: true,
              sene: true,
              nwsw: true,
              nesw: true,
              swsw: true,
              sesw: true,
              nwse: true,
              nese: true,
              swse: true,
              sese: true,
            });
          }
        }}
      >
        <p> ALL</p>
      </div>

      {/* //// NW //// */}
      <div
        className={`${classes.qrt1} ${
          Object.entries(parcelData.qtrQtr).every(([key, value]) => {
            return ["nwnw", "nenw", "swnw", "senw"].indexOf(key) === -1
              ? true
              : value;
          })
            ? classes.backgrounSecondaryQrt1
            : ""
        }`}
        style={{ top: "calc(25% - 20px)", left: "calc(25% - 24px)" }}
        onClick={() => {
          if (
            Object.entries(parcelData.qtrQtr).every(([key, value]) => {
              return ["nwnw", "nenw", "swnw", "senw"].indexOf(key) === -1
                ? true
                : value;
            })
          ) {
            setQtrQtr({
              ...parcelData.qtrQtr,
              nwnw: false,
              nenw: false,
              swnw: false,
              senw: false,
            });
          } else {
            setQtrQtr({
              ...parcelData.qtrQtr,
              nwnw: true,
              nenw: true,
              swnw: true,
              senw: true,
            });
          }
        }}
      >
        <p> NW</p>
      </div>

      {/* //// NE //// */}
      <div
        className={`${classes.qrt1} ${
          Object.entries(parcelData.qtrQtr).every(([key, value]) => {
            return ["nwne", "nene", "swne", "sene"].indexOf(key) === -1
              ? true
              : value;
          })
            ? classes.backgrounSecondaryQrt1
            : ""
        }`}
        style={{ top: "calc(25% - 20px)", right: "calc(25% - 7px)" }}
        onClick={() => {
          if (
            Object.entries(parcelData.qtrQtr).every(([key, value]) => {
              return ["nwne", "nene", "swne", "sene"].indexOf(key) === -1
                ? true
                : value;
            })
          ) {
            setQtrQtr({
              ...parcelData.qtrQtr,
              nwne: false,
              nene: false,
              swne: false,
              sene: false,
            });
          } else {
            setQtrQtr({
              ...parcelData.qtrQtr,
              nwne: true,
              nene: true,
              swne: true,
              sene: true,
            });
          }
        }}
      >
        <p> NE</p>
      </div>

      {/* //// SW //// */}
      <div
        className={`${classes.qrt1} ${
          Object.entries(parcelData.qtrQtr).every(([key, value]) => {
            return ["nwsw", "nesw", "swsw", "sesw"].indexOf(key) === -1
              ? true
              : value;
          })
            ? classes.backgrounSecondaryQrt1
            : ""
        }`}
        style={{ bottom: "calc(25% - 20px)", left: "calc(25% - 24px)" }}
        onClick={() => {
          if (
            Object.entries(parcelData.qtrQtr).every(([key, value]) => {
              return ["nwsw", "nesw", "swsw", "sesw"].indexOf(key) === -1
                ? true
                : value;
            })
          ) {
            setQtrQtr({
              ...parcelData.qtrQtr,
              nwsw: false,
              nesw: false,
              swsw: false,
              sesw: false,
            });
          } else {
            setQtrQtr({
              ...parcelData.qtrQtr,
              nwsw: true,
              nesw: true,
              swsw: true,
              sesw: true,
            });
          }
        }}
      >
        <p> SW</p>
      </div>

      {/* //// SE //// */}
      <div
        className={`${classes.qrt1} ${
          Object.entries(parcelData.qtrQtr).every(([key, value]) => {
            return ["nwse", "nese", "swse", "sese"].indexOf(key) === -1
              ? true
              : value;
          })
            ? classes.backgrounSecondaryQrt1
            : ""
        }`}
        style={{ bottom: "calc(25% - 20px)", right: "calc(25% - 7px)" }}
        onClick={() => {
          if (
            Object.entries(parcelData.qtrQtr).every(([key, value]) => {
              return ["nwse", "nese", "swse", "sese"].indexOf(key) === -1
                ? true
                : value;
            })
          ) {
            setQtrQtr({
              ...parcelData.qtrQtr,
              nwse: false,
              nese: false,
              swse: false,
              sese: false,
            });
          } else {
            setQtrQtr({
              ...parcelData.qtrQtr,
              nwse: true,
              nese: true,
              swse: true,
              sese: true,
            });
          }
        }}
      >
        <p> SE</p>
      </div>

      <Grid container className={classes.root} spacing={0}>
        {/* //// NW Snd qtrs ////*/}
        <Grid
          item
          container
          sm={6}
          className={`${classes.qrt} ${classes.bb2} ${classes.br2}`}
        >
          <Grid
            item
            sm={6}
            className={`${classes.qrt2} ${classes.bb1} ${classes.br1} ${
              parcelData.qtrQtr.nwnw ? classes.backgrounSecondaryQrt2 : ""
            }`}
            onClick={() => {
              setQtrQtr({
                ...parcelData.qtrQtr,
                nwnw: parcelData.qtrQtr.nwnw ? false : true,
              });
            }}
          >
            <p> NWNW</p>
          </Grid>
          <Grid
            item
            sm={6}
            className={`${classes.qrt2} ${classes.bb1} ${
              parcelData.qtrQtr.nenw ? classes.backgrounSecondaryQrt2 : ""
            }`}
            onClick={() => {
              setQtrQtr({
                ...parcelData.qtrQtr,
                nenw: parcelData.qtrQtr.nenw ? false : true,
              });
            }}
          >
            <p> NENW</p>
          </Grid>
          <Grid
            item
            sm={6}
            className={`${classes.qrt2} ${classes.br1} ${
              parcelData.qtrQtr.swnw ? classes.backgrounSecondaryQrt2 : ""
            }`}
            onClick={() => {
              setQtrQtr({
                ...parcelData.qtrQtr,
                swnw: parcelData.qtrQtr.swnw ? false : true,
              });
            }}
          >
            <p> SWNW</p>
          </Grid>
          <Grid
            item
            sm={6}
            className={`${classes.qrt2} ${
              parcelData.qtrQtr.senw ? classes.backgrounSecondaryQrt2 : ""
            }`}
            onClick={() => {
              setQtrQtr({
                ...parcelData.qtrQtr,
                senw: parcelData.qtrQtr.senw ? false : true,
              });
            }}
          >
            <p> SENW</p>
          </Grid>
        </Grid>

        {/* //// NE Snd qtrs ////*/}
        <Grid item container sm={6} className={`${classes.qrt} ${classes.bb2}`}>
          <Grid
            item
            sm={6}
            className={`${classes.qrt2} ${classes.bb1} ${classes.br1} ${
              parcelData.qtrQtr.nwne ? classes.backgrounSecondaryQrt2 : ""
            }`}
            onClick={() => {
              setQtrQtr({
                ...parcelData.qtrQtr,
                nwne: parcelData.qtrQtr.nwne ? false : true,
              });
            }}
          >
            <p> NWNE</p>
          </Grid>
          <Grid
            item
            sm={6}
            className={`${classes.qrt2} ${classes.bb1} ${
              parcelData.qtrQtr.nene ? classes.backgrounSecondaryQrt2 : ""
            }`}
            onClick={() => {
              setQtrQtr({
                ...parcelData.qtrQtr,
                nene: parcelData.qtrQtr.nene ? false : true,
              });
            }}
          >
            <p> NENE</p>
          </Grid>
          <Grid
            item
            sm={6}
            className={`${classes.qrt2} ${classes.br1} ${
              parcelData.qtrQtr.swne ? classes.backgrounSecondaryQrt2 : ""
            }`}
            onClick={() => {
              setQtrQtr({
                ...parcelData.qtrQtr,
                swne: parcelData.qtrQtr.swne ? false : true,
              });
            }}
          >
            <p> SWNE</p>
          </Grid>
          <Grid
            item
            sm={6}
            className={`${classes.qrt2} ${
              parcelData.qtrQtr.sene ? classes.backgrounSecondaryQrt2 : ""
            }`}
            onClick={() => {
              setQtrQtr({
                ...parcelData.qtrQtr,
                sene: parcelData.qtrQtr.sene ? false : true,
              });
            }}
          >
            <p> SENE</p>
          </Grid>
        </Grid>

        {/* //// SW Snd qtrs ////*/}
        <Grid item container sm={6} className={`${classes.qrt} ${classes.br2}`}>
          <Grid
            item
            sm={6}
            className={`${classes.qrt2} ${classes.bb1} ${classes.br1} ${
              parcelData.qtrQtr.nwsw ? classes.backgrounSecondaryQrt2 : ""
            }`}
            onClick={() => {
              setQtrQtr({
                ...parcelData.qtrQtr,
                nwsw: parcelData.qtrQtr.nwsw ? false : true,
              });
            }}
          >
            <p> NWSW</p>
          </Grid>
          <Grid
            item
            sm={6}
            className={`${classes.qrt2} ${classes.bb1} ${
              parcelData.qtrQtr.nesw ? classes.backgrounSecondaryQrt2 : ""
            }`}
            onClick={() => {
              setQtrQtr({
                ...parcelData.qtrQtr,
                nesw: parcelData.qtrQtr.nesw ? false : true,
              });
            }}
          >
            <p> NESW</p>
          </Grid>
          <Grid
            item
            sm={6}
            className={`${classes.qrt2} ${classes.br1} ${
              parcelData.qtrQtr.swsw ? classes.backgrounSecondaryQrt2 : ""
            }`}
            onClick={() => {
              setQtrQtr({
                ...parcelData.qtrQtr,
                swsw: parcelData.qtrQtr.swsw ? false : true,
              });
            }}
          >
            <p> SWSW</p>
          </Grid>
          <Grid
            item
            sm={6}
            className={`${classes.qrt2} ${
              parcelData.qtrQtr.sesw ? classes.backgrounSecondaryQrt2 : ""
            }`}
            onClick={() => {
              setQtrQtr({
                ...parcelData.qtrQtr,
                sesw: parcelData.qtrQtr.sesw ? false : true,
              });
            }}
          >
            <p> SESW</p>
          </Grid>
        </Grid>

        {/* //// SE Snd qtrs ////*/}
        <Grid item container sm={6} className={classes.qrt}>
          <Grid
            item
            sm={6}
            className={`${classes.qrt2} ${classes.bb1} ${classes.br1} ${
              parcelData.qtrQtr.nwse ? classes.backgrounSecondaryQrt2 : ""
            }`}
            onClick={() => {
              setQtrQtr({
                ...parcelData.qtrQtr,
                nwse: parcelData.qtrQtr.nwse ? false : true,
              });
            }}
          >
            <p> NWSE</p>
          </Grid>
          <Grid
            item
            sm={6}
            className={`${classes.qrt2} ${classes.bb1} ${
              parcelData.qtrQtr.nese ? classes.backgrounSecondaryQrt2 : ""
            }`}
            onClick={() => {
              setQtrQtr({
                ...parcelData.qtrQtr,
                nese: parcelData.qtrQtr.nese ? false : true,
              });
            }}
          >
            <p> NESE</p>
          </Grid>
          <Grid
            item
            sm={6}
            className={`${classes.qrt2} ${classes.br1} ${
              parcelData.qtrQtr.swse ? classes.backgrounSecondaryQrt2 : ""
            }`}
            onClick={() => {
              setQtrQtr({
                ...parcelData.qtrQtr,
                swse: parcelData.qtrQtr.swse ? false : true,
              });
            }}
          >
            <p> SWSE</p>
          </Grid>
          <Grid
            item
            sm={6}
            className={`${classes.qrt2} ${
              parcelData.qtrQtr.sese ? classes.backgrounSecondaryQrt2 : ""
            }`}
            onClick={() => {
              setQtrQtr({
                ...parcelData.qtrQtr,
                sese: parcelData.qtrQtr.sese ? false : true,
              });
            }}
          >
            <p> SESE</p>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
