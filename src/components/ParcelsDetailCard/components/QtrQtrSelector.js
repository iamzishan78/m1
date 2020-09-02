import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import SmallTXQtr from "./SmallTXQtr";

const useStyles = makeStyles((theme) => ({
  mainDiv: {
    position: "relative",
    cursor: ({ parcelData }) =>
      parcelData.state !== "TXtemporaryRemoved" ? "pointer" : "context-menu",
    "& p": {
      WebkitTouchCallout: "none" /* iOS Safari */,
      WebkitUserSelect: "none" /* Safari */,
      KhtmlUserSelect: "none" /* Konqueror HTML */,
      MozUserSelect: "none" /* Old versions of Firefox */,
      MsUserSelect: "none" /* Internet Explorer/Edge */,
      userSelect:
        "none" /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */,
    },
  },
  root: {
    backgroundColor: ({ parcelData }) =>
      parcelData.state !== "TX" ? "#F3F3F3" : "#fff",
    height: "387px",
    width: "387px",
    marginRight: "15px",
    border: "2px solid #C9C9C9",
    "& p": {
      textAlign: "center",
      margin: "auto 0",
      top: "calc( 50% - 8px)",
      position: "relative",
      fontSize: "0.72rem",
      color: ({ parcelData }) =>
        parcelData.state !== "TXtemporaryRemoved" ? "#757575" : "#75757552",
    },
  },
  qrt: {
    height: "50%",
  },
  qrt2: {
    height: "50%",
    "&:hover": {
      backgroundColor: ({ parcelData }) =>
        parcelData.state !== "TXtemporaryRemoved" ? "#BFEBFB !important" : "",
    },
  },
  qrt1: {
    position: "absolute",
    border: ({ parcelData }) =>
      `2px solid ${
        parcelData.state !== "TXtemporaryRemoved"
          ? theme.palette.secondary.main
          : "#C9C9C9"
      }`,
    borderRadius: "4px",
    height: ({ parcelData }) => (parcelData.state === "TX" ? "20px" : "40px"),
    width: ({ parcelData }) => (parcelData.state === "TX" ? "20px" : "40px"),
    color: ({ parcelData }) =>
      parcelData.state !== "TXtemporaryRemoved"
        ? theme.palette.secondary.main
        : "#75757552",
    backgroundColor: ({ parcelData }) =>
      parcelData.state !== "TXtemporaryRemoved" ? "#fff" : "#F3F3F3",
    "& p": {
      textAlign: "center",
      margin: "auto 0",
      top: "calc( 50% - 10px)",
      position: "relative",
    },
    "&:hover": {
      backgroundColor: ({ parcelData }) =>
        parcelData.state !== "TXtemporaryRemoved" ? "#BFEBFB !important" : "",
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
    backgroundColor: `#BFEBFB !important`,
    "& p": { color: `${theme.palette.primary.main} !important` },
  },
}));

export default function QtrQtrSelector({ parcelData, setQtrQtr }) {
  const classes = useStyles({ parcelData });

  return (
    <div>
      <p className="formLabel" style={{ marginTop: "0" }}>
        Use the grid to select portions of parcel to be included
      </p>
      <div className={classes.mainDiv}>
        {/* //// all //// */}
        <div
          className={`${classes.qrt1} ${
            parcelData.state !== "TXtemporaryRemoved" &&
            parcelData.qtrQtr &&
            Object.entries(parcelData.qtrQtr).every(([key, value]) => {
              return value;
            })
              ? classes.backgrounSecondaryQrt1
              : ""
          }`}
          style={{
            top:
              parcelData.state !== "TX"
                ? "calc(50% - 20px)"
                : "calc(50% - 10px)",
            left:
              parcelData.state !== "TX"
                ? "calc(50% - 28px)"
                : "calc(50% - 19px)",
          }}
          onClick={() => {
            if (
              parcelData.state !== "TXtemporaryRemovedtemporaryRemoved" &&
              parcelData.qtrQtr
            )
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
          {parcelData.state !== "TX" && <p> ALL</p>}
        </div>

        {/* //// NW //// */}
        <div
          className={`${classes.qrt1} ${
            parcelData.state !== "TXtemporaryRemoved" &&
            parcelData.qtrQtr &&
            Object.entries(parcelData.qtrQtr).every(([key, value]) => {
              return ["nwnw", "nenw", "swnw", "senw"].indexOf(key) === -1
                ? true
                : value;
            })
              ? classes.backgrounSecondaryQrt1
              : ""
          }`}
          style={{
            top:
              parcelData.state !== "TX"
                ? "calc(25% - 20px)"
                : "calc(25% - 10px)",
            left:
              parcelData.state !== "TX"
                ? "calc(25% - 24px)"
                : "calc(25% - 14px)",
          }}
          onClick={() => {
            if (parcelData.state !== "TXtemporaryRemoved" && parcelData.qtrQtr)
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
          {parcelData.state !== "TX" && <p> NW</p>}
        </div>

        {/* //// NE //// */}
        <div
          className={`${classes.qrt1} ${
            parcelData.state !== "TXtemporaryRemoved" &&
            parcelData.qtrQtr &&
            Object.entries(parcelData.qtrQtr).every(([key, value]) => {
              return ["nwne", "nene", "swne", "sene"].indexOf(key) === -1
                ? true
                : value;
            })
              ? classes.backgrounSecondaryQrt1
              : ""
          }`}
          style={{
            top:
              parcelData.state !== "TX"
                ? "calc(25% - 20px)"
                : "calc(25% - 10px)",
            right:
              parcelData.state !== "TX" ? "calc(25% - 7px)" : "calc(25% + 2px)",
          }}
          onClick={() => {
            if (parcelData.state !== "TXtemporaryRemoved" && parcelData.qtrQtr)
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
          {parcelData.state !== "TX" && <p> NE</p>}
        </div>

        {/* //// SW //// */}
        <div
          className={`${classes.qrt1} ${
            parcelData.state !== "TXtemporaryRemoved" &&
            parcelData.qtrQtr &&
            Object.entries(parcelData.qtrQtr).every(([key, value]) => {
              return ["nwsw", "nesw", "swsw", "sesw"].indexOf(key) === -1
                ? true
                : value;
            })
              ? classes.backgrounSecondaryQrt1
              : ""
          }`}
          style={{
            bottom:
              parcelData.state !== "TX"
                ? "calc(25% - 20px)"
                : "calc(25% - 10px)",
            left:
              parcelData.state !== "TX"
                ? "calc(25% - 24px)"
                : "calc(25% - 14px)",
          }}
          onClick={() => {
            if (parcelData.state !== "TXtemporaryRemoved" && parcelData.qtrQtr)
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
          {parcelData.state !== "TX" && <p> SW</p>}
        </div>

        {/* //// SE //// */}
        <div
          className={`${classes.qrt1} ${
            parcelData.state !== "TXtemporaryRemoved" &&
            parcelData.qtrQtr &&
            Object.entries(parcelData.qtrQtr).every(([key, value]) => {
              return ["nwse", "nese", "swse", "sese"].indexOf(key) === -1
                ? true
                : value;
            })
              ? classes.backgrounSecondaryQrt1
              : ""
          }`}
          style={{
            bottom:
              parcelData.state !== "TX"
                ? "calc(25% - 20px)"
                : "calc(25% - 10px)",
            right:
              parcelData.state !== "TX" ? "calc(25% - 7px)" : "calc(25% + 2px)",
          }}
          onClick={() => {
            if (parcelData.state !== "TXtemporaryRemoved" && parcelData.qtrQtr)
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
          {parcelData.state !== "TX" && <p> SE</p>}
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
                parcelData.state !== "TXtemporaryRemoved" &&
                parcelData.qtrQtr &&
                parcelData.qtrQtr.nwnw
                  ? classes.backgrounSecondaryQrt2
                  : ""
              }`}
              onClick={() => {
                if (
                  parcelData.state !== "TXtemporaryRemoved" &&
                  parcelData.qtrQtr
                )
                  setQtrQtr({
                    ...parcelData.qtrQtr,
                    nwnw: parcelData.qtrQtr.nwnw ? false : true,
                  });
              }}
            >
              {parcelData.state !== "TX" ? <p> NWNW</p> : <SmallTXQtr />}
            </Grid>
            <Grid
              item
              sm={6}
              className={`${classes.qrt2} ${classes.bb1} ${
                parcelData.state !== "TXtemporaryRemoved" &&
                parcelData.qtrQtr &&
                parcelData.qtrQtr.nenw
                  ? classes.backgrounSecondaryQrt2
                  : ""
              }`}
              onClick={() => {
                if (
                  parcelData.state !== "TXtemporaryRemoved" &&
                  parcelData.qtrQtr
                )
                  setQtrQtr({
                    ...parcelData.qtrQtr,
                    nenw: parcelData.qtrQtr.nenw ? false : true,
                  });
              }}
            >
              {parcelData.state !== "TX" ? <p> NENW</p> : <SmallTXQtr />}
            </Grid>
            <Grid
              item
              sm={6}
              className={`${classes.qrt2} ${classes.br1} ${
                parcelData.state !== "TXtemporaryRemoved" &&
                parcelData.qtrQtr &&
                parcelData.qtrQtr.swnw
                  ? classes.backgrounSecondaryQrt2
                  : ""
              }`}
              onClick={() => {
                if (
                  parcelData.state !== "TXtemporaryRemoved" &&
                  parcelData.qtrQtr
                )
                  setQtrQtr({
                    ...parcelData.qtrQtr,
                    swnw: parcelData.qtrQtr.swnw ? false : true,
                  });
              }}
            >
              {parcelData.state !== "TX" ? <p> SWNW</p> : <SmallTXQtr />}
            </Grid>
            <Grid
              item
              sm={6}
              className={`${classes.qrt2} ${
                parcelData.state !== "TXtemporaryRemoved" &&
                parcelData.qtrQtr &&
                parcelData.qtrQtr.senw
                  ? classes.backgrounSecondaryQrt2
                  : ""
              }`}
              onClick={() => {
                if (
                  parcelData.state !== "TXtemporaryRemoved" &&
                  parcelData.qtrQtr
                )
                  setQtrQtr({
                    ...parcelData.qtrQtr,
                    senw: parcelData.qtrQtr.senw ? false : true,
                  });
              }}
            >
              {parcelData.state !== "TX" ? <p> SENW</p> : <SmallTXQtr />}
            </Grid>
          </Grid>

          {/* //// NE Snd qtrs ////*/}
          <Grid
            item
            container
            sm={6}
            className={`${classes.qrt} ${classes.bb2}`}
          >
            <Grid
              item
              sm={6}
              className={`${classes.qrt2} ${classes.bb1} ${classes.br1} ${
                parcelData.state !== "TXtemporaryRemoved" &&
                parcelData.qtrQtr &&
                parcelData.qtrQtr.nwne
                  ? classes.backgrounSecondaryQrt2
                  : ""
              }`}
              onClick={() => {
                if (
                  parcelData.state !== "TXtemporaryRemoved" &&
                  parcelData.qtrQtr
                )
                  setQtrQtr({
                    ...parcelData.qtrQtr,
                    nwne: parcelData.qtrQtr.nwne ? false : true,
                  });
              }}
            >
              {parcelData.state !== "TX" ? <p> NWNE</p> : <SmallTXQtr />}
            </Grid>
            <Grid
              item
              sm={6}
              className={`${classes.qrt2} ${classes.bb1} ${
                parcelData.state !== "TXtemporaryRemoved" &&
                parcelData.qtrQtr &&
                parcelData.qtrQtr.nene
                  ? classes.backgrounSecondaryQrt2
                  : ""
              }`}
              onClick={() => {
                if (
                  parcelData.state !== "TXtemporaryRemoved" &&
                  parcelData.qtrQtr
                )
                  setQtrQtr({
                    ...parcelData.qtrQtr,
                    nene: parcelData.qtrQtr.nene ? false : true,
                  });
              }}
            >
              {parcelData.state !== "TX" ? <p> NENE</p> : <SmallTXQtr />}
            </Grid>
            <Grid
              item
              sm={6}
              className={`${classes.qrt2} ${classes.br1} ${
                parcelData.state !== "TXtemporaryRemoved" &&
                parcelData.qtrQtr &&
                parcelData.qtrQtr.swne
                  ? classes.backgrounSecondaryQrt2
                  : ""
              }`}
              onClick={() => {
                if (
                  parcelData.state !== "TXtemporaryRemoved" &&
                  parcelData.qtrQtr
                )
                  setQtrQtr({
                    ...parcelData.qtrQtr,
                    swne: parcelData.qtrQtr.swne ? false : true,
                  });
              }}
            >
              {parcelData.state !== "TX" ? <p> SWNE</p> : <SmallTXQtr />}
            </Grid>
            <Grid
              item
              sm={6}
              className={`${classes.qrt2} ${
                parcelData.state !== "TXtemporaryRemoved" &&
                parcelData.qtrQtr &&
                parcelData.qtrQtr.sene
                  ? classes.backgrounSecondaryQrt2
                  : ""
              }`}
              onClick={() => {
                if (
                  parcelData.state !== "TXtemporaryRemoved" &&
                  parcelData.qtrQtr
                )
                  setQtrQtr({
                    ...parcelData.qtrQtr,
                    sene: parcelData.qtrQtr.sene ? false : true,
                  });
              }}
            >
              {parcelData.state !== "TX" ? <p> SENE</p> : <SmallTXQtr />}
            </Grid>
          </Grid>

          {/* //// SW Snd qtrs ////*/}
          <Grid
            item
            container
            sm={6}
            className={`${classes.qrt} ${classes.br2}`}
          >
            <Grid
              item
              sm={6}
              className={`${classes.qrt2} ${classes.bb1} ${classes.br1} ${
                parcelData.state !== "TXtemporaryRemoved" &&
                parcelData.qtrQtr &&
                parcelData.qtrQtr.nwsw
                  ? classes.backgrounSecondaryQrt2
                  : ""
              }`}
              onClick={() => {
                if (
                  parcelData.state !== "TXtemporaryRemoved" &&
                  parcelData.qtrQtr
                )
                  setQtrQtr({
                    ...parcelData.qtrQtr,
                    nwsw: parcelData.qtrQtr.nwsw ? false : true,
                  });
              }}
            >
              {parcelData.state !== "TX" ? <p> NWSW</p> : <SmallTXQtr />}
            </Grid>
            <Grid
              item
              sm={6}
              className={`${classes.qrt2} ${classes.bb1} ${
                parcelData.state !== "TXtemporaryRemoved" &&
                parcelData.qtrQtr &&
                parcelData.qtrQtr.nesw
                  ? classes.backgrounSecondaryQrt2
                  : ""
              }`}
              onClick={() => {
                if (
                  parcelData.state !== "TXtemporaryRemoved" &&
                  parcelData.qtrQtr
                )
                  setQtrQtr({
                    ...parcelData.qtrQtr,
                    nesw: parcelData.qtrQtr.nesw ? false : true,
                  });
              }}
            >
              {parcelData.state !== "TX" ? <p> NESW</p> : <SmallTXQtr />}
            </Grid>
            <Grid
              item
              sm={6}
              className={`${classes.qrt2} ${classes.br1} ${
                parcelData.state !== "TXtemporaryRemoved" &&
                parcelData.qtrQtr &&
                parcelData.qtrQtr.swsw
                  ? classes.backgrounSecondaryQrt2
                  : ""
              }`}
              onClick={() => {
                if (
                  parcelData.state !== "TXtemporaryRemoved" &&
                  parcelData.qtrQtr
                )
                  setQtrQtr({
                    ...parcelData.qtrQtr,
                    swsw: parcelData.qtrQtr.swsw ? false : true,
                  });
              }}
            >
              {parcelData.state !== "TX" ? <p> SWSW</p> : <SmallTXQtr />}
            </Grid>
            <Grid
              item
              sm={6}
              className={`${classes.qrt2} ${
                parcelData.state !== "TXtemporaryRemoved" &&
                parcelData.qtrQtr &&
                parcelData.qtrQtr.sesw
                  ? classes.backgrounSecondaryQrt2
                  : ""
              }`}
              onClick={() => {
                if (
                  parcelData.state !== "TXtemporaryRemoved" &&
                  parcelData.qtrQtr
                )
                  setQtrQtr({
                    ...parcelData.qtrQtr,
                    sesw: parcelData.qtrQtr.sesw ? false : true,
                  });
              }}
            >
              {parcelData.state !== "TX" ? <p> SESW</p> : <SmallTXQtr />}
            </Grid>
          </Grid>

          {/* //// SE Snd qtrs ////*/}
          <Grid item container sm={6} className={classes.qrt}>
            <Grid
              item
              sm={6}
              className={`${classes.qrt2} ${classes.bb1} ${classes.br1} ${
                parcelData.state !== "TXtemporaryRemoved" &&
                parcelData.qtrQtr &&
                parcelData.qtrQtr.nwse
                  ? classes.backgrounSecondaryQrt2
                  : ""
              }`}
              onClick={() => {
                if (
                  parcelData.state !== "TXtemporaryRemoved" &&
                  parcelData.qtrQtr
                )
                  setQtrQtr({
                    ...parcelData.qtrQtr,
                    nwse: parcelData.qtrQtr.nwse ? false : true,
                  });
              }}
            >
              {parcelData.state !== "TX" ? <p> NWSE</p> : <SmallTXQtr />}
            </Grid>
            <Grid
              item
              sm={6}
              className={`${classes.qrt2} ${classes.bb1} ${
                parcelData.state !== "TXtemporaryRemoved" &&
                parcelData.qtrQtr &&
                parcelData.qtrQtr.nese
                  ? classes.backgrounSecondaryQrt2
                  : ""
              }`}
              onClick={() => {
                if (
                  parcelData.state !== "TXtemporaryRemoved" &&
                  parcelData.qtrQtr
                )
                  setQtrQtr({
                    ...parcelData.qtrQtr,
                    nese: parcelData.qtrQtr.nese ? false : true,
                  });
              }}
            >
              {parcelData.state !== "TX" ? <p> NESE</p> : <SmallTXQtr />}
            </Grid>
            <Grid
              item
              sm={6}
              className={`${classes.qrt2} ${classes.br1} ${
                parcelData.state !== "TXtemporaryRemoved" &&
                parcelData.qtrQtr &&
                parcelData.qtrQtr.swse
                  ? classes.backgrounSecondaryQrt2
                  : ""
              }`}
              onClick={() => {
                if (
                  parcelData.state !== "TXtemporaryRemoved" &&
                  parcelData.qtrQtr
                )
                  setQtrQtr({
                    ...parcelData.qtrQtr,
                    swse: parcelData.qtrQtr.swse ? false : true,
                  });
              }}
            >
              {parcelData.state !== "TX" ? <p> SWSE</p> : <SmallTXQtr />}
            </Grid>
            <Grid
              item
              sm={6}
              className={`${classes.qrt2} ${
                parcelData.state !== "TXtemporaryRemoved" &&
                parcelData.qtrQtr &&
                parcelData.qtrQtr.sese
                  ? classes.backgrounSecondaryQrt2
                  : ""
              }`}
              onClick={() => {
                if (
                  parcelData.state !== "TXtemporaryRemoved" &&
                  parcelData.qtrQtr
                )
                  setQtrQtr({
                    ...parcelData.qtrQtr,
                    sese: parcelData.qtrQtr.sese ? false : true,
                  });
              }}
            >
              {parcelData.state !== "TX" ? <p> SESE</p> : <SmallTXQtr />}
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
