import React, { useState, createContext } from "react";

const AgreementDetailContext = createContext([{}, () => {}]);

const AgreementDetailContextProvider = (props) => {
  const [stateDocument, setStateDocument] = useState({
    openDialog: false,
  });
  return <AgreementDetailContext.Provider value={[stateDocument, setStateDocument]}>{props.children}</AgreementDetailContext.Provider>;
};

export { AgreementDetailContext, AgreementDetailContextProvider };
