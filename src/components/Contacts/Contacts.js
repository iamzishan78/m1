import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
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

  return (
    <Container maxWidth="xl" className={classes.container}>
      <ContactsTableAndAddDialog />
    </Container>
  );
}
