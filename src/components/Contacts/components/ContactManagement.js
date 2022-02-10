import React, { useContext } from "react";
import ContactsTable from "components/Table/Contact/ContactsTable";
import { makeStyles } from "@material-ui/core/styles";

import { AppContext } from "AppContext";

import ContactsAnalyticsCards from 'components/Contacts/components/ContactsAnalyticsCards';

const useStyles = makeStyles((theme) => ({
  root: {
      padding: "0px 30px"
  },
}));

const ContactManagement = () => {
  const classes = useStyles();
  const [stateApp] = useContext(AppContext);

  return (
    <div className={classes.root}>
      <ContactsAnalyticsCards />
      <ContactsTable
        parent="Contacts"
        headerLabel="Contact Management"
        contactSearchQuery={stateApp.contactSearchQuery}
        userId={stateApp.user.mongoId}
      />
    </div>
  );
};

export default ContactManagement;
