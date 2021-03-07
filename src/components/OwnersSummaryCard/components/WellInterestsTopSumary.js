import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import { OWNERSUMMARY } from "../../../graphQL/useQueryOwnerSummary";
import { useLazyQuery } from "@apollo/client";
import Paper from "@material-ui/core/Paper";
import WellIcon from "../../Shared/svgIcons/well";
import { useDispatch, useSelector } from "react-redux";
import { setMapGridCardState } from "../../../actions";


// import value formatters 
import vf_currency from "../../Shared/valueformatters/vf_currency.js";
import joinAddress from "../../Shared/valueformatters/join-address.js";


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

export default function WellInterestsTopSumary(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selectedOwnerWellIntsSummary = useSelector(
    ({ MapGridCard }) => MapGridCard.selectedOwnerWellIntsSummary
  );

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
    if (data)
      dispatch(
        setMapGridCardState({
          selectedOwnerWellIntsSummary: data.ownerSummary,
        })
      );
  }, [data]);

  return selectedOwnerWellIntsSummary ? (
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
            {selectedOwnerWellIntsSummary.ownerName ? (
              <span>
                {selectedOwnerWellIntsSummary.ownerName} <br />
              </span>
            ) : null}
            {selectedOwnerWellIntsSummary.streetAddress ? (
              <span>
                {selectedOwnerWellIntsSummary.streetAddress} <br />
              </span>
            ) : null}
            {joinAddress(selectedOwnerWellIntsSummary)}
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
            Well Interests (
            {numberWithCommas(selectedOwnerWellIntsSummary.interestsCount)})
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
                    {selectedOwnerWellIntsSummary.averageValue
                      ? vf_currency(
                          selectedOwnerWellIntsSummary.averageValue
                        )
                      : "N/A"}
                    <br />
                  </span>
                  <span>
                    Max Appraisal Value:{" "}
                    {selectedOwnerWellIntsSummary.maxValue
                      ? vf_currency(selectedOwnerWellIntsSummary.maxValue)
                      : "N/A"}
                    <br />
                  </span>
                  <span>
                    Total Appraisal Value:{" "}
                    {selectedOwnerWellIntsSummary.totalValue
                      ? vf_currency(selectedOwnerWellIntsSummary.totalValue)
                      : "N/A"}
                    <br />
                  </span>
                  <span>
                    Number of Counties:{" "}
                    {selectedOwnerWellIntsSummary.countyCount
                      ? selectedOwnerWellIntsSummary.countyCount
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
