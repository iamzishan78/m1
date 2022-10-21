import React, { useState, createContext } from "react";

const DrawerContext = createContext([null, () => {}]);

const DrawerContextProvider = (props) => {
  const [drawer, setDrawer] = useState(null);

  return <DrawerContext.Provider value={[drawer, setDrawer]}>{props.children}</DrawerContext.Provider>;
};

export { DrawerContext, DrawerContextProvider };
