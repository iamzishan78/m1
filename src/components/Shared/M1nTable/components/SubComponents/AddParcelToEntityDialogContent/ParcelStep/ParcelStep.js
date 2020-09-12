import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../../../../../../AppContext";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import QtrQtrSelector from "./components/QtrQtrSelector";
import LeftTopSummary from "./components/LeftTopSummary";
// import { useLazyQuery } from "@apollo/client";

const useStyles = makeStyles((theme) => ({
  gridWidthScroll: {
    backgroundColor: "#efefef",
    "& .formLabel": {
      color: "#757575",
      fontWeight: "bold",
      width: "100%",
      marginBottom: "0",
    },
  },
  dataSect: {
    height: "100%",
    borderTop: "2px solid #C9C9C9",
    color: "#757575",
    width: "100%",
    "& .MuiGrid-item": { display: "flex", padding: "8px" },
    "& p": {
      wordWrap: "break-word",
      margin: "auto 0",
    },
    "& .dataLabels": {
      fontWeight: "bold",
    },
    "& > .MuiGrid-item": {
      borderBottom: "2px solid #C9C9C9",
      borderRight: "2px solid #C9C9C9",
    },
    "& .fieldName": {
      borderLeft: "2px solid #C9C9C9",
      backgroundColor: "#EBEBEB",
    },
  },
  borderRight: {
    // borderRight: "1px solid #eaeaea",
    backgroundColor: "#fff",
    paddingRight: "15px",
  },
  qtrAndInputs: { "& input": { fontSize: "0.875rem" } },
}));

export default function ParcelStep(props) {
  const [stateApp] = useContext(AppContext);
  const classes = useStyles();
  const [parcelData, setParcelData] = useState({
    name: "test",
    county: "Lea",
    state: "TX",
    Grid1: "00",
    Grid2: "026S",
    Grid3: "033E",
    Grid4: "027",
    Grid5: "123",
    qtrQtr: {
      nwnw: true,
      nenw: true,
      swnw: true,
      senw: true,
      nwne: true,
      nene: true,
      swne: true,
      sene: true,
      nwsw: false,
      nesw: false,
      swsw: false,
      sesw: false,
      nwse: false,
      nese: false,
      swse: false,
      sese: false,
    },
    grossAcres: 640,
    calcAcres: 640.3,
    legalDescription: "",
  });

  // useEffect(() => {
  //   if (props.id) {
  //     getCustomLayer({
  //       variables: {
  //         id: props.id,
  //       },
  //     });
  //   }
  // }, [props.id]);

  // useEffect(() => {
  //   if (dataCustomLayer && dataCustomLayer.customLayer) {
  //     setParcelData(dataCustomLayer.customLayer);
  //   }
  // }, [dataCustomLayer]);

  const setQtrQtr = (qtrQtr) => {
    setParcelData((parcelData) => ({ ...parcelData, qtrQtr }));
  };

  return parcelData ? (
    <Grid container className={classes.gridWidthScroll} spacing={0}>
      <Grid item container sm={12}>
        <Grid item sm={5} className={classes.borderRight}>
          <LeftTopSummary parcelData={parcelData} />
        </Grid>

        <Grid
          item
          sm={7}
          className={`${classes.borderRight} ${classes.qtrAndInputs}`}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} style={{ display: "flex" }}>
              <QtrQtrSelector parcelData={parcelData} setQtrQtr={setQtrQtr} />
              <div style={{ width: "Calc( 100% - 273px)" }}>
                <p className="formLabel" style={{ marginTop: "0" }}>
                  Parcel Name
                </p>
                <TextField
                  size="small"
                  value={parcelData.name}
                  variant="outlined"
                  fullWidth
                />
                <p className="formLabel">Gross Acres</p>
                <TextField
                  size="small"
                  value={parcelData.grossAcres}
                  variant="outlined"
                  fullWidth
                />
                <p className="formLabel">Calc. Acres</p>
                <TextField
                  disabled
                  size="small"
                  value={parcelData.calcAcres}
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />

                <p className="formLabel">Full Legal Description</p>
                <TextField
                  size="small"
                  multiline
                  rows={8}
                  value={parcelData.legalDescription}
                  variant="outlined"
                  fullWidth
                  placeholder="Enter legal description here"
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  ) : (
    <div
      style={{
        padding: "20px",
        position: "absolute",
        height: "100%",
        width: "100%",
        zIndex: "50",
      }}
    >
      <CircularProgress size={80} disableShrink color="secondary" />
    </div>
  );
}
