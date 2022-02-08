import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route, useLocation } from "react-router-dom";
import RevenueActionsPanel from "./QuickActionsPanel";
import * as Components from "components/Revenue/components";

import { setActiveModule, toggleActionsPanel } from "actions";

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
  REVENUE_PROPERTY_DETAILS: {
    isExcluded: true,
    title: "Properties",
    link: "/revenue/property/details/:id",
    component: "RevenuePropertyDetails",
  },
  REVENUE_STATEMENTS: {
    title: "Revenue Statements",
    link: "/revenue/statements",
    component: "RevenueStatements",
  },
  REVENUE_STATEMENT_DETAILS: {
    isExcluded: true,
    title: "Revenue Statements",
    link: "/revenue/statement/details",
    component: "RevenueStatementDetails",
  },
  REVENUE_STATEMENT_LINE_ITEM: {
    isExcluded: true,
    title: "Revenue Statements",
    link: "/revenue/statement/:id/line-item",
    component: "RevenueStatementLineItem",
  },
};

const replaceId = (link, path) => {
  const linkSplitted = link.split('/');
  const pathSplitted = path.split('/');
  for(let i = 0; i < linkSplitted.length; i++){
    if(linkSplitted[i] !== pathSplitted[i] && linkSplitted[i] !== ':id'){
      return false
    }
  }
  return true
}

export default function Revenue() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { actionsPanelState, activeModule } = useSelector((state) => state.Revenue);

  useEffect(() => {
    const option = Object.values(SIDE_PANEL_MENU_ITEMS_LIST).find((item) => {
      const path = location.pathname;
      if(item.link.includes(':id')){
        return replaceId(item.link, path)
      }
      return path.startsWith(item.link)
    });
    if (option) {
      dispatch(setActiveModule(option));
    }
  }, [location.pathname, dispatch]);

  const handlePanelStateChange = () => {
    dispatch(toggleActionsPanel(!actionsPanelState));
  };

  return (
    <RevenueActionsPanel handlePanelStateChange={handlePanelStateChange} expandedPanel={actionsPanelState} activeModule={activeModule}>
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
