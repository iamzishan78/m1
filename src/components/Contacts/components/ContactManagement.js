import React, { useContext } from "react";
import { useSelector } from "react-redux";
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
  const { activeModule } = useSelector(({ contact }) => contact);

  const getCustomAppliedFilters = () => {
    if(activeModule){
      return [{
        field: "status.keyword",
        value: activeModule.filterValue
      }]
    }
  }
  
  return (
    <div className={classes.root}>
      {activeModule.showAnalytics &&(
        <ContactsAnalyticsCards />
      )}
      <ContactsTable
        parent="Contacts"
        headerLabel="Contact Management"
        contactSearchQuery={stateApp.contactSearchQuery}
        userId={stateApp.user.mongoId}
        customAppliedFilters={getCustomAppliedFilters()}
      />
    </div>
  );
};

export default ContactManagement;
