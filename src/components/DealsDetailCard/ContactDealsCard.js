import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import { useLazyQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";

import DealsDetailCard from "./DealsDetailCard";
import { CONTACTDEALS } from "graphQL/useQueryContactDeals";
import { CONTACT } from "graphQL/useQueryContact";

const useStyles = makeStyles((theme) => ({
  root: {
    "& div": {
      "&>.MuiPaper-root": {
        "&>:nth-child(3)": {
          maxHeight: "calc(50vh - 266px) !important"
        },
      },
    },
  },
}));


export default function ContactDocumentsCard(props) {
  let history = useHistory();
  const classes = useStyles();

  const [allDeals, setAllDeals] = useState([]);
  const [wonDeals, setWonDeals] = useState([]);
  const [lostDeals, setLostDeals] = useState([]);
  const [activeDeals, setActiveDeals] = useState([]);
  const [contactData, setContactData] = useState(null);

  const contactId = history.location.pathname.split("/")[history.location.pathname.split("/").length - 2];

  const [getContact, { data }] = useLazyQuery(CONTACT);
  const [getContactDeals, { data: deals, loading }] = useLazyQuery(CONTACTDEALS, { fetchPolicy: "cache-and-network" });

  useEffect(() => {
    if (contactId) {
      getContactDeals({
        variables: {
          contactId: contactId,
        },
      });
    }
  }, [contactId, getContactDeals]);

  useEffect(() => {
    if (!loading && deals?.contactDeals) {
      const all = [];
      deals.contactDeals.forEach((card) => {
        if (!card.isDeleted) all.push(card);
      });
      setAllDeals(all);
    }
  }, [deals, loading]);

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

  useEffect(() => {
    if (contactId) {
      getContact({
        variables: {
          contactId: contactId,
        },
      });
    }
  }, [contactId, getContact]);

  useEffect(() => {
    if (data && data.contact) {
      setContactData(data.contact);
    }
  }, [data]);

  return contactData ? (
    <div variant="outlined" className={classes.root}>
      <div
        style={{
          backgroundColor: "#F2F2F2",
          minHeight: "4px",
          display: "flex",
          position: "relative",
          alignItems: "center",
        }}
      />

      <DealsDetailCard activeDeals={activeDeals} lostDeals={lostDeals} closedDeals={wonDeals} contact={contactData} />
    </div>
  ) : (
    <div
      style={{
        padding: "20px",
        position: "absolute",
        height: "95%",
        width: "100%",
        zIndex: "50",
      }}
    >
      <CircularProgress size={80} disableShrink color="secondary" />
    </div>
  );
}
