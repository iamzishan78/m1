import React, { useContext, useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { AppContext } from "../../AppContext";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Taps from "../Shared/Taps";
import M1nTable from "../Shared/M1nTable/M1nTable";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DealDisplay from "./components/DealDisplay";
import { TRANSACTIONDATA } from "../../graphQL/useQueryTransactionData";

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
  const [wonDeals, setWonDeals] = useState([]); // deal closed
  const [lostDeals, setLostDeals] = useState([]); // deal rejected
  const [activeDeals, setActiveDeals] = useState([]); // all other deals
  const [allDeals, setAllDeals] = useState([]); // all other deals
  const [stateApp, setStateApp] = useContext(AppContext);
  const [getTransactionData, { data, loading }] = useLazyQuery(TRANSACTIONDATA);
  
  useEffect(() => {
    if (stateApp.user && stateApp.user.mongoId) {
      console.log(stateApp.user);
      getTransactionData({
        variables: {
          userId: stateApp.user.mongoId,
        },
      });
    }
  }, [getTransactionData, stateApp.user]);
  
  useEffect(() => {
    if (
      !loading &&
      data?.transactionData?.allData?.lanes &&
      data.transactionData.allData.lanes.length > 0
    ) {
      const lanes = data?.transactionData?.allData?.lanes;

      // get all deals
      const all = [];
      lanes.forEach((deal) => {
        deal.cards.forEach((card) => {
          if (props.contact?._id === card.contactId && !card.isDeleted)
            all.push(card);
        });
      });
      console.log("all: ", all);
      setAllDeals(all);
    }
  }, [data, loading, props.contact]);

  useEffect(() => {
    let lost = [];
    let won = [];
    let others = [];
    allDeals.forEach((card) => {
        if (card.laneId === "lane5") lost.push(card);
        else if (card.laneId === "lane4") won.push(card);
        else others.push(card);
    });

    setWonDeals(won);
    setLostDeals(lost);
    setActiveDeals(others);
    console.log("ALL DEALS UPDATED: ", allDeals)
  }, [allDeals]);


  
  const activeSum = sumDeals(activeDeals);
  const wonSum = sumDeals(wonDeals);
  const lostSum = sumDeals(lostDeals);

  const classes = useStyles();

  return (
    <Grid container className={classes.gridWidthScroll} spacing={0}>
      <div className={classes.dealContainer}>
        <DealDisplay
          dealSum={activeSum}
          dealType="ACTIVE"
          dealLength={activeDeals.length}
          color="rgb(143,229,210)"
        />
        <DealDisplay
          dealSum={wonSum}
          dealType="CLOSED"
          dealLength={wonSum.length}
          color="rgb(223,168,89)"
        />
        <DealDisplay
          dealSum={lostSum}
          dealType="LOST"
          dealLength={lostDeals.length}
          color="rgb(130,189,200)"
        />
      </div>
      <M1nTable dense parent="Deals" contact={props.contact} />
    </Grid>
  );
}
