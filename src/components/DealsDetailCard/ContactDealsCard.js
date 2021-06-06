import React, { useState, useContext, useEffect } from "react";
import Link from "@material-ui/core/Link";
import { useLazyQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import CircularProgress from "@material-ui/core/CircularProgress";

import { AppContext } from "AppContext";
import { NavigationContext } from "components/Navigation/NavigationContext";
import DealsDetailCard from "./DealsDetailCard";
import { CONTACTDEALS } from "graphQL/useQueryContactDeals";
import { CONTACT } from "graphQL/useQueryContact";

export default function ContactDocumentsCard(props) {
  let history = useHistory();
  const [stateApp] = useContext(AppContext);
  const [stateNav, setStateNav] = useContext(NavigationContext);

  const [allDeals, setAllDeals] = useState([]);
  const [wonDeals, setWonDeals] = useState([]);
  const [lostDeals, setLostDeals] = useState([]);
  const [activeDeals, setActiveDeals] = useState([]);
  const [contactData, setContactData] = useState(null);

  const contactId =
    history.location.pathname.split("/")[
      history.location.pathname.split("/").length - 2
    ];

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


  const checkModuleHistory = () => {
    return !!stateNav.contactFromMap;
  };

  return contactData ? (
    <div variant="outlined">
      <Toolbar style={{ backgroundColor: "#F0F6F8" }}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          {checkModuleHistory() && (
            <Link
              style={{
                marginLeft: "5px",
                fontSize: "16px",
                cursor: "pointer",
              }}
              color="inherit"
              onClick={() => {
                history.push("/");
                setStateNav((stateApp) => ({
                  ...stateApp,
                  contactFromMap: false,
                }));
              }}
            >
              Map
            </Link>
          )}
          <Link
            style={{
              marginLeft: "5px",
              fontSize: "16px",
              cursor: "pointer",
            }}
            color="inherit"
            onClick={() => history.push("/contacts")}
          >
            Contacts
          </Link>
          <Link
            style={{
              marginLeft: "5px",
              fontSize: "16px",
              cursor: "pointer",
            }}
            color="inherit"
            onClick={() => history.push(`/contact/details/${contactId}`)}
          >
            {contactData?.name}
          </Link>
          <Typography
            style={{
              color: "#18AADD",
              fontSize: "16px",
              marginLeft: "5px",
            }}
          >
            Deals
          </Typography>
        </Breadcrumbs>
      </Toolbar>

      <DealsDetailCard
        activeDeals={activeDeals}
        lostDeals={lostDeals}
        closedDeals={wonDeals}
        contact={contactData}
      />
    </div>
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
