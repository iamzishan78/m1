import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../../AppContext";
import { Container } from "@material-ui/core";
import ContactInfoScreen from "./components/ContactInfoScreen";
import ContactsTableAndAddDialog from "./components/ContactsTableAndAddDialog";

const useStyles = makeStyles(theme => ({
  container: {
    paddingLeft: "0 !important",
    paddingRight: "0 !important",
    // height: "91.1876355%"
    height: "100%"

  }
}));

export default function Contacts() {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);

  useEffect(() => {
    setStateApp(stateApp => ({
      ...stateApp,
      selectedContact: null
    }));
  }, []);

  return (
    <Container maxWidth="xl" className={classes.container}>
      {stateApp.selectedContact === null ? (
        <ContactsTableAndAddDialog />
      ) : (
        <ContactInfoScreen />
      )}
    </Container>
  );
}
