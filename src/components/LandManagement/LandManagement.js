import React, { useEffect, useContext } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import LandManagementActionsPanel from "./QuickActionsPanel";
import * as Components from "components/LandManagement/components";

import { AppContext } from "AppContext";

export const SIDE_PANEL_MENU_ITEMS_LIST = {
  PORTFOLIO: {
    title: "Portfolio",
    link: "/landmanagement/portfolio",
    component: "Portfolio",
  },
  AGREEMENTS: {
    title: "Agreements",
    link: "/landmanagement/agreements",
    component: "Agreements",
  },
  AGREEMENT_DETAILS: {
    isExcluded: true,
    title: "LandManagement Agreement",
    link: "/landmanagement/agreement/details",
    component: "AgreementDetails",
  },
  TRACTS: {
    title: "Tracts",
    link: "/landmanagement/tracts",
    component: "Tracts",
  }
};

export default function LandManagement() {
  const location = useLocation();
  const [stateApp, setStateApp] = useContext(AppContext);

  useEffect(() => {
    const option = Object.values(SIDE_PANEL_MENU_ITEMS_LIST).find((item) => item.link === location.pathname);
    if (option) {
      setStateApp((stateApp) => ({
        ...stateApp,
        landManagement: {
          ...stateApp.landManagement,
          title: option.title,
        },
      }));
    }
  }, [location.pathname, setStateApp]);

  const handlePanelStateChange = () => {
    setStateApp((stateApp) => ({
      ...stateApp,
      landManagement: {
        ...stateApp.landManagement,
        expandedPanel: !stateApp.landManagement.expandedPanel,
      },
    }));
  };

  return (
    <LandManagementActionsPanel handlePanelStateChange={handlePanelStateChange} expandedPanel={stateApp.landManagement.expandedPanel}>
      {Object.keys(SIDE_PANEL_MENU_ITEMS_LIST).map((option) => (
        <Switch>
          <Route
            exact
            path={SIDE_PANEL_MENU_ITEMS_LIST[option].link}
            component={Components[SIDE_PANEL_MENU_ITEMS_LIST[option].component]}
          />
        </Switch>
      ))}
    </LandManagementActionsPanel>
  );
}
