import React, { useContext, useState } from "react";
import { AppContext } from "../../AppContext";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Taps from "../Shared/Taps";
import M1nTable from "../Shared/M1nTable/M1nTable";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import QtrQtrSelector from "./components/QtrQtrSelector";

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
    borderRight: "1px solid #eaeaea",
    backgroundColor: "#fff",
    padding: "15px",
  },
  qtrAndInputs: { "& input": { fontSize: "0.875rem" } },
}));

export default function ParcelsDetailCard(props) {
  const [stateApp] = useContext(AppContext);
  const classes = useStyles();
  const [parcelData, setParcelData] = useState({
    _id: "5f2d60a70b0a02002146edfc",
    county: "Lea",
    state: "NM",
    meridian: null,
    township: "026S",
    range: "033E",
    section: "027",
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
    leaseStatus: "Active",
    leaseRoyalty: "12.5%",
    legalDescription: "",
    owners: [],
  });

  const setQtrQtr = (qtrQtr) => {
    setParcelData((parcelData) => ({ ...parcelData, qtrQtr }));
  };

  // return stateApp.selectedOwner ?
  return (
    <Grid container className={classes.gridWidthScroll} spacing={0}>
      <Grid item container sm={12}>
        <Grid item sm={2} className={classes.borderRight}>
          <Grid container className={classes.dataSect}>
            <Grid item xs={6} className="fieldName">
              <p className="dataLabels">County</p>
            </Grid>
            <Grid item xs={6}>
              <p>{parcelData.county}</p>
            </Grid>

            <Grid item xs={6} className="fieldName">
              <p className="dataLabels">State</p>
            </Grid>
            <Grid item xs={6}>
              <p>{parcelData.state}</p>
            </Grid>

            <Grid item xs={6} className="fieldName">
              <p className="dataLabels">Meridian</p>
            </Grid>
            <Grid item xs={6}>
              <p>{parcelData.meridian}</p>
            </Grid>

            <Grid item xs={6} className="fieldName">
              <p className="dataLabels">Township</p>
            </Grid>
            <Grid item xs={6}>
              <p>{parcelData.township}</p>
            </Grid>

            <Grid item xs={6} className="fieldName">
              <p className="dataLabels">Range</p>
            </Grid>
            <Grid item xs={6}>
              <p>{parcelData.range}</p>
            </Grid>

            <Grid item xs={6} className="fieldName">
              <p className="dataLabels">Section</p>
            </Grid>
            <Grid item xs={6}>
              <p>{parcelData.section}</p>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          item
          sm={6}
          className={`${classes.borderRight} ${classes.qtrAndInputs}`}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} style={{ display: "flex" }}>
              <QtrQtrSelector parcelData={parcelData} setQtrQtr={setQtrQtr} />
              <div style={{ width: "Calc( 100% - 273px)" }}>
                <p className="formLabel" style={{ marginTop: "0" }}>
                  Gross Acres
                </p>
                <TextField
                  size="small"
                  value={parcelData.grossAcres}
                  variant="outlined"
                  fullWidth
                />
                <p className="formLabel">Calc. Acres</p>
                <TextField
                  size="small"
                  value={parcelData.calcAcres}
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <p className="formLabel">Lease Status</p>

                <Autocomplete
                  value={parcelData.leaseStatus}
                  options={["Active", "Unleased", "Expired"]}
                  defaultValue="Unleased"
                  getOptionLabel={(option) => option}
                  onChange={(event, newValue) => {
                    setParcelData({ ...parcelData, leaseStatus: newValue });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      size="small"
                      variant="outlined"
                    />
                  )}
                />

                <p className="formLabel">Lease Royalty</p>
                <TextField
                  size="small"
                  value={parcelData.leaseRoyalty}
                  variant="outlined"
                  fullWidth
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <p className="formLabel" style={{ marginTop: "0" }}>
                Full Legal Description
              </p>
              <TextField
                size="small"
                multiline
                rows={4}
                value={parcelData.legalDescription}
                variant="outlined"
                fullWidth
                placeholder="Enter legal description here"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={4} style={{ backgroundColor: "#757575" }}>
          <p>Map</p>
        </Grid>
      </Grid>

      <Grid item sm={12}>
        <Taps
          tabLabels={["Owners", "Wells"]}
          tabPanels={[
            <M1nTable
              parent="ownersPerParcel"
              customLayerId={parcelData._id}
              dense
            />,
            "Wells Table",
          ]}
        />
      </Grid>
    </Grid>
    // ) : (
    //   <CircularProgress color="secondary" />
  );
}
