import React, { useContext, useEffect, useState } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";

// import { toggleQuickActionsPanel, setActiveModule } from "store/actions/contactActions";
import { setActiveModule, toggleQuickActionsPanel } from "store/actions/commonActions";
import { AppContext } from "AppContext";
import { FEATURES } from "components/Shared/FeatureFlag/common";

import RevenueAnalytics from "components/Analytics/components/Revenue";
import LandAnalytics from "components/Analytics/components/Land";
import ActivitiesDashboard from "components/Activities/components/ActivitiesDashboard";
import RigsCard from "components/Dashboard/components/RigsCard";
import PermitsCard from "components/Dashboard/components/PermitsCard";
import ProdCard from "components/Dashboard/components/ProdCard";
import FeatureFlag from "components/Shared/FeatureFlag/FeatureFlagComponent";
import QuickActionPanel from "components/Land/components/QuickActionPanel";
import Grid from "@material-ui/core/Grid";
import { Tab, Tabs } from "@material-ui/core";
import FilterIcon from "components/Shared/svgIcons/filter";
import ViewColumnIcon from "components/Shared/svgIcons/view_column";
import { analyticsManagementRoutes } from "utils/data";

const Components = {
  Land: LandAnalytics,
  Revenue: RevenueAnalytics,
  ActivitiesDashboard: ActivitiesDashboard,
  RigsCard: RigsCard,
  PermitsCard: PermitsCard,
  ProdCard: ProdCard,
};

export default function Analytics() {
  const location = useLocation();
  const [stateApp] = useContext(AppContext);
  const dispatch = useDispatch();
  const [allowedPaths, setAllowablePaths] = useState({});
  const { quickActionsPanelState, activeModule } = useSelector(({ common }) => common);

  useEffect(() => {
    const option = Object.values(analyticsManagementRoutes).find((item) => {
      return item.link === location.pathname;
    });
    if (option) {
      dispatch(setActiveModule(option));
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
        // PanelAction={PanelAction}
        >
          {Object.keys(allowedPaths).map((option) => (
            <Switch>
              <Route exact path={allowedPaths[option].link} component={Components[allowedPaths[option].component]} />
            </Switch>
          ))}
        </QuickActionPanel>
      </FeatureFlag>
    </>
  );
}

const PanelAction = () => {
  const [tab, setTab] = useState(0);
  const a11yProps = (index) => ({
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  });
  const layerIcons = React.useMemo(() => {
    return [
      {
        action: "layer",
        icon: <FilterIcon fill="#fff" fontSize="medium" />,
      },
      {
        action: "heatMaps",
        icon: <ViewColumnIcon fill="#fff" fontSize="medium" />,
      },
    ];
  }, []);

  return (
    <StyledMenuHActionHeader>
      <Grid container direction="row" justify="space-between" alignItems="center">
        <Grid item>
          <Tabs value={tab} aria-label="find-map-tabs" indicatorColor="primary" textColor="primary" variant="fullWidth">
            {layerIcons.map((action, index) => (
              <Tab icon={action.icon} {...a11yProps(index)} onClick={() => setTab(index)} />
            ))}
          </Tabs>
        </Grid>
      </Grid>
    </StyledMenuHActionHeader>
  );
};

const StyledMenuHActionHeader = withStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "flex-start",
    backgroundColor: "#0e111a !important",
    minHeight: "53px !important",
    "&>.MuiTouchRipple-root": {
      borderBottom: "5px solid #263451",
      marginBottom: "6px",
    },
    "& .MuiTabs-root": {
      "& .MuiTabs-scroller": {
        "& .MuiTabs-flexContainer": {
          width: "150px",
          "& .MuiButtonBase-root": {
            minWidth: "0px !important",
          },
          "& .MuiTab-textColorPrimary": {
            color: "white",
          },
        },
      },
      "& .MuiTabs-indicator": {
        // marginLeft: "6px",
        height: "5px",
        // width: "25px !important",
        backgroundColor: "#1CB6DA",
        zIndex: 1,
      },
    },
  },
}))(MenuItem);
