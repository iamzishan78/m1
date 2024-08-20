import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";

//Contexts
import { AppContext } from "AppContext";

import DocumentAssociation from "./DocumentAssociation";

export default function AssociatedContacts({ title }) {
  // Initials
  const [stateApp, setStateApp] = useContext(AppContext);
  let history = useHistory();

  // States
  const [search, setSearch] = useState("");
  const [isSearchActive, setSearchState] = useState(false);
  const [contacts, setContacts] = useState(
    stateApp.selectedDocument?.contacts || []
  );

  useEffect(() => {
    setContacts(stateApp.selectedDocument?.contacts || []);
  }, [stateApp.selectedDocument?.contacts]);

  // sending to Contacts page
  const goToContact = (contact) => {
    const tenantName = window.sessionStorage.getItem("tenantName");
    history.push(
      `/contact/details/${contact?._id.toLowerCase()}?tenant=${tenantName}`
    );
    setStateApp({ ...stateApp, DocumentDrawer: false, selectedDocument: {} });
  };

  // searching existing Contact
  const searchExistingContacts = (value) => {
    setSearch(value);
    let existingContacts = stateApp.selectedDocument.contacts;
    if (value !== "") {
      const searchedContacts = existingContacts.filter((contact) =>
        contact.name.toLowerCase().includes(value.toLowerCase())
      );
      setContacts(searchedContacts);
    } else {
      setContacts(existingContacts);
    }
  };
  return (
    <DocumentAssociation
      title={"Contacts"}
      items={contacts}
      navigateTo={goToContact}
      esFilter={[]}
      esFields={["name"]}
      esIndex="contacts_flat"
      searchExistingItems={searchExistingContacts}
      onSearchBlur={() => {
        setTimeout(() => {
          setSearchState(false);
        }, 300);
        setContacts(stateApp.selectedDocument.contacts);
      }}
      setSearchState={setSearchState}
      isSearchActive={isSearchActive}
      search={search}
      setSearch={setSearch}
      relatedObjectType="Contact"
    />
  );
}
