import React, { useEffect } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import QuickActionPanel from "components/Land/components/QuickActionPanel";
import * as Components from "components/Land/components";

//Actions
import { toggleLandActionsPanel, setActiveModuleLand } from "actions";

export const SIDE_PANEL_MENU_ITEMS_LIST = {
  PORTFOLIO: {
    featureFlag: "LANDPORTFOLIO",
    title: "Portfolio",
    link: "/land/portfolio",
    component: "Portfolio",
  },
  AGREEMENTS: {
    featureFlag: "LANDMODULE",
    title: "Agreements",
    link: "/land/agreements",
    component: "Agreements",
  },
  AGREEMENT_DETAIL: {
    isExcluded: true,
    title: "Agreements",
    link: "/land/agreement/details/:id",
    component: "AgreementDetails",
  },
  TRACTS: {
    featureFlag: "LANDMODULE",
    title: "Tracts",
    link: "/land/tracts",
    component: "Tracts",
  },
  REPORTING_GROUPS: {
    featureFlag: "LANDREPORTINGGROUPS",
    title: "Reporting Groups",
    link: "/land/reporting-groups",
    component: "ReportingGroups",
  },
};

export default function Revenue() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { quickActionsPanelState, activeModule } = useSelector(({ Land }) => Land);

  useEffect(() => {
    const option = Object.values(SIDE_PANEL_MENU_ITEMS_LIST).find((item) => location.pathname.startsWith(item.link));
    if (option) {
      dispatch(setActiveModuleLand(option));
    }
  }, [location.pathname, dispatch]);

  const handlePanelStateChange = (state) => {
    dispatch(toggleLandActionsPanel(state));
  };

  return (
    <QuickActionPanel handlePanelStateChange={handlePanelStateChange} quickActionsPanelState={quickActionsPanelState} activeModule={activeModule}>
      {Object.keys(SIDE_PANEL_MENU_ITEMS_LIST).map((option) => (
        <Switch>
          <Route
            path={SIDE_PANEL_MENU_ITEMS_LIST[option].link}
            component={Components[SIDE_PANEL_MENU_ITEMS_LIST[option].component]}
          />
        </Switch>
      ))}
    </QuickActionPanel>
  );
}
