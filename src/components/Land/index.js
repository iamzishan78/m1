import React, { useEffect } from "react";
import { Switch, Route, useLocation, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import QuickActionPanel from "components/Land/components/QuickActionPanel";
import * as Components from "components/Land/components";
import { replaceLinkId } from "components/Shared/functions";

//Actions
import { toggleQuickActionsPanel, setActiveModule } from "store/actions/commonActions";

export const SIDE_PANEL_MENU_ITEMS_LIST = {
  // PORTFOLIO: {
  //   featureFlag: "LANDPORTFOLIO",
  //   title: "Portfolio",
  //   link: "/land/portfolio",
  //   component: "Portfolio",
  // },
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
  UNIT: {
    featureFlag: "LANDMODULE",
    title: "Units",
    link: "/land/units",
    component: "Units",
  },
  WELLS: {
    featureFlag: "LANDMODULE",
    title: "Wells",
    link: "/land/wells",
    component: "Wells",
  },
  WELL_DETAILS: {
    featureFlag: "LANDMODULE",
    title: "Wells",
    link: "/land/well/details/:id",
    parent: "WELLS",
    component: "Wells",
    isExcluded: true,
  },
  // REPORTING_GROUPS: {
  //   featureFlag: "LANDREPORTINGGROUPS",
  //   title: "Reporting Groups",
  //   link: "/land/reporting-groups",
  //   component: "ReportingGroups",
  //   hideSearch: true,
  // },
};

export default function Land() {
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

  const handlePanelStateChange = (state) => {
    dispatch(toggleQuickActionsPanel(state));
  };

  return (
    <QuickActionPanel
      title="Asset Management"
      handlePanelStateChange={handlePanelStateChange}
      quickActionsPanelState={quickActionsPanelState}
      activeModule={activeModule}
      actions={SIDE_PANEL_MENU_ITEMS_LIST}
    >
      <Switch>
        {Object.keys(SIDE_PANEL_MENU_ITEMS_LIST).map((option) => (
          <Route
            exact
            path={SIDE_PANEL_MENU_ITEMS_LIST[option].link}
            component={Components[SIDE_PANEL_MENU_ITEMS_LIST[option].component]}
          />
        ))}
        <Redirect to={`/land/agreements`} />
      </Switch>
    </QuickActionPanel>
  );
}
