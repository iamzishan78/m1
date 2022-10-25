import React from "react";
import { ContactsContextProvider } from "./../Contacts/ContactsContext";
import { makeStyles } from "@material-ui/core/styles";
import Analytics from "./../Analytics/Aanlytics";
const useStyles = makeStyles(theme => ({
  ContactsWrapper: {
    width: "100%",
    height: "100%"
  }
}));

export default function ContactsProvider(props) {
  let classes = useStyles();
  return (
    <ContactsContextProvider>
      <Analytics className={classes.ContactsWrapper}>{props.children}</Analytics>
    </ContactsContextProvider>
  );
}
