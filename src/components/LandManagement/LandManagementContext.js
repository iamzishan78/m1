import React, { useState, createContext } from "react";

const LandManagementContext = createContext([{}, () => {}]);
createContext([{}, () => {}]);

const LandManagementContextProvider = (props) => {
  const [stateLandManagement, setStateLandManagement] = useState({
    expandedPanel: true,
  });
  return <LandManagementContext.Provider value={[stateLandManagement, setStateLandManagement]}>{props.children}</LandManagementContext.Provider>;
};

export { LandManagementContext, LandManagementContextProvider };
