import React, { useContext, useEffect, useState } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { setActiveModule, toggleQuickActionsPanel } from "store/actions/commonActions";
import { AppContext } from "AppContext";
import { FEATURES } from "components/Shared/FeatureFlag/common";

import RevenueAnalytics from "components/Analytics/components/Revenue";
import LandAnalytics from "components/Analytics/components/Land";
import ActivitiesDashboard from "components/Activities/components/ActivitiesDashboard";
import AuditReporting from "components/AuditReporting/AuditReporting";
import RigsCard from "components/Dashboard/components/RigsCard";
import PermitsCard from "components/Dashboard/components/PermitsCard";
import ProdCard from "components/Dashboard/components/ProdCard";
import AdvancedSearch from "components/Land/components/AdvancedSearch";
import FeatureFlag from "components/Shared/FeatureFlag/FeatureFlagComponent";
import QuickActionPanel from "components/Land/components/QuickActionPanel";
import { analyticsManagementRoutes } from "utils/data";
import { RevenuePropertyDetails } from "components/Revenue/components";

const Components = {
  Land: LandAnalytics,
  Revenue: RevenueAnalytics,
  ActivitiesDashboard,
  RigsCard: RigsCard,
  PermitsCard: PermitsCard,
  ProdCard: ProdCard,
  RevenuePropertyDetails,
  AdvancedSearch: AdvancedSearch,
  AuditReporting: AuditReporting,
};

export default function Analytics() {
  const location = useLocation();
  const [stateApp] = useContext(AppContext);
  const dispatch = useDispatch();
  const [allowedPaths, setAllowablePaths] = useState({});
  const { quickActionsPanelState, activeModule } = useSelector(({ common }) => common);
  const [isDetailView, setDetailView] = useState(false)
  const [propertyDetailRoute,  setpropertyDetailPath] = useState(analyticsManagementRoutes.REVENUE_PROPERTY_DETAILS)

  useEffect(() => {
    let option = Object.values(analyticsManagementRoutes).find((item) => {
      return item.link === location.pathname;
    });
    if (location.pathname.includes('/property/details/')) {
      dispatch(setActiveModule(propertyDetailRoute)); 
      setDetailView(true)
    } 
    if (option) {
      dispatch(setActiveModule(option));
      setDetailView(false)
    }
  }, [location.pathname]);

  const handlePanelStateChange = (state) => {
    dispatch(toggleQuickActionsPanel(state));
  };

  const sidePanelOptions = React.useMemo(() => {
    const options = {};
    Object.keys(allowedPaths).forEach((key) => {
      if (!allowedPaths[key].isExcluded) {
        options[key] = allowedPaths[key];
      }
    });
    return options;
  }, [allowedPaths]);

  useEffect(() => {
    const allPaths = JSON.parse(JSON.stringify(analyticsManagementRoutes));
    const feature = stateApp.user?.features?.find((feature) => feature.name === FEATURES.ANALYTICS);
    const allAllowedPaths = {};
    if (feature?.JSON) {
      const data = JSON.parse(feature.JSON);
      Object.keys(allPaths).forEach((path) => {
        if (data.options.includes(allPaths[path].value)) {
          allAllowedPaths[path] = allPaths[path];
        }
      });
    }
    setAllowablePaths(allAllowedPaths);
  }, [stateApp?.user]);

  return (
    <>
      <FeatureFlag feature={FEATURES.ANALYTICS}>
        <QuickActionPanel
          title="Analytics"
          handlePanelStateChange={handlePanelStateChange}
          quickActionsPanelState={quickActionsPanelState}
          activeModule={activeModule}
          actions={sidePanelOptions}
        >
          {Object.keys(allowedPaths).map((option, index) => {
          return(<Switch>
              <Route exact path={(isDetailView && index === 1) ? propertyDetailRoute?.link : allowedPaths[option].link} component={Components[isDetailView ? propertyDetailRoute.component : allowedPaths[option].component]} />
            </Switch>)
          })}
        </QuickActionPanel>
      </FeatureFlag>
    </>
  );
}
