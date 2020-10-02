import React, { useContext, useState } from "react";
import { AppContext } from "../../AppContext";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Taps from "../Shared/Taps";
import M1nTable from "../Shared/M1nTable/M1nTable";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DealDisplay from "./components/DealDisplay";

const useStyles = makeStyles((theme) => ({
  gridWidthScroll: {
    backgroundColor: "#fff",
    "& .formLabel": {
      color: "#757575",
      fontWeight: "bold",
      width: "100%",
      marginBottom: "0",
    },
  },
  dealContainer: {
    display: "flex",
    padding: "10px 10px 30px 10px",
  },
}));

let formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const sumDeals = (deals) => {
  let sum = 0;
  deals.forEach(
    (card) =>
      (sum += parseFloat(card.label.split("$").join("").split(",").join("")))
  );
  const formatted = formatter.format(sum);
  return formatted.slice(0, formatted.length - 3);
};

export default function DealsDetailCard(props) {
  const activeSum = sumDeals(props.activeDeals);
  const closedSum = sumDeals(props.closedDeals);
  const lostSum = sumDeals(props.lostDeals);

  const classes = useStyles();

  return (
    <Grid container className={classes.gridWidthScroll} spacing={0}>
      <div className={classes.dealContainer}>
        <DealDisplay
          dealSum={activeSum}
          dealType="ACTIVE"
          dealLength={props.activeDeals.length}
          color="#34fff7"
        />
        <DealDisplay
          dealSum={closedSum}
          dealType="CLOSED"
          dealLength={props.closedDeals.length}
          color="#f5AA45"
        />
        <DealDisplay
          dealSum={lostSum}
          dealType="LOST"
          dealLength={props.lostDeals.length}
          color="#3366ff"
        />
      </div>
      <M1nTable dense parent="Deals" contact={props.contact} />
    </Grid>
  );
}
