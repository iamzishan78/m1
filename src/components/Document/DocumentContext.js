import React, { useState, createContext, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";

// Queries
import { GETWELLSFROMDOCUMENTS } from "graphQL/useQueryGetWellsFromDocument";
import { GETCONTACTSFROMDOCUMENTS } from "graphQL/useQueryGetContactsFromDocument";
import { GET_AGREEMENTS_FROM_DOCUMENTS } from "graphQL/useQueryGetAgreementsFromDocument";
import { GET_CHECKS_FROM_DOCUMENT } from "graphQL/useQueryGetChecksFromDocument";
import { GET_PROPERTIES_FROM_DOCUMENT } from "graphQL/useQueryGetPropertiesFromDocument";

const DocumentContext = createContext([{}, () => {}]);

const DocumentContextProvider = (props) => {
  const [wells, setWells] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [checks, setChecks] = useState([]); // state to manage checks data
  const [properties, setProperties] = useState([]); // state to manage properties data

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

  const [
    getChecksFromDocument,
    { data: checksFromDocument, loading: getChecksLoading },
  ] = useLazyQuery(GET_CHECKS_FROM_DOCUMENT, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const [
    getPropertiesFromDocument,
    { data: propertiesFromDocument, loading: getPropertiesLoading },
  ] = useLazyQuery(GET_PROPERTIES_FROM_DOCUMENT, {
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
  // useEffect to handle check data changes
  useEffect(() => {
    const checkDescriptor =
      checksFromDocument?.getCheckDescriptors;
    setChecks(checkDescriptor?.checks);
  }, [checksFromDocument]);

  // useEffect to handle property data changes
  useEffect(() => {
    const propertyDescriptor =
      propertiesFromDocument?.getPropertyDescriptors;
    setProperties(propertyDescriptor?.properties);
  }, [propertiesFromDocument]);

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
    getChecksFromDocument,
    getChecksLoading,
    checksFromDocument,
    checks,
    setChecks,
    getPropertiesFromDocument,
    getPropertiesLoading,
    propertiesFromDocument,
    properties,
    setProperties,
  };

  return (
    <DocumentContext.Provider value={contextValue}>
      {props.children}
    </DocumentContext.Provider>
  );
};

export { DocumentContext, DocumentContextProvider };
