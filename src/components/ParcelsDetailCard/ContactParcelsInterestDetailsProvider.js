import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Toolbar from "@material-ui/core/Toolbar";
import Link from "@material-ui/core/Link";
import { useLazyQuery } from "@apollo/client";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Typography from "@material-ui/core/Typography";

import { CONTACT } from "graphQL/useQueryContact";
import { CUSTOMLAYER } from "graphQL/useQueryCustomLayer";
import { NavigationContext } from "components/Navigation/NavigationContext";
import { ContactDetailsContextProvider } from "components/ContactDetailCard/ContactDetailsContext";
import ParcelsDetailCard from "./ParcelsDetailCard";

export default function ContactParcelsInterestProvider(props) {
  let history = useHistory();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [contactData, setContactData] = useState(null);
  const [parcelObj, setParcelObj] = useState(null);

  const [getContact, { data }] = useLazyQuery(CONTACT);
  const [getCustomLayer, { data: dataCustomLayer }] = useLazyQuery(CUSTOMLAYER);

  const parcelId =
    history.location.pathname.split("/")[
      history.location.pathname.split("/").length - 1
    ];

  const contactId =
    history.location.pathname.split("/")[
      history.location.pathname.split("/").length - 3
    ];

    useEffect(() => {
      if (parcelId) {
        getCustomLayer({
          variables: {
            id: parcelId,
          },
        });
      }
    }, [getCustomLayer, parcelId]);

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
      if (dataCustomLayer && dataCustomLayer.customLayer) {
        let shape = dataCustomLayer.customLayer.shape;
        if (typeof shape === "string") {
          shape = JSON.parse(shape);
        }
        setParcelObj({
          ...dataCustomLayer.customLayer,
          shape: shape,
        });
      }
    }, [dataCustomLayer]);

    useEffect(() => {
      if (data && data.contact) {
        setContactData(data.contact);
      }
    }, [data]);

    const checkModuleHistory = () => {
      return !!stateNav.contactFromMap;
    };

    console.log('Parcel Obj', parcelObj)
  return (
    <ContactDetailsContextProvider>
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
          <Link
            style={{
              marginLeft: "5px",
              fontSize: "16px",
              cursor: "pointer",
            }}
            color="inherit"
            onClick={() => history.push(`/contact/details/${contactId}/parcels`)}
          >
            Associated Interests
          </Link>
          <Typography
            style={{
              color: "#18AADD",
              fontSize: "16px",
              marginLeft: "5px",
            }}
          >
            {parcelObj?.name}
          </Typography>
        </Breadcrumbs>
      </Toolbar>

      <ParcelsDetailCard id={parcelId}>{props.children}</ParcelsDetailCard>
    </ContactDetailsContextProvider>
  );
}
