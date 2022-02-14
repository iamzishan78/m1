import React, { useContext } from "react";
import { useSelector } from "react-redux";
import ContactsTable from "components/Table/Contact/ContactsTable";
import { makeStyles } from "@material-ui/core/styles";

import { AppContext } from "AppContext";

import ContactsAnalyticsCards from 'components/Contacts/components/ContactsAnalyticsCards';

const useStyles = makeStyles((theme) => ({
  root: {
      padding: "0px 30px",
      "& div": {
        "&>.MuiPaper-root": {
          "&>:nth-child(3)": {
            maxHeight: "78vh",
            minHeight: "78vh",
            "@media (max-height:900px)": {
              maxHeight: "72vh",
              minHeight: "72vh",
            },
            "@media (max-height:800px)": {
              maxHeight: "70vh",
              minHeight: "70vh",
            },
            "@media (max-height:768px)": {
              maxHeight: "70vh",
              minHeight: "70vh",
            },
          },
        },
      },
  },
}));

const ContactManagement = () => {
  const classes = useStyles();
  const [stateApp] = useContext(AppContext);
  const { activeModule } = useSelector(({ contact }) => contact);

  const getCustomAppliedFilters = () => {
    if(activeModule?.filterValue){
      return [{
        field: "status.keyword",
        value: activeModule.filterValue
      }]
    }
  }
  
  return (
    <div className={classes.root}>
      {/* {activeModule.showAnalytics &&(
        <ContactsAnalyticsCards />
      )} */}
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
