import React, { useState, createContext } from "react";

const ContactsContext = createContext([{}, () => {}]);

const ContactsContextProvider = props => {
  const [stateContacts, setStateContacts] = useState({});

  return (
    <ContactsContext.Provider value={[stateContacts, setStateContacts]}>
      {props.children}
    </ContactsContext.Provider>
  );
};

export { ContactsContext, ContactsContextProvider };
