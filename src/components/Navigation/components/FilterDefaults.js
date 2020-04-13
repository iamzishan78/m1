import React, { useContext, useEffect } from "react";
import { NavigationContext } from "../NavigationContext";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

export default function FilterDedaults() {
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [tabsValue, setTabsValue] = React.useState(2);

  const handleChange = (event, newValue) => {
    setTabsValue(newValue);
  };

  useEffect(() => {
    if (stateNav) {
      const stateNavActiveProperties = Object.entries(stateNav).filter(
        ([k, v], i) => !!v
      );
      // setStateNav
    }
  }, [stateNav]);

  return (
    <div>
      <Tabs
        value={tabsValue}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        aria-label="disabled tabs example"
      >
        <Tab label="Saved Search" />
        <Tab label="Current Search"/>
      </Tabs>
    </div>
  );
}
