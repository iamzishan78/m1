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
import * as Components from "components/Contacts/components";

import { contactManagementRoutes } from "utils/data";
import { options } from "@amcharts/amcharts4/core";

//// WE MAY NOT BE USING THIS ENTIRE FILE ANYMORE

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
  const [allowedPaths, setAllowablePaths] = useState({});
  const { quickActionsPanelState, activeModule } = useSelector(({ common }) => common);

  // waypointKey should any key of Table Header which do not have customRender in schema file
  const loadMore = { type: 'infiniteScroll', height: "calc(100vh - 66px)" }


  useEffect(() => {
    let option = {};
    Object.values(contactManagementRoutes).forEach((item) => {
      if (location.pathname.startsWith(item.linkPrefix)) {
        option = item;
      }
    });
    if (option) {
      if (contactManagementRoutes[option.parent]) option.parent = contactManagementRoutes[option.parent];
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
    const allPaths = JSON.parse(JSON.stringify(contactManagementRoutes));
    const feature = stateApp.user?.features?.find((feature) => feature.name === FEATURES.CONTACTSUBMENU);
    const allAllowedPaths = {};
    if (feature?.JSON) {
      const data = JSON.parse(feature.JSON);
      Object.keys(allPaths).forEach((path) => {
        if (data.options.includes(allPaths[path].value)) {
          allAllowedPaths[path] = allPaths[path];
        }
      });
    } else {
      Object.keys(allPaths).forEach((path) => {
        if (allPaths[path].isDefault) {
          allAllowedPaths[path] = allPaths[path];
        }
      });
    }
    setAllowablePaths(allAllowedPaths);
  }, [stateApp?.user]);

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
          <Switch>
            {Object.keys(allowedPaths).map((option) => (
              <Route
                exact
                path={allowedPaths[option].link}
                render={() => {
                  const RouteComponent = Components[allowedPaths[option].component];
                  return <RouteComponent viewDoc={stateApp.viewDoc} />;
                }}
              />
            ))}
          </Switch>
        </QuickActionPanel>
      </FeatureFlag>
      <FeatureFlag feature={FEATURES.CONTACTSUBMENU} noAccess>
        <div className={classes.root}>
          <ContactsTable
            parent="Contacts"
            headerLabel="Contacts"
            contactSearchQuery={stateApp.contactSearchQuery}
            userId={stateApp.user.mongoId}
            loadMore={loadMore}
          />
        </div>
      </FeatureFlag>
    </>
  );
}
