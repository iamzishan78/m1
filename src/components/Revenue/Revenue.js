import React from "react";
import { Switch, Route } from "react-router-dom";
import RevenueActionsPanel from "./QuickActionsPanel";
import * as Components from "./components";

export const SIDE_PANEL_MENU_ITEMS_LIST = {
  // PORTFOLIO: {
  //   text: "Portfolio",
  //   link: "/revenue/portfolio",
  //   component: "Portfolio",
  // },
  // PROPERTY_MASTER: {
  //   text: "Property Master",
  //   link: "/revenue/property-master",
  //   component: "PropertyMaster",
  // },
  REVENUE_STATEMENTS: {
    text: "Revenue Statements",
    link: "/revenue/statements",
    component: "RevenueStatements",
  },
};

export default function Revenue() {
  return (
    <RevenueActionsPanel>
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
