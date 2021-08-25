import React, { useState, useEffect, useContext } from "react";
import { useLazyQuery } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import { useHistory } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import { TRANSACTIONDATA } from "../../../graphQL/useQueryTransactionData";
import { CONTACTDEALS } from "../../../graphQL/useQueryContactDeals";
import DealMoneyIcon from "../../Shared/svgIcons/DealMoneyIcon";
import { AppContext } from "../../../AppContext";
import DealsDetailCard from "../../DealsDetailCard/DealsDetailCard";
import vf_currency from "../../Shared/valueformatters/vf_currency.js";
import AddDealDialog from "../../ContactDetailCard/components/AddDealDialog";
import Button from '@material-ui/core/Button';


const useStyles = makeStyles((theme) => ({
  root: {
    padding: "23px 23px 0 23px",
    cursor: "pointer",
    width: "100%"
  },
  cardContent: { width: "100%", display: "flex" },
  leftColumn: {
    textAlign: "left",
    marginRight: "18px",
  },
  addIcon: {
    backgroundColor: "#D5F4FF",
    float: "right",
    top: "-6px",
    justifyContent: "right",
    alignItems: "right",

  },
  button: {
    height: "100%",
    width: "100%",
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'left'
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
  h5: { color: "#757575", marginTop: "0", textAlign: "left", },
}));

export default function Deals({ contact, ...props }) {
  const classes = useStyles();
  let history = useHistory();
  const [wonDeals, setWonDeals] = useState([]); // deal closed
  const [lostDeals, setLostDeals] = useState([]); // deal rejected
  const [activeDeals, setActiveDeals] = useState([]); // all other deals
  const [allDeals, setAllDeals] = useState([]); // all other deals
  const [getContactDeals, { data, loading }] = useLazyQuery(CONTACTDEALS, {
    fetchPolicy: "cache-and-network",
  });

  const stringData = JSON.stringify(data);
  const [stateApp, setStateApp] = useContext(AppContext);

  useEffect(() => {
    if (contact) {
      getContactDeals({
        variables: {
          contactId: contact._id,
        },
      });
    }
  }, [contact]);

  useEffect(() => {
    if (!loading && data?.contactDeals) {
      // get all deals
      const all = [];
      data.contactDeals.forEach((card) => {
        if (!card.isDeleted) all.push(card);
      });
      setAllDeals(all);
    }
  }, [contact, stringData, data, loading]);

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

  const sumOpenDeals = () => {
    let sum = 0;
    activeDeals.forEach((card) => {
      if (card.offerPrice && !isNaN(card.offerPrice)) sum += card.offerPrice;
      // sum += parseFloat(card.label.split("$").join("").split(",").join(""))
    });

    return vf_currency(sum);
  };

  const sumWonDeals = () => {
    let sum = 0;
    wonDeals.forEach((card) => {
      if (card.offerPrice && !isNaN(card.offerPrice)) sum += card.offerPrice;
      // (sum += parseFloat(card.label.split("$").join("").split(",").join("")))
    });
    return vf_currency(sum);
  };

  const sumLostDeals = () => {
    let sum = 0;
    lostDeals.forEach((card) => {
      if (card.offerPrice && !isNaN(card.offerPrice)) sum += card.offerPrice;
      // (sum += parseFloat(card.label.split("$").join("").split(",").join("")))
    });

    return vf_currency(sum);
  };

  return (

    <Button
      className={classes.button}
      fullWidth={true}
      variant='outlined'
    // style={{justifyContent: "flex-start"}}
      onClick={() => {
        history.push(`/contact/details/${contact._id}/deals`)
        // props.handleOpenExpandableCard(
        //   <DealsDetailCard
        //     activeDeals={activeDeals}
        //     lostDeals={lostDeals}
        //     closedDeals={wonDeals}
        //     contact={contact}
        //   />,
        //   "Deals"
        // );
      }}
    >

      <div className={classes.root}
      >

        <AddDealDialog
          open={stateApp.dealDialog ? true : false}
          width="450px"
          onClose={() =>
            setStateApp((stateApp) => ({
              ...stateApp,
              dealDialog: false,
            }))
          }
          contactId={contact._id}
        />
        <div>
          <h4 style={{ marginTop: "0", float: "left" }}>Deals ({allDeals.length})</h4>
          <IconButton
            style={{ marginTop: "0", alignItems: "right" }}
            size="small"
            className={classes.addIcon}
            onClick={() =>
              setStateApp((stateApp) => ({
                ...stateApp,
                dealDialog: true,
              }))
            }
          >
            <AddIcon style={{ marginTop: "0", alignItems: "right" }} htmlColor="rgb(28 173 225 / 81%)" />
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
              Active Deals
              {/* Active Deals ({activeDeals.length}) */}
              <br />
              <span className={classes.lastContactedSpan}>{sumOpenDeals() || vf_currency("0")}</span>
            </h5>
            <h5 className={classes.h5}>
              Closed Deals
              {/* Closed Deals ({wonDeals.length}) */}
              <br />
              <span className={classes.lastContactedSpan}>{sumWonDeals() || vf_currency("0")}</span>
            </h5>
            {/* <h5 className={classes.h5}>
            Lost Deals ({lostDeals.length})
            <br />
            <span className={classes.lastContactedSpan}>{sumLostDeals()}</span>
          </h5> */}
          </div>
        </div>
      </div>
    </Button>
  );
}
