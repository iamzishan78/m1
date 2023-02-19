import React, { useContext } from "react";
import { useSelector } from "react-redux";
import ContactsTable from "components/Table/Contact/ContactsTable";
import { makeStyles } from "@material-ui/core/styles";

import { AppContext } from "AppContext";

const useStyles = makeStyles((theme) => ({
  root: {
    // padding: "0px 30px 30px",
    marginTop: "65px",
    // marginLeft: '-10px',
    "height": "calc(100vh - 90px)",
  },
}));

const ContactManagement = () => {
  const classes = useStyles();
  const [stateApp] = useContext(AppContext);
  const { activeModule } = useSelector(({ common }) => common);

  // waypointKey should any key of Table Header which do not have customRender in schema file
  const loadMore = { type: 'infiniteScroll', height: "calc(100vh - 66px)" }

  const getCustomAppliedFilters = () => {
    if (activeModule?.filterValue) {
      return [
        {
          field: "status.keyword",
          value: activeModule.filterValue,
        },
      ];
    }
  };

  return (
    <div className={classes.root}>
      <ContactsTable
        parent="Contacts"
        headerLabel="Contact Management"
        contactSearchQuery={stateApp.contactSearchQuery}
        userId={stateApp.user.mongoId}
        customAppliedFilters={getCustomAppliedFilters()}
        loadMore={loadMore}
        useWildeCard
      />
    </div>
  );
};

export default ContactManagement;
