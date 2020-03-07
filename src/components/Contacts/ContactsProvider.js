import React from "react";
import { ContactsContextProvider } from "./ContactsContext";
import { makeStyles } from "@material-ui/core/styles";
import Contacts from "./Contacts";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
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
      <Contacts className={classes.ContactsWrapper}>{props.children}</Contacts>
    </ContactsContextProvider>
  );
}
