import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import { OWNERSUMMARY } from "../../../graphQL/useQueryOwnerSummary";
import { useLazyQuery } from "@apollo/client";
import Paper from "@material-ui/core/Paper";
import WellIcon from "../../Shared/svgIcons/well";

const useStyles = makeStyles((theme) => ({
  Paper: {
    minHeight: "35px",
    height: "100%",
    padding: "10px 30px",
    "& h2, h3": { color: "rgb(0 0 0 / 61%)" },
  },
  icon: {
    width: "100px",
    height: "100px",
    backgroundColor: "#DFEDFF",
    borderRadius: "100%",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumSignificantDigits: 21,
});
const valueFormatter = (v) => {
  return formatter.format(parseInt(v));
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
const joinAddress = (row) => {
  let rowData = {
    city: row.city,
    state: row.state,
    zip: row.zip,
    country: row.country,
  };
  let textArray = [];
  for (const key in rowData) {
    if (rowData.hasOwnProperty(key) && rowData[key] && rowData[key] !== "") {
      if (key === "zip" || key === "country") {
        textArray = [
          [textArray.join(", "), capitalizeFirstLetter(rowData[key])].join(" "),
        ];
      } else textArray.push(capitalizeFirstLetter(rowData[key]));
    }
  }

  return textArray.join(", ");
};
export default function OwnersSummaryCard(props) {
  const [ownerSummary, setOwnerSummary] = useState();
  const classes = useStyles();

  const [getOwnerSummary, { data }] = useLazyQuery(OWNERSUMMARY);
  useEffect(() => {
    if (props.id)
      getOwnerSummary({
        variables: {
          id: props.id,
        },
      });
  }, [props.id]);

  useEffect(() => {
    if (data && data.ownerSummary) setOwnerSummary(data.ownerSummary);
  }, [data]);

  return ownerSummary ? (
    <Grid container spacing={0}>
      <Grid
        item
        style={{
          padding: "15px",
          minWidth: "350px",
        }}
      >
        <Paper elevation={3} className={classes.Paper}>
          <h2
            style={{
              marginTop: "0",
            }}
          >
            Name & Address
          </h2>
          <h3>
            {ownerSummary.ownerName ? (
              <span>
                {ownerSummary.ownerName} <br />
              </span>
            ) : null}
            {ownerSummary.streetAddress ? (
              <span>
                {ownerSummary.streetAddress} <br />
              </span>
            ) : null}
            {joinAddress(ownerSummary)}
          </h3>
        </Paper>
      </Grid>
      <Grid
        item
        xs
        style={{
          padding: "15px 15px 15px 0",
        }}
      >
        <Paper elevation={3} className={classes.Paper}>
          <h2
            style={{
              marginTop: "0",
              marginBottom: "10px",
            }}
          >
            Well Interests ({numberWithCommas(ownerSummary.interestsCount)})
          </h2>
          <Grid
            container
            spacing={0}
            style={{
              marginBottom: "5px",
            }}
          >
            <Grid item xs style={{ maxWidth: "170px" }}>
              <div className={classes.icon}>
                <WellIcon color="rgb(102 146 202)" opacity="1" size="45" />
              </div>
            </Grid>
            <Grid item xs style={{ minWidth: "330px", textAlign: "center" }}>
              <div style={{ margin: "auto", width: "fit-content" }}>
                <h3
                  style={{
                    margin: "auto 0",
                    textAlign: "left",
                  }}
                >
                  <span>
                    Average Appraisal Value:{" "}
                    {ownerSummary.averageValue
                      ? valueFormatter(ownerSummary.averageValue)
                      : "N/A"}
                    <br />
                  </span>
                  <span>
                    Max Appraisal Value:{" "}
                    {ownerSummary.maxValue
                      ? valueFormatter(ownerSummary.maxValue)
                      : "N/A"}
                    <br />
                  </span>
                  <span>
                    Total Appraisal Value:{" "}
                    {ownerSummary.totalValue
                      ? valueFormatter(ownerSummary.totalValue)
                      : "N/A"}
                    <br />
                  </span>
                  <span>
                    Number of Counties:{" "}
                    {ownerSummary.countyCount
                      ? ownerSummary.countyCount
                      : "N/A"}
                    <br />
                  </span>
                </h3>
              </div>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  ) : (
    <CircularProgress size={80} disableShrink color="secondary" />
  );
}
