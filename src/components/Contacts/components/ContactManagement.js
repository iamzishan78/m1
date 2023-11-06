import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import ContactsTable from 'components/Table/Contact/ContactsTable';

import { AppContext } from 'AppContext';
import MRTTable from 'components/MRTTable';
import { tableController } from 'hookstate/tableController';

const useStyles = makeStyles(() => ({
  root: {
    // padding: "0px 30px 30px",
    marginTop: '65px',
    // marginLeft: '-10px',
  },
}));

const ContactManagement = () => {
  const classes = useStyles();
  const [stateApp] = useContext(AppContext);
  const { activeModule } = useSelector(({ common }) => common);

  // waypointKey should any key of Table Header which do not have customRender in schema file
  const loadMore = { type: 'infiniteScroll', height: 'calc(100vh - 66px)' };

  const getCustomAppliedFilters = () => {
    if (activeModule?.filterValue) {
      return [
        {
          field: 'status.keyword',
          value: activeModule.filterValue,
        },
      ];
    }
  };

  useEffect(() => {
    tableController("ContactTable").setGlobalFilter(stateApp.contactSearchQuery)
  }, [stateApp.contactSearchQuery])

  return (
    <div className={classes.root}>
      {activeModule?.filterValue === 'Lead' ?
        (
          < ContactsTable
            parent="Contacts"
            headerLabel="Contact Management"
            contactSearchQuery={stateApp.contactSearchQuery}
            userId={stateApp.user.mongoId}
            customAppliedFilters={getCustomAppliedFilters()}
            loadMore={loadMore}
            useWildeCard
          />
        ) :
        (
          <Box sx={{ padding: '1em', marginLeft: '1em' }}>
            <MRTTable name="ContactTable" />
          </Box>
        )
      }
    </div>
  );
};

export default ContactManagement;
