import React, { useState, createContext } from "react";

const ActivitiesContext = createContext([{}, () => {}]);

const ActivitiesContextProvider = (props) => {
  const [stateActivities, setStateActivities] = useState({
    openDialog: false,
  });

  return (
    <ActivitiesContext.Provider value={[stateActivities, setStateActivities]}>
      {props.children}
    </ActivitiesContext.Provider>
  );
};

export { ActivitiesContext, ActivitiesContextProvider };
