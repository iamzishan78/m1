import React, { useState, useEffect, useContext } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import { TRANSACTIONDATA } from "../../../graphQL/useQueryTransactionData";
import DealMoneyIcon from "../../Shared/svgIcons/DealMoneyIcon";
import { AppContext } from "../../../AppContext";
import DealsDetailCard from "../../DealsDetailCard/DealsDetailCard";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "23px 23px 0 23px",
  },

  cardContent: { width: "100%", display: "flex" },
  leftColumn: {
    textAlign: "center",
    marginRight: "18px",
  },
  addIcon: {
    backgroundColor: "#D5F4FF",
    float: "right",
    top: "-6px",
  },
  lastContactedSpan: { fontWeight: "normal", marginBottom: "0" },
  icon: {
    width: "80px",
    height: "80px",
    backgroundColor: "#34673433",
    borderRadius: "100%",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  h5: { color: "#757575", marginTop: "0" },
}));

let formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function Deals({ contact, ...props }) {
  const classes = useStyles();
  const [wonDeals, setWonDeals] = useState([]); // deal closed
  const [lostDeals, setLostDeals] = useState([]); // deal rejected
  const [activeDeals, setActiveDeals] = useState([]); // all other deals
  const [allDeals, setAllDeals] = useState([]); // all other deals
  const [stateApp, setStateApp] = useContext(AppContext);
  const [getTransactionData, { data, loading }] = useLazyQuery(TRANSACTIONDATA);

  const stringData = JSON.stringify(data);

  useEffect(() => {
    if (stateApp.user && stateApp.user.mongoId) {
      console.log(stateApp.user);
      getTransactionData({
        variables: {
          userId: stateApp.user.mongoId,
        },
      });
    }
  }, [stateApp.user]);

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
          if (contact?._id === card.contactId) all.push(card);
        });
      });
      console.log("all: ", all);
      setAllDeals(all);
    }
  }, [contact, stringData, data, loading]);

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
  }, [allDeals]);

  const sumOpenDeals = () => {
    let sum = 0;
    activeDeals.forEach(
      (card) =>
        (sum += parseFloat(card.label.split("$").join("").split(",").join("")))
    );
    const formatted = formatter.format(sum);
    return formatted.slice(0, formatted.length - 3);
  };

  const sumWonDeals = () => {
    let sum = 0;
    wonDeals.forEach(
      (card) =>
        (sum += parseFloat(card.label.split("$").join("").split(",").join("")))
    );
    const formatted = formatter.format(sum);
    return formatted.slice(0, formatted.length - 3);
  };

  return (
    <div className={classes.root}>
      <div>
        <h4 style={{ marginTop: "0", float: "left" }}>Deals (3)</h4>
        <IconButton
          size="small"
          className={classes.addIcon}
          onClick={() => {
            props.handleOpenExpandableCard(
              <DealsDetailCard
                activeDeals={activeDeals}
                lostDeals={lostDeals}
                closedDeals={wonDeals}
                contactId={contact._id}
              />,
              "Deals"
            );
          }}
        >
          <AddIcon htmlColor="rgb(28 173 225 / 81%)" />
        </IconButton>
      </div>
      <div className={classes.cardContent}>
        <div className={classes.leftColumn}>
          <div className={classes.icon}>
            <DealMoneyIcon />
          </div>
        </div>

        <div>
          <h5 className={classes.h5}>
            Active Deals ({activeDeals.length})
            <br />
            <span className={classes.lastContactedSpan}>{sumOpenDeals()}</span>
          </h5>
          <h5 className={classes.h5}>
            Closed Deals ({wonDeals.length})
            <br />
            <span className={classes.lastContactedSpan}>{sumWonDeals()}</span>
          </h5>
        </div>
      </div>
    </div>
  );
}
