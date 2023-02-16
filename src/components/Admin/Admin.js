import React, { useContext, useEffect, useState } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { setActiveModule, toggleQuickActionsPanel } from "store/actions/commonActions";
import { AppContext } from "AppContext";
import { FEATURES } from "components/Shared/FeatureFlag/common";

import FeatureFlag from "components/Shared/FeatureFlag/FeatureFlagComponent";
import QuickActionPanel from "components/Land/components/QuickActionPanel";

import { AdminManagementRoutes } from "utils/data";
import Map from "./components/Map";
import AdminSettings from "components/Shared/AdminSettings";

const Components = {
  Map,
  AdminSettings,
};

export default function Admin() {
  const location = useLocation();
  const [stateApp] = useContext(AppContext);
  const dispatch = useDispatch();
  const [allowedPaths, setAllowablePaths] = useState({});
  const { quickActionsPanelState, activeModule } = useSelector(({ common }) => common);

  useEffect(() => {
    const option = Object.values(AdminManagementRoutes).find((item) => {
      return item.link === location.pathname;
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
    const feature = stateApp.user?.features?.find((feature) => feature.name === FEATURES.CONTACTSUBMENU);
    // const feature = stateApp.user?.features?.find(feature => feature.name === FEATURES.ANALYTICSSUBMENU);
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
              <Route exact path={allowedPaths[option].link} component={Components[allowedPaths[option].component]} />
            </Switch>
          ))}
        </QuickActionPanel>
      </FeatureFlag>
    </>
  );
}
