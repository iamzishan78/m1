import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route, useLocation, Redirect } from "react-router-dom";
import RevenueActionsPanel from "./QuickActionsPanel";
import * as Components from "components/Revenue/components";

import { replaceLinkId } from "components/Shared/functions";
import { setActiveModule, toggleQuickActionsPanel } from "store/actions/commonActions";

export const SIDE_PANEL_MENU_ITEMS_LIST = {
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
  REPORTING_GROUPS: {
    title: "Reporting Groups",
    link: "/revenue/reporting-groups",
    component: "ReportingGroups",
  },
  ADMIN_SETTINGS: {
    title: "Admin Settings",
    link: "/revenue/admin-settings",
    component: "AdminSettings",
  },
  REVENUE_PROPERTY_DETAILS: {
    isExcluded: true,
    parent: "PROPERTIES",
    title: "Properties",
    link: "/revenue/property/details/:id",
    component: "RevenuePropertyDetails",
  },
  REVENUE_STATEMENT_DETAILS: {
    isExcluded: true,
    parent: "REVENUE_STATEMENTS",
    title: "Revenue Statements",
    link: "/revenue/statement/details/:id",
    component: "RevenueStatementDetails",
  },
  REVENUE_STATEMENT_LINE_ITEM: {
    isExcluded: true,
    parent: "REVENUE_STATEMENTS",
    title: "Revenue Statements",
    link: "/revenue/statement/details/:id/line-item",
    component: "RevenueStatementDetails",
  },
};

export default function Revenue() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { quickActionsPanelState, activeModule } = useSelector(({ common }) => common);

  useEffect(() => {
    const option = Object.values(SIDE_PANEL_MENU_ITEMS_LIST).find((item) => {
      const path = location.pathname;
      if (item.link.includes(":id")) {
        return replaceLinkId(item.link, path);
      }
      return path.startsWith(item.link);
    });
    if (option?.parent) {
      dispatch(setActiveModule(SIDE_PANEL_MENU_ITEMS_LIST[option.parent]));
    } else if (option) {
      dispatch(setActiveModule(option));
    }
  }, [location.pathname, dispatch]);

  const handlePanelStateChange = () => {
    dispatch(toggleQuickActionsPanel(!quickActionsPanelState));
  };

  return (
    <RevenueActionsPanel handlePanelStateChange={handlePanelStateChange} expandedPanel={quickActionsPanelState} activeModule={activeModule}>
      <Switch>
        {Object.keys(SIDE_PANEL_MENU_ITEMS_LIST).map((option) => (
          <Route
            exact
            path={SIDE_PANEL_MENU_ITEMS_LIST[option].link}
            component={Components[SIDE_PANEL_MENU_ITEMS_LIST[option].component]}
          />
        ))}
        <Redirect to={`/revenue/statements`} />
      </Switch>
    </RevenueActionsPanel>
  );
}
