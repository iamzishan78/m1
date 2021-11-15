import React, { useContext } from "react";
import { useLocation, Switch, Route, Redirect } from "react-router-dom";
import RevenueActionsPanel from "./QuickActionsPanel";
import * as Components from "./components";

export const SIDE_PANEL_MENU_ITEMS_LIST = {
  PORTFOLIO: {
    text: "Portfolio",
    link: "/revenue/portfolio",
    component: "Portfolio",
  },
  PROPERTY_MASTER: {
    text: "Property Master",
    link: "/revenue/property-master",
    component: "PropertyMaster",
  },
};

export default function Revenue() {
  const location = useLocation();

  return (
    <RevenueActionsPanel>
      {Object.keys(SIDE_PANEL_MENU_ITEMS_LIST).map((option) => (
        <Switch>
          <Route
            // exact
            path={SIDE_PANEL_MENU_ITEMS_LIST[option].link}
            component={Components[SIDE_PANEL_MENU_ITEMS_LIST[option].component]}
          />
          {/* <Redirect to={SIDE_PANEL_MENU_ITEMS_LIST.PORTFOLIO.link} /> */}
        </Switch>
      ))}
    </RevenueActionsPanel>
  );
}
