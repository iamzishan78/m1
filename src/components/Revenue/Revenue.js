import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import RevenueActionsPanel from "./QuickActionsPanel";
import * as Components from "./components";

export const SIDE_PANEL_MENU_ITEMS_LIST = {
  PORTFOLIO: {
    text: "Portfolio",
    link: "/revenue/portfolio",
    component: "Portfolio",
  },
  PROPERTY_MASTER: {
    text: "Property Master",
    link: "/revenue/property-master",
    component: "PropertyMaster",
  },
};

export default function Revenue() {
  const location = useLocation();
  const [pathname, setPathname] = useState();

  useEffect(() => {
    setPathname(location.pathname);
  }, [location.pathname]);

  const getChildComponent = () => {
    const option = Object.values(SIDE_PANEL_MENU_ITEMS_LIST).find((option) => option.link === pathname);
    return option.component;
  };

  return <>{pathname ? <RevenueActionsPanel>{Components[getChildComponent()]()}</RevenueActionsPanel> : <></>}</>;
}
