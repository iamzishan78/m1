import React, { useState, createContext, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";

// Queries
import { GETWELLSFROMDOCUMENTS } from 'graphQL/useQueryGetWellsFromDocument'


const DocumentContext = createContext([{}, () => { }]);

const DocumentContextProvider = (props) => {
  const [wells, setWells] = useState([]);

  //Queries
  const [getWellsFromDocument, { data: wellsFromDocument, loading: getWellsLoading }] = useLazyQuery(GETWELLSFROMDOCUMENTS, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  useEffect(() => {
    const wellDescriptor = wellsFromDocument?.getWellDescriptors[0]
    setWells(wellDescriptor?.wells)
  }, [wellsFromDocument])

  return (
    <DocumentContext.Provider value={{ getWellsFromDocument, wells, getWellsLoading, wellsFromDocument, setWells }}>
      {props.children}
    </DocumentContext.Provider>
  );
};

export { DocumentContext, DocumentContextProvider };
