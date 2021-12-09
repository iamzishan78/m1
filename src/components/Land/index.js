import React, { useEffect } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import QuickActionPanel from "components/Land/components/QuickActionPanel";
import * as Components from "components/Land/components";

//Actions
import { toggleLandActionsPanel } from "actions";

export const SIDE_PANEL_MENU_ITEMS_LIST = {
  PORTFOLIO: {
    title: "Portfolio",
    link: "/land/portfolio",
    component: "Portfolio",
  },
  AGREEMENTS: {
    title: "Agreements",
    link: "/land/agreements",
    component: "Agreements",
  },
  TRACTS: {
    title: "Tracts",
    link: "/land/tracts",
    component: "Tracts",
  },
  REPORTING_GROUPS: {
    title: "Reporting Groups",
    link: "/land/reporting-groups",
    component: "ReportingGroups",
  },
};

export default function Revenue() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { quickActionsPanelState } = useSelector(({ Land }) => Land);

  //   useEffect(() => {
  //     const option = Object.values(SIDE_PANEL_MENU_ITEMS_LIST).find((item) => item.link === location.pathname);
  //     if (option) {
  //       setStateApp((stateApp) => ({
  //         ...stateApp,
  //         revenueDetails: {
  //           ...stateApp.revenueDetails,
  //           title: option.title,
  //         },
  //       }));
  //     }
  //   }, [location.pathname]);

  const handlePanelStateChange = (state) => {
    dispatch(toggleLandActionsPanel(state));
  };

  return (
    <QuickActionPanel handlePanelStateChange={handlePanelStateChange} quickActionsPanelState={quickActionsPanelState}>
      {Object.keys(SIDE_PANEL_MENU_ITEMS_LIST).map((option) => (
        <Switch>
          <Route
            exact
            path={SIDE_PANEL_MENU_ITEMS_LIST[option].link}
            component={Components[SIDE_PANEL_MENU_ITEMS_LIST[option].component]}
          />
        </Switch>
      ))}
    </QuickActionPanel>
  );
}
