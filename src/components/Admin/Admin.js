import React, { useContext, useEffect, useState } from "react";
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

import { AdminManagementRoutes } from "utils/data";
import Customiztion from './components/Customiztion';

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

const Components = {
  Admin: Customiztion,
};

export default function Admin() {
  const classes = useStyles();
  const location = useLocation();
  const [stateApp] = useContext(AppContext);
  const dispatch = useDispatch();
  const [allowedPaths, setAllowablePaths] = useState({});
  const { quickActionsPanelState, activeModule } = useSelector(({ common }) => common);
  useEffect(() => {
    const option = Object.values(AdminManagementRoutes).find((item) => {
      return item.link === location.pathname
    });
    if (option) {
      dispatch(setActiveModule(option));
    }
  }, [location.pathname]);

  const handlePanelStateChange = (state) => {
    dispatch(toggleQuickActionsPanel(state));
  };

  const sidePanelOptions = React.useMemo(() => {
    const options = {};
    Object.keys(allowedPaths).forEach((key) => {
      if (!allowedPaths[key].isExcluded) {
        options[key] = allowedPaths[key];
      }
    });
    return options;
  }, [allowedPaths]);

  useEffect(() => {
    const allPaths = JSON.parse(JSON.stringify(AdminManagementRoutes));
    const feature = stateApp.user?.features?.find(feature => feature.name === FEATURES.CONTACTSUBMENU);
    // const feature = stateApp.user?.features?.find(feature => feature.name === FEATURES.ANALYTICSSUBMENU);
    const allAllowedPaths = {}
    if (feature?.JSON) {
      const data = JSON.parse(feature.JSON)
      Object.keys(allPaths).forEach(path => {
        if (data.options.includes(allPaths[path].value)) {
          allAllowedPaths[path] = allPaths[path]
        }
      })
    } else {
      Object.keys(allPaths).forEach(path => {
        if (allPaths[path].isDefault) {
          allAllowedPaths[path] = allPaths[path]
        }
      })
    }
    setAllowablePaths(allAllowedPaths)
  }, [stateApp?.user])
  return (
    <>
      <FeatureFlag feature={FEATURES.CONTACTSUBMENU}>
        {/* <FeatureFlag feature={FEATURES.ANALYTICSSUBMENU}> */}
        <QuickActionPanel
          title="Admin Settings"
          handlePanelStateChange={handlePanelStateChange}
          quickActionsPanelState={quickActionsPanelState}
          activeModule={activeModule}
          actions={sidePanelOptions}
        >
          {Object.keys(allowedPaths).map((option) => (
            <Switch>
              <Route
                exact
                path={allowedPaths[option].link}
                component={Components[allowedPaths[option].component]}
              />
            </Switch>
          ))}
        </QuickActionPanel>
      </FeatureFlag>
      <FeatureFlag feature={FEATURES.CONTACTSUBMENU} noAccess>

        <div className={classes.root}>
          <ContactsTable
            parent="Admin"
            headerLabel="Admin"
            contactSearchQuery={stateApp.contactSearchQuery}
            userId={stateApp.user.mongoId}
          />
        </div>
      </FeatureFlag>
    </>
  );
}
