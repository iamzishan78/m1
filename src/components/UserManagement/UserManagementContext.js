import React, { createContext, useState, useEffect } from "react";

const UserManagementContext = createContext([{}, () => {}]);
const UserManagementContextProvider = (props) => {

  const [stateUsers, setStateUsers] = useState({
    users: null,
    isImageModalOpen: false,
    isSaving:false,
  });

  return (
    <UserManagementContext.Provider value={[stateUsers, setStateUsers]}>
      {props.children}
    </UserManagementContext.Provider>
  );
};

export { UserManagementContext, UserManagementContextProvider };