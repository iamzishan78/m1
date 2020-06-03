import React, { useState, createContext } from "react";

const DashboardContext = createContext([{}, () => {}]);

const DashboardContextProvider = (props) => {
  const [stateDashboard, setStateDashboard] = useState({
    selectedWell: { WellName: "" },
    userhandle: "m1neraltech",
    cardIndices: [{ key: null, index: null }],
  });
  return (
    <DashboardContext.Provider value={[stateDashboard, setStateDashboard]}>
      {props.children}
    </DashboardContext.Provider>
  );
};

export { DashboardContext, DashboardContextProvider };
