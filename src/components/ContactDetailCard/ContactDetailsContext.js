import React, { useState, createContext } from "react";

const ContactDetailsContext = createContext([{}, () => {}]);

const ContactDetailsContextProvider = props => {
  const [stateContacts, setStateContacts] = useState({});

  return (
    <ContactDetailsContext.Provider value={[stateContacts, setStateContacts]}>
      {props.children}
    </ContactDetailsContext.Provider>
  );
};

export { ContactDetailsContext, ContactDetailsContextProvider };
