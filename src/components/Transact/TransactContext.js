import React, { useState, createContext } from "react";

const TransactContext = createContext([{}, () => {}]);

const TransactContextProvider = (props) => {
  const [stateTransact, setStateTransact] = useState({
    openDialog: false,
    profilesInfo: {},
    selectedTask: {},
    projects: [],
  });
  return <TransactContext.Provider value={[stateTransact, setStateTransact]}>{props.children}</TransactContext.Provider>;
};

export { TransactContext, TransactContextProvider };
