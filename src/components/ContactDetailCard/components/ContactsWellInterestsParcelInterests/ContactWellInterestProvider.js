import React from "react";

import { ContactDetailsContextProvider } from "components/ContactDetailCard/ContactDetailsContext";
import ContactWellInterestCard from './ContactWellInterestCard'
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  ContactsWrapper: {
    width: "100%",
    height: "100%"
  }
}));

export default function ContactWellInterestProvider(props) {
  let classes = useStyles();
  return (
    <ContactDetailsContextProvider>
      <ContactWellInterestCard  className={classes.ContactsWrapper}>
        {props.children}
      </ContactWellInterestCard>
    </ContactDetailsContextProvider>
  );
}
