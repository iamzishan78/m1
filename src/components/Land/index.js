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
    parent: "AGREEMENTS",
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
    const option = Object.values(SIDE_PANEL_MENU_ITEMS_LIST).find((item) => {
      const path = location.pathname;
      if (item.link.includes(':id')) {
        return replaceId(item.link, path)
      }
      return path.startsWith(item.link)
    });
    if (option?.parent) {
      dispatch(setActiveModuleLand(SIDE_PANEL_MENU_ITEMS_LIST[option.parent]));
    } else if (option) {
      dispatch(setActiveModuleLand(option));
    }
  }, [location.pathname, dispatch]);

  const replaceId = (link, path) => {
    const linkSplitted = link.split('/');
    const pathSplitted = path.split('/');
    for (let i = 0; i < linkSplitted.length; i++) {
      if (linkSplitted[i] !== pathSplitted[i] && linkSplitted[i] !== ':id') {
        return false
      }
    }
    return true
  }

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
