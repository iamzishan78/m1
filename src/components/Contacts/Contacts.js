import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../../AppContext";
import { Container } from "@material-ui/core";
import M1nTable from "../Shared/M1nTable/M1nTable";
import ContactInfoScreen from "./components/ContactInfoScreen";
import RightDialog from "./components/RightDialog"

const useStyles = makeStyles(theme => ({
  container: {
    paddingLeft: "0 !important",
    paddingRight: "0 !important",
    height:"91.1876355%"
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
      {stateApp.selectedContact===null ? (
        <M1nTable parent="Contacts" />
      ) : (
        <ContactInfoScreen />
      )}
      {/* <RightDialog/> */}
    </Container>
  );
}
