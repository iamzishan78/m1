import React, { useState, createContext } from "react";

const AgreementContext = createContext([{}, () => {}]);

const AgreementContextProvider = (props) => {
  const [stateDocument, setStateDocument] = useState({
    openDialog: false,
  });
  return <AgreementContext.Provider value={[stateDocument, setStateDocument]}>{props.children}</AgreementContext.Provider>;
};

export { AgreementContext, AgreementContextProvider };
