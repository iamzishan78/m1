import React, { useEffect, useState } from "react";
import { Switch, Route, useLocation, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import QuickActionPanel from "components/Land/components/QuickActionPanel";
import * as Components from "components/Land/components";
import { replaceLinkId } from "components/Shared/functions";
import { ALL_CUSTOM_ASSET_INFO } from "graphQL/useQueryAllCustomAssetInfo"
import { useLazyQuery } from "@apollo/client";

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
  // ADVANCED_SEARCH: {
  //   featureFlag: "LANDMODULE",
  //   title: "Advanced Search",
  //   link: "/land/search",
  //   component: "AdvancedSearch",
  //   hideSearch: true,
  // },
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
  const [sidePanelMenuList, setSidePanelMenuList] = useState(SIDE_PANEL_MENU_ITEMS_LIST);

  // Query for getting all custom assets
  const [getAllCustomAsset, { data: allCustomAsset }] = useLazyQuery(ALL_CUSTOM_ASSET_INFO, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    const option = Object.values(sidePanelMenuList).find((item) => {
      const path = location.pathname;
      if (item.link.includes(":id")) {
        return replaceLinkId(item.link, path);
      }
      return path.startsWith(item.link);
    });
    if (option?.parent) {
      dispatch(setActiveModule(sidePanelMenuList[option.parent]));
    } else if (option) {
      dispatch(setActiveModule(option));
    }
  }, [location.pathname, dispatch]);

  useEffect(() => {
    // Get all custom assets
    getAllCustomAsset()
  }, [])

  useEffect(() => {
    if (allCustomAsset) {
      const dynamicAsset = allCustomAsset?.getAllCustomAssetInfo?.res;

      // Set dynamic assets in side panel
      setSidePanelMenuList(prevList => {
        const newList = { ...prevList };
        dynamicAsset.forEach(item => {
          const key = item.tableName.replace(/\s+/g, '_').toUpperCase();
          newList[key] = {
            featureFlag: "LANDMODULE",
            title: item.tableName,
            link: `/land/${item.tableName.replace(/\s+/g, '').toLowerCase()}`,
            component: "DynamicAssetGrid"
          };
        });
        return newList;
      });
    }
  }, [allCustomAsset]);

  const handlePanelStateChange = (state) => {
    dispatch(toggleQuickActionsPanel(state));
  };

  return (
    <QuickActionPanel
      title="Asset Management"
      handlePanelStateChange={handlePanelStateChange}
      quickActionsPanelState={quickActionsPanelState}
      activeModule={activeModule}
      actions={sidePanelMenuList}
    >
      <Switch>
        {Object.keys(sidePanelMenuList).map((option) => (
          <Route
            exact
            path={sidePanelMenuList[option].link}
            component={Components[sidePanelMenuList[option].component]}
          />
        ))}
        <Redirect to={`/land/agreements`} />
      </Switch>
    </QuickActionPanel>
  );
}
