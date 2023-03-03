import React, { useState, createContext } from "react";

const AdminsContext = createContext([{}, () => {}]);

const AdminsContextProvider = props => {
  const [stateAdmins, setStateAdmins] = useState({});

  return (
      <AdminsContext.Provider value={[stateAdmins, setStateAdmins]}>
        {props.children}
      </AdminsContext.Provider>
  );
};

export { AdminsContext, AdminsContextProvider };
