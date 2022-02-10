import React, { useContext, useEffect } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

import {
  toggleContactActionsPanel,
  setActiveModuleContact,
} from "store/actions/contactActions";
import { AppContext } from "AppContext";
import { FEATURES } from "components/Shared/FeatureFlag/common";

import FeatureFlag from "components/Shared/FeatureFlag/FeatureFlagComponent";
import QuickActionPanel from "components/Land/components/QuickActionPanel";
import ContactsTable from "components/Table/Contact/ContactsTable";
import * as Components from "components/Contacts/components";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "65px",
    "& div": {
      "&>.MuiPaper-root": {
        display: "flex",
        "flex-direction": "column",
        height: "calc(100vh - 65px)",
        // top: "65px",
        position: "relative",
        "align-items": "stretch",
        "&>.MuiPaper-root": {
          display: "contents",
        },
        "&>:nth-child(3)": {
          height: "inherit !important",
        },
        "&> table": {
          bottom: 0,
        },
      },
    },
  },
}));

export const SIDE_PANEL_MENU_ITEMS_LIST = {
  PORTFOLIO: {
    featureFlag: "CONTACTSUBMENU",
    title: "Leads",
    link: "/contacts/leads",
    component: "ContactsTable",
  },
  AGREEMENTS: {
    featureFlag: "CONTACTSUBMENU",
    title: "Prospects",
    link: "/contacts/prospects",
    component: "ContactsTable",
  },
  CONTACTS: {
    featureFlag: "CONTACTSUBMENU",
    title: "Contacts",
    link: "/contacts",
    component: "ContactsTable",
  },
  TRACTS: {
    featureFlag: "CONTACTSUBMENU",
    title: "Activity Dashboard",
    link: "/contacts/activityDashboard",
    component: "ContactsTable",
  },
  REPORTING_GROUPS: {
    featureFlag: "CONTACTSUBMENU",
    title: "Campaign Management",
    link: "/contacts/campaignManagement",
    component: "ContactsTable",
  },
};

export default function Contacts() {
  const classes = useStyles();
  const location = useLocation();
  const [stateApp] = useContext(AppContext);
  const dispatch = useDispatch();
  const { quickActionsPanelState, activeModule } = useSelector(
    ({ contact }) => contact
  );

  useEffect(() => {
    const option = Object.values(SIDE_PANEL_MENU_ITEMS_LIST).find(
      (item) => item.link === location.pathname
    );
    if (option) {
      dispatch(setActiveModuleContact(option));
    }
  }, [location.pathname]);

  const handlePanelStateChange = (state) => {
    dispatch(toggleContactActionsPanel(state));
  };

  return (
    <>
      <FeatureFlag feature={FEATURES.CONTACTSUBMENU}>
        <QuickActionPanel
          title="Contact Management"
          handlePanelStateChange={handlePanelStateChange}
          quickActionsPanelState={quickActionsPanelState}
          activeModule={activeModule}
          actions={SIDE_PANEL_MENU_ITEMS_LIST}
        >
          {Object.keys(SIDE_PANEL_MENU_ITEMS_LIST).map((option) => (
            <Switch>
              <Route
                exact
                path={SIDE_PANEL_MENU_ITEMS_LIST[option].link}
                component={
                  Components[SIDE_PANEL_MENU_ITEMS_LIST[option].component]
                }
              />
            </Switch>
          ))}
        </QuickActionPanel>
      </FeatureFlag>
      <FeatureFlag feature={FEATURES.CONTACTSUBMENU} noAccess>
        <div className={classes.root}>
          <ContactsTable
            parent="Contacts"
            headerLabel="Contacts"
            contactSearchQuery={stateApp.contactSearchQuery}
            userId={stateApp.user.mongoId}
          />
        </div>
      </FeatureFlag>
    </>
  );
}
