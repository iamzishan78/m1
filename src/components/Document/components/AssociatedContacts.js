import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";

//Contexts
import { AppContext } from "AppContext";

import DocumentAssociation from "./DocumentAssociation";
import { DocumentContext } from "../DocumentContext";
import { useMutation } from "@apollo/client";
import { ADD_CONTACT_TO_FILE_DESCRIPTOR } from "graphQL/useMutationAddContactToFileDescriptor";
import { DELETE_CONTACT_FROM_FILE_DESCRIPTOR } from "graphQL/useMutationDeleteContactFromFileDescriptor";

export default function AssociatedContacts({ title }) {
  // Initials
  const [stateApp, setStateApp] = useContext(AppContext);
  let history = useHistory();

  // States
  const [search, setSearch] = useState("");
  const [isSearchActive, setSearchState] = useState(false);

  const {
    getContactsFromDocument,
    contactsFromDocument,
    getContactsLoading,
    contacts,
    setContacts,
  } = React.useContext(DocumentContext);

  const [addContactToFileDescriptor, { loading: addContactsLoading }] =
    useMutation(ADD_CONTACT_TO_FILE_DESCRIPTOR);

  // Mutations
  const [deleteContactFromDescriptor, { loading: deleteContactLoading }] =
    useMutation(DELETE_CONTACT_FROM_FILE_DESCRIPTOR, {
      onCompleted: () =>
        getContactsFromDocument({
          variables: {
            descriptorObject: stateApp.selectedDocument._id,
          },
        }),
    });

  // Fetching contacts from descriptor
  useEffect(() => {
    getContactsFromDocument({
      variables: {
        descriptorObject: stateApp.selectedDocument._id,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // delete contact from File Descriptor
  const deleteContact = async (contactId) => {
    await deleteContactFromDescriptor({
      variables: { descriptorId: stateApp?.selectedDocument?._id, contactId },
    });
  };

  const addSelectedContactToDocument = (contact) => {
    let contactData = {
      ...contact,
      createdBy: stateApp?.user?._id,
    };
    addContactToFileDescriptor({
      variables: {
        descriptorId: stateApp?.selectedDocument?._id,
        contactData: contactData,
      },
      awaitRefetchQueries: true,
    }).then(({ data }) => {
      const descriptorId = data.addContactToFileDescriptor._id;
      const selectedDocument = stateApp.selectedDocument ?? {};
      setStateApp((stateApp) => ({
        ...stateApp,
        selectedDocument: { ...selectedDocument, _id: descriptorId },
      }));
      getContactsFromDocument({
        variables: {
          descriptorObject: descriptorId,
        },
      });
    });
  };

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
    const contactDescriptor = contactsFromDocument?.getContactDescriptors[0];
    let existingContacts = contactDescriptor?.contacts || [];
    if (value !== "") {
      const searchedContacts = existingContacts.filter((contact) =>
        contact.entityDetail.name.toLowerCase().includes(value)
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
        setContacts(contactsFromDocument?.getContactDescriptors[0]?.contacts);
      }}
      setSearchState={setSearchState}
      isSearchActive={isSearchActive}
      search={search}
      setSearch={setSearch}
      relatedObjectType="Contact"
      deleteDescriptorFile={deleteContact}
      getSelectedItem={addSelectedContactToDocument}
      addFileLoading={addContactsLoading}
      deleteFileLoading={deleteContactLoading}
      updateDocumentLoading={getContactsLoading}
      href={`/contact/details/{ID}?tenant={TENANT}`}
    />
  );
}
