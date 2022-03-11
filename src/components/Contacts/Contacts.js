import React, { useContext, useEffect } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

// import { toggleQuickActionsPanel, setActiveModule } from "store/actions/contactActions";
import { setActiveModule, toggleQuickActionsPanel } from "store/actions/commonActions";
import { AppContext } from "AppContext";
import { FEATURES } from "components/Shared/FeatureFlag/common";

import FeatureFlag from "components/Shared/FeatureFlag/FeatureFlagComponent";
import QuickActionPanel from "components/Land/components/QuickActionPanel";
import ContactsTable from "components/Table/Contact/ContactsTable";
import * as Components from "components/Contacts/components";

import { contactManagementRoutes } from "utils/data";

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

export default function Contacts() {
  const classes = useStyles();
  const location = useLocation();
  const [stateApp] = useContext(AppContext);
  const dispatch = useDispatch();
  const { quickActionsPanelState, activeModule } = useSelector(({ common }) => common);

  useEffect(() => {
    const option = Object.values(contactManagementRoutes).find((item) => item.link === location.pathname);
    if (option) {
      dispatch(setActiveModule(option));
    }
  }, [location.pathname]);

  const handlePanelStateChange = (state) => {
    dispatch(toggleQuickActionsPanel(state));
  };

  const sidePanelOptions = React.useMemo(() => {
    const options = {};
    Object.keys(contactManagementRoutes).forEach((key) => {
      if (!contactManagementRoutes[key].isExcluded) {
        options[key] = contactManagementRoutes[key];
      }
    });
    return options;
  }, []);

  return (
    <>
      <FeatureFlag feature={FEATURES.CONTACTSUBMENU}>
        <QuickActionPanel
          title="Contact Management"
          handlePanelStateChange={handlePanelStateChange}
          quickActionsPanelState={quickActionsPanelState}
          activeModule={activeModule}
          actions={sidePanelOptions}
        >
          {Object.keys(contactManagementRoutes).map((option) => (
            <Switch>
              <Route exact path={contactManagementRoutes[option].link} component={Components[contactManagementRoutes[option].component]} />
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
