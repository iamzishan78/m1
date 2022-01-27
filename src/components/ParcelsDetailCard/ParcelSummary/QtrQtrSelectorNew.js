import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Box } from "@material-ui/core";
import { getQtrFilterData } from "./helper";
import { copy } from 'utils/helper';
import SmallTXQtr from "components/Shared/M1nTable/components/SubComponents/AddParcelToEntityDialogContent/ParcelStep/components/SmallTXQtr";
import { getNewShapeFromSelectedQuarters } from "components/MapControls/components/DrawShapes/drawShapesHelpers";

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
    // width: "387px",
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
        parcelData.state !== "TX" ? "#BFEBFB !important" : "",
    },
  },
  qrt1: {
    position: "absolute",
    border: ({ parcelData }) =>
      `2px solid ${parcelData.state !== "TXtemporaryRemoved"
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

const qtrOptions = ["", "E2", "NE", "NW", "N2", "SE", "SW", "S2", "W2"];

export default function QtrQtrSelectorNew({ parcelData, updateParcelQtr }) {
  // removing state so that taxas also have same style as non taxas
  parcelData.state = ''

  const classes = useStyles({ parcelData });
  const [qtr, setQtr] = useState(parcelData?.qtrQtrSelection?.selectedQtr ? copy(parcelData.qtrQtrSelection.selectedQtr) : ["", "", "", ""])

  const [qtrQtr, setQtrQtr] = useState(parcelData?.qtrQtrSelection?.qtrQtr ? copy(parcelData.qtrQtrSelection.qtrQtr) : {})
  const [disableUpdate, setDisableUpdate] = useState(false)

  useEffect(() => {
    if (parcelData?.qtrQtrSelection) {
      setQtr(copy(parcelData.qtrQtrSelection.selectedQtr))
      setQtrQtr(copy(parcelData.qtrQtrSelection.qtrQtr))
    }

  }, [parcelData?.qtrQtrSelection])


  useEffect(() => {
    if (!parcelData?.qtrQtrSelection?.qtrQtr) {
      const values = getQtrFilterData(qtr)
      if (values) {
        Object.keys(qtrQtr).forEach((key) => {
          qtrQtr[key] = false
        })
        values.forEach((value) => {
          qtrQtr[value.toLowerCase()] = true
        })
        setQtrQtr(qtrQtr)
      }
    }
  }, [])

  useEffect(() => {
    checkForDisabled()
  }, [qtr, qtrQtr])

  const checkForDisabled = () => {
    let isDisabled = true

    if (!parcelData?.qtrQtrSelection?.qtrQtr && !Object.keys(qtrQtr).find((key) => qtrQtr[key] !== true)) {
      setDisableUpdate(true)
      return
    }

    if (!parcelData?.qtrQtrSelection?.qtrQtr && Object.keys(qtrQtr).find((key) => qtrQtr[key] !== true)) {
      setDisableUpdate(false)
      return
    }
    Object.keys(qtrQtr).forEach((key) => {
      if (parcelData?.qtrQtrSelection?.qtrQtr[key] !== qtrQtr[key]) {
        isDisabled = false
      }
    })

    // if (!parcelData?.qtrQtrSelection?.selectedQtr && !qtr.find((q) => q !== '')) {
    //   setDisableUpdate(true)
    //   return
    // }
    // if (!parcelData?.qtrQtrSelection?.selectedQtr && qtr.find((q) => q !== '')) {
    //   setDisableUpdate(false)
    //   return
    // }
    // qtr.forEach((q, index) => {
    //   if (parcelData?.qtrQtrSelection?.selectedQtr[index] !== q) {
    //     isDisabled = false
    //   }
    // })
    setDisableUpdate(isDisabled)
  }

  return (
    <div>
      <p className="formLabel" style={{ marginTop: "0" }}>
        Adjust the shape boundary by entering quarter calls or selecting values in the grid below
      </p>
      <Grid container spacing={1} direction="row">
        <Grid item md={9}>
          <Grid container spacing={1} direction="row">
            {
              [1, 2, 3, 4].map((val) =>
                <Grid item xs={3} key={val}>
                  <Box>QTR {val}</Box>
                  <Autocomplete
                    options={qtrOptions}
                    getOptionLabel={(option) => option === "" ? '-' : option}
                    value={qtr[val - 1]}
                    disableClearable
                    onChange={(e, newInputValue) => {
                      qtr[val - 1] = newInputValue ? newInputValue : "";

                      const values = getQtrFilterData(qtr)
                      if (values) {
                        Object.keys(qtrQtr).forEach((key) => {
                          qtrQtr[key] = false
                        })
                        values.forEach((value) => {
                          qtrQtr[value.toLowerCase()] = true
                        })
                        setQtrQtr(qtrQtr)
                      }
                      setQtr([...qtr])
                    }}
                    renderInput={(params) => <TextField {...params} variant="outlined" size="small" className={classes.maxWidth} />}
                  />
                </Grid>)
            }
          </Grid>
        </Grid>
        <Grid item md={3} style={{ paddingTop: '1.8em' }}>
          <Button variant="contained" color="primary" disabled={disableUpdate} onClick={() => {
            const values = Object.keys(qtrQtr).filter((key) => qtrQtr[key]).map((key) => key.toUpperCase())
            const feature = copy(parcelData.shape)
            let parcelDataCopy = copy(parcelData)
            if (parcelDataCopy?.qtrQtrSelection?.originalGeometry) {
              feature.geometry = parcelDataCopy.qtrQtrSelection.originalGeometry
            }
            const newShape = getNewShapeFromSelectedQuarters(feature, values)
            if (!parcelDataCopy.qtrQtrSelection) parcelDataCopy.qtrQtrSelection = {}
            if (!parcelDataCopy?.qtrQtrSelection?.originalGeometry) {
              parcelDataCopy.qtrQtrSelection.originalGeometry = parcelDataCopy.shape.geometry
            }
            parcelDataCopy.qtrQtrSelection.qtrQtr = qtrQtr
            parcelDataCopy.qtrQtrSelection.selectedQtr = qtr
            parcelDataCopy.shape.geometry = newShape.geometry
            updateParcelQtr(parcelDataCopy)
          }}>Update</Button>
        </Grid>

      </Grid>
      <div className={classes.mainDiv}>
        {/* //// all //// */}
        <div
          className={`${classes.qrt1} ${parcelData.state !== "TXtemporaryRemoved" &&
            qtrQtr &&
            Object.entries(qtrQtr).every(([key, value]) => {
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
                ? "calc(50% - 20px)"
                : "calc(50% - 19px)",
          }}
          onClick={() => {
            if (
              parcelData.state !== "TXtemporaryRemovedtemporaryRemoved" &&
              qtrQtr
            )
              if (
                Object.entries(qtrQtr).every(([key, value]) => {
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
          className={`${classes.qrt1} ${parcelData.state !== "TXtemporaryRemoved" &&
            qtrQtr &&
            Object.entries(qtrQtr).every(([key, value]) => {
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
            if (parcelData.state !== "TXtemporaryRemoved" && qtrQtr)
              if (
                Object.entries(qtrQtr).every(([key, value]) => {
                  return ["nwnw", "nenw", "swnw", "senw"].indexOf(key) === -1
                    ? true
                    : value;
                })
              ) {
                setQtrQtr({
                  ...qtrQtr,
                  nwnw: false,
                  nenw: false,
                  swnw: false,
                  senw: false,
                });
              } else {
                setQtrQtr({
                  ...qtrQtr,
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
          className={`${classes.qrt1} ${parcelData.state !== "TXtemporaryRemoved" &&
            qtrQtr &&
            Object.entries(qtrQtr).every(([key, value]) => {
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
              parcelData.state !== "TX" ? "calc(24% - 10px)" : "calc(25% + 2px)",
          }}
          onClick={() => {
            if (parcelData.state !== "TXtemporaryRemoved" && qtrQtr)
              if (
                Object.entries(qtrQtr).every(([key, value]) => {
                  return ["nwne", "nene", "swne", "sene"].indexOf(key) === -1
                    ? true
                    : value;
                })
              ) {
                setQtrQtr({
                  ...qtrQtr,
                  nwne: false,
                  nene: false,
                  swne: false,
                  sene: false,
                });
              } else {
                setQtrQtr({
                  ...qtrQtr,
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
          className={`${classes.qrt1} ${parcelData.state !== "TXtemporaryRemoved" &&
            qtrQtr &&
            Object.entries(qtrQtr).every(([key, value]) => {
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
            if (parcelData.state !== "TXtemporaryRemoved" && qtrQtr)
              if (
                Object.entries(qtrQtr).every(([key, value]) => {
                  return ["nwsw", "nesw", "swsw", "sesw"].indexOf(key) === -1
                    ? true
                    : value;
                })
              ) {
                setQtrQtr({
                  ...qtrQtr,
                  nwsw: false,
                  nesw: false,
                  swsw: false,
                  sesw: false,
                });
              } else {
                setQtrQtr({
                  ...qtrQtr,
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
          className={`${classes.qrt1} ${parcelData.state !== "TXtemporaryRemoved" &&
            qtrQtr &&
            Object.entries(qtrQtr).every(([key, value]) => {
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
              parcelData.state !== "TX" ? "calc(24% - 10px)" : "calc(25% + 2px)",
          }}
          onClick={() => {
            if (parcelData.state !== "TXtemporaryRemoved" && qtrQtr)
              if (
                Object.entries(qtrQtr).every(([key, value]) => {
                  return ["nwse", "nese", "swse", "sese"].indexOf(key) === -1
                    ? true
                    : value;
                })
              ) {
                setQtrQtr({
                  ...qtrQtr,
                  nwse: false,
                  nese: false,
                  swse: false,
                  sese: false,
                });
              } else {
                setQtrQtr({
                  ...qtrQtr,
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
              className={`${classes.qrt2} ${classes.bb1} ${classes.br1} ${parcelData.state !== "TXtemporaryRemoved" &&
                qtrQtr &&
                qtrQtr.nwnw
                ? classes.backgrounSecondaryQrt2
                : ""
                }`}
              onClick={() => {
                if (
                  parcelData.state !== "TXtemporaryRemoved" &&
                  qtrQtr
                )
                  setQtrQtr({
                    ...qtrQtr,
                    nwnw: qtrQtr.nwnw ? false : true,
                  });
              }}
            >
              {parcelData.state !== "TX" ? <p> NWNW</p> : <SmallTXQtr />}
            </Grid>
            <Grid
              item
              sm={6}
              className={`${classes.qrt2} ${classes.bb1} ${parcelData.state !== "TXtemporaryRemoved" &&
                qtrQtr &&
                qtrQtr.nenw
                ? classes.backgrounSecondaryQrt2
                : ""
                }`}
              onClick={() => {
                if (
                  parcelData.state !== "TXtemporaryRemoved" &&
                  qtrQtr
                )
                  setQtrQtr({
                    ...qtrQtr,
                    nenw: qtrQtr.nenw ? false : true,
                  });
              }}
            >
              {parcelData.state !== "TX" ? <p> NENW</p> : <SmallTXQtr />}
            </Grid>
            <Grid
              item
              sm={6}
              className={`${classes.qrt2} ${classes.br1} ${parcelData.state !== "TXtemporaryRemoved" &&
                qtrQtr &&
                qtrQtr.swnw
                ? classes.backgrounSecondaryQrt2
                : ""
                }`}
              onClick={() => {
                if (
                  parcelData.state !== "TXtemporaryRemoved" &&
                  qtrQtr
                )
                  setQtrQtr({
                    ...qtrQtr,
                    swnw: qtrQtr.swnw ? false : true,
                  });
              }}
            >
              {parcelData.state !== "TX" ? <p> SWNW</p> : <SmallTXQtr />}
            </Grid>
            <Grid
              item
              sm={6}
              className={`${classes.qrt2} ${parcelData.state !== "TXtemporaryRemoved" &&
                qtrQtr &&
                qtrQtr.senw
                ? classes.backgrounSecondaryQrt2
                : ""
                }`}
              onClick={() => {
                if (
                  parcelData.state !== "TXtemporaryRemoved" &&
                  qtrQtr
                )
                  setQtrQtr({
                    ...qtrQtr,
                    senw: qtrQtr.senw ? false : true,
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
              className={`${classes.qrt2} ${classes.bb1} ${classes.br1} ${parcelData.state !== "TXtemporaryRemoved" &&
                qtrQtr &&
                qtrQtr.nwne
                ? classes.backgrounSecondaryQrt2
                : ""
                }`}
              onClick={() => {
                if (
                  parcelData.state !== "TXtemporaryRemoved" &&
                  qtrQtr
                )
                  setQtrQtr({
                    ...qtrQtr,
                    nwne: qtrQtr.nwne ? false : true,
                  });
              }}
            >
              {parcelData.state !== "TX" ? <p> NWNE</p> : <SmallTXQtr />}
            </Grid>
            <Grid
              item
              sm={6}
              className={`${classes.qrt2} ${classes.bb1} ${parcelData.state !== "TXtemporaryRemoved" &&
                qtrQtr &&
                qtrQtr.nene
                ? classes.backgrounSecondaryQrt2
                : ""
                }`}
              onClick={() => {
                if (
                  parcelData.state !== "TXtemporaryRemoved" &&
                  qtrQtr
                )
                  setQtrQtr({
                    ...qtrQtr,
                    nene: qtrQtr.nene ? false : true,
                  });
              }}
            >
              {parcelData.state !== "TX" ? <p> NENE</p> : <SmallTXQtr />}
            </Grid>
            <Grid
              item
              sm={6}
              className={`${classes.qrt2} ${classes.br1} ${parcelData.state !== "TXtemporaryRemoved" &&
                qtrQtr &&
                qtrQtr.swne
                ? classes.backgrounSecondaryQrt2
                : ""
                }`}
              onClick={() => {
                if (
                  parcelData.state !== "TXtemporaryRemoved" &&
                  qtrQtr
                )
                  setQtrQtr({
                    ...qtrQtr,
                    swne: qtrQtr.swne ? false : true,
                  });
              }}
            >
              {parcelData.state !== "TX" ? <p> SWNE</p> : <SmallTXQtr />}
            </Grid>
            <Grid
              item
              sm={6}
              className={`${classes.qrt2} ${parcelData.state !== "TXtemporaryRemoved" &&
                qtrQtr &&
                qtrQtr.sene
                ? classes.backgrounSecondaryQrt2
                : ""
                }`}
              onClick={() => {
                if (
                  parcelData.state !== "TXtemporaryRemoved" &&
                  qtrQtr
                )
                  setQtrQtr({
                    ...qtrQtr,
                    sene: qtrQtr.sene ? false : true,
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
              className={`${classes.qrt2} ${classes.bb1} ${classes.br1} ${parcelData.state !== "TXtemporaryRemoved" &&
                qtrQtr &&
                qtrQtr.nwsw
                ? classes.backgrounSecondaryQrt2
                : ""
                }`}
              onClick={() => {
                if (
                  parcelData.state !== "TXtemporaryRemoved" &&
                  qtrQtr
                )
                  setQtrQtr({
                    ...qtrQtr,
                    nwsw: qtrQtr.nwsw ? false : true,
                  });
              }}
            >
              {parcelData.state !== "TX" ? <p> NWSW</p> : <SmallTXQtr />}
            </Grid>
            <Grid
              item
              sm={6}
              className={`${classes.qrt2} ${classes.bb1} ${parcelData.state !== "TXtemporaryRemoved" &&
                qtrQtr &&
                qtrQtr.nesw
                ? classes.backgrounSecondaryQrt2
                : ""
                }`}
              onClick={() => {
                if (
                  parcelData.state !== "TXtemporaryRemoved" &&
                  qtrQtr
                )
                  setQtrQtr({
                    ...qtrQtr,
                    nesw: qtrQtr.nesw ? false : true,
                  });
              }}
            >
              {parcelData.state !== "TX" ? <p> NESW</p> : <SmallTXQtr />}
            </Grid>
            <Grid
              item
              sm={6}
              className={`${classes.qrt2} ${classes.br1} ${parcelData.state !== "TXtemporaryRemoved" &&
                qtrQtr &&
                qtrQtr.swsw
                ? classes.backgrounSecondaryQrt2
                : ""
                }`}
              onClick={() => {
                if (
                  parcelData.state !== "TXtemporaryRemoved" &&
                  qtrQtr
                )
                  setQtrQtr({
                    ...qtrQtr,
                    swsw: qtrQtr.swsw ? false : true,
                  });
              }}
            >
              {parcelData.state !== "TX" ? <p> SWSW</p> : <SmallTXQtr />}
            </Grid>
            <Grid
              item
              sm={6}
              className={`${classes.qrt2} ${parcelData.state !== "TXtemporaryRemoved" &&
                qtrQtr &&
                qtrQtr.sesw
                ? classes.backgrounSecondaryQrt2
                : ""
                }`}
              onClick={() => {
                if (
                  parcelData.state !== "TXtemporaryRemoved" &&
                  qtrQtr
                )
                  setQtrQtr({
                    ...qtrQtr,
                    sesw: qtrQtr.sesw ? false : true,
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
              className={`${classes.qrt2} ${classes.bb1} ${classes.br1} ${parcelData.state !== "TXtemporaryRemoved" &&
                qtrQtr &&
                qtrQtr.nwse
                ? classes.backgrounSecondaryQrt2
                : ""
                }`}
              onClick={() => {
                if (
                  parcelData.state !== "TXtemporaryRemoved" &&
                  qtrQtr
                )
                  setQtrQtr({
                    ...qtrQtr,
                    nwse: qtrQtr.nwse ? false : true,
                  });
              }}
            >
              {parcelData.state !== "TX" ? <p> NWSE</p> : <SmallTXQtr />}
            </Grid>
            <Grid
              item
              sm={6}
              className={`${classes.qrt2} ${classes.bb1} ${parcelData.state !== "TXtemporaryRemoved" &&
                qtrQtr &&
                qtrQtr.nese
                ? classes.backgrounSecondaryQrt2
                : ""
                }`}
              onClick={() => {
                if (
                  parcelData.state !== "TXtemporaryRemoved" &&
                  qtrQtr
                )
                  setQtrQtr({
                    ...qtrQtr,
                    nese: qtrQtr.nese ? false : true,
                  });
              }}
            >
              {parcelData.state !== "TX" ? <p> NESE</p> : <SmallTXQtr />}
            </Grid>
            <Grid
              item
              sm={6}
              className={`${classes.qrt2} ${classes.br1} ${parcelData.state !== "TXtemporaryRemoved" &&
                qtrQtr &&
                qtrQtr.swse
                ? classes.backgrounSecondaryQrt2
                : ""
                }`}
              onClick={() => {
                if (
                  parcelData.state !== "TXtemporaryRemoved" &&
                  qtrQtr
                )
                  setQtrQtr({
                    ...qtrQtr,
                    swse: qtrQtr.swse ? false : true,
                  });
              }}
            >
              {parcelData.state !== "TX" ? <p> SWSE</p> : <SmallTXQtr />}
            </Grid>
            <Grid
              item
              sm={6}
              className={`${classes.qrt2} ${parcelData.state !== "TXtemporaryRemoved" &&
                qtrQtr &&
                qtrQtr.sese
                ? classes.backgrounSecondaryQrt2
                : ""
                }`}
              onClick={() => {
                if (
                  parcelData.state !== "TXtemporaryRemoved" &&
                  qtrQtr
                )
                  setQtrQtr({
                    ...qtrQtr,
                    sese: qtrQtr.sese ? false : true,
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
