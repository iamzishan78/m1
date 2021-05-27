import React, { useState, createContext } from "react";

const DocumentContext = createContext([{}, () => {}]);

const DocumentContextProvider = (props) => {
  const [stateDocument, setStateDocument] = useState({
    openDialog: false,
  });
  return (
    <DocumentContext.Provider value={[stateDocument, setStateDocument]}>
      {props.children}
    </DocumentContext.Provider>
  );
};

export { DocumentContext, DocumentContextProvider };
