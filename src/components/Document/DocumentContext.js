import React, { useState, createContext, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";

// Queries
import { GETWELLSFROMDOCUMENTS } from "graphQL/useQueryGetWellsFromDocument";
import { GETCONTACTSFROMDOCUMENTS } from "graphQL/useQueryGetContactsFromDocument";
import { GET_AGREEMENTS_FROM_DOCUMENTS } from "graphQL/useQueryGetAgreementsFromDocument";

const DocumentContext = createContext([{}, () => {}]);

const DocumentContextProvider = (props) => {
  const [wells, setWells] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [shapes, setShapes] = useState([]);

  //Queries
  const [
    getWellsFromDocument,
    { data: wellsFromDocument, loading: getWellsLoading },
  ] = useLazyQuery(GETWELLSFROMDOCUMENTS, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const [
    getContactsFromDocument,
    { data: contactsFromDocument, loading: getContactsLoading },
  ] = useLazyQuery(GETCONTACTSFROMDOCUMENTS, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const [
    getAgreementsFromDocument,
    { data: agreementsFromDocument, loading: getAgreementsLoading },
  ] = useLazyQuery(GET_AGREEMENTS_FROM_DOCUMENTS, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  useEffect(() => {
    const wellDescriptor = wellsFromDocument?.getWellDescriptors[0];
    setWells(wellDescriptor?.wells);
  }, [wellsFromDocument]);

  useEffect(() => {
    const contactDescriptor = contactsFromDocument?.getContactDescriptors[0];
    setContacts(contactDescriptor?.contacts);
  }, [contactsFromDocument]);

  useEffect(() => {
    const agreementDescriptor =
      agreementsFromDocument?.getAgreementDescriptors[0];
    setShapes(agreementDescriptor?.shapeObj);
  }, [agreementsFromDocument]);

  const contextValue = {
    getWellsFromDocument,
    wells,
    getWellsLoading,
    wellsFromDocument,
    setWells,
    getContactsFromDocument,
    contactsFromDocument,
    getContactsLoading,
    contacts,
    setContacts,
    getAgreementsFromDocument,
    getAgreementsLoading,
    agreementsFromDocument,
    shapes,
    setShapes,
  };

  return (
    <DocumentContext.Provider value={contextValue}>
      {props.children}
    </DocumentContext.Provider>
  );
};

export { DocumentContext, DocumentContextProvider };
