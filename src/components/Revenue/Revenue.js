import React, { useEffect, useContext } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import RevenueActionsPanel from "./QuickActionsPanel";
import * as Components from "components/Revenue/components";

import { AppContext } from "AppContext";

export const SIDE_PANEL_MENU_ITEMS_LIST = {
  PORTFOLIO: {
    title: "Portfolio",
    link: "/revenue/portfolio",
    component: "Portfolio",
  },
  PROPERTIES: {
    title: "Properties",
    link: "/revenue/properties",
    component: "Properties",
  },
  REVENUE_STATEMENTS: {
    title: "Revenue Statements",
    link: "/revenue/statements",
    component: "RevenueStatements",
  },
};

export default function Revenue() {
  const location = useLocation();
  const [stateApp, setStateApp] = useContext(AppContext);

  useEffect(() => {
    const option = Object.values(SIDE_PANEL_MENU_ITEMS_LIST).find((item) => item.link === location.pathname);
    if (option) {
      setStateApp((stateApp) => ({
        ...stateApp,
        revenueDetails: {
          ...stateApp.revenueDetails,
          title: option.title,
        },
      }));
    }
  }, [location.pathname, setStateApp]);

  const handlePanelStateChange = () => {
    setStateApp((stateApp) => ({
      ...stateApp,
      revenueDetails: {
        ...stateApp.revenueDetails,
        expandedPanel: !stateApp.revenueDetails.expandedPanel,
      },
    }));
  };

  return (
    <RevenueActionsPanel handlePanelStateChange={handlePanelStateChange} expandedPanel={stateApp.revenueDetails.expandedPanel}>
      {Object.keys(SIDE_PANEL_MENU_ITEMS_LIST).map((option) => (
        <Switch>
          <Route
            exact
            path={SIDE_PANEL_MENU_ITEMS_LIST[option].link}
            component={Components[SIDE_PANEL_MENU_ITEMS_LIST[option].component]}
          />
        </Switch>
      ))}
    </RevenueActionsPanel>
  );
}
