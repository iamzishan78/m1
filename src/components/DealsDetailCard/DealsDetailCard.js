import React, { useContext, useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { AppContext } from "../../AppContext";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import M1nTable from "../Shared/M1nTable/M1nTable";
import DealDisplay from "./components/DealDisplay";
import { CONTACTDEALS } from "../../graphQL/useQueryContactDeals";
import vf_currency from "../Shared/valueformatters/vf_currency.js";



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


const sumDeals = (deals) => {
  let sum = 0;
  deals.forEach((card) => {
    if (card.offerPrice && !isNaN(card.offerPrice)) sum += card.offerPrice;
  });
  if (sum !== 0) {
    return vf_currency(sum);

  }
  else {
    return "$0"
  }

};

export default function DealsDetailCard(props) {
  const [wonDeals, setWonDeals] = useState([]); // deal closed
  const [lostDeals, setLostDeals] = useState([]); // deal rejected
  const [activeDeals, setActiveDeals] = useState([]); // all other deals
  const [allDeals, setAllDeals] = useState([]); // all other deals
  const [stateApp, setStateApp] = useContext(AppContext);
  const [getContactDeals, { data, loading }] = useLazyQuery(CONTACTDEALS, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (props.contact) {
      getContactDeals({
        variables: {
          contactId: props.contact._id,
        },
      });
    }
  }, [props.contact]);

  useEffect(() => {
    if (!loading && data?.contactDeals) {
      // get all deals
      const all = [];
      data.contactDeals.forEach((card) => {
        if (!card.isDeleted) all.push(card);
      });
      setAllDeals(all);
    }
  }, [data, loading, props.contact]);

  useEffect(() => {
    if (allDeals && allDeals.length > 0) {
      let lost = [];
      let won = [];
      let others = [];
      allDeals.forEach((card) => {
        if (card.status === "lost") lost.push(card);
        else if (card.status === "won") won.push(card);
        else others.push(card);
      });

      setWonDeals(won);
      setLostDeals(lost);
      setActiveDeals(others);
    }
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
          dealLength={wonDeals.length}
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
