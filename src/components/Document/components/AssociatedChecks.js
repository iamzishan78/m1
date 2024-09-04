import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";

//Contexts
import { AppContext } from "AppContext";

import DocumentAssociation from "./DocumentAssociation";
import { DocumentContext } from "../DocumentContext";
import { useMutation } from "@apollo/client";
import { ADD_CHECK_TO_FILE_DESCRIPTOR } from "graphQL/useMutationAddCheckToFileDescriptor";
import { DELETE_CHECK_FROM_FILE_DESCRIPTOR } from "graphQL/useMutationDeleteCheckFromFileDescriptor";

export default function AssociatedChecks() {
  // Initials
  const [stateApp, setStateApp] = useContext(AppContext);
  let history = useHistory();

  // States
  const [search, setSearch] = useState("");
  const [isSearchActive, setSearchState] = useState(false);

  const {
    getChecksFromDocument,
    getChecksLoading,
    checksFromDocument,
    checks,
    setChecks,
  } = React.useContext(DocumentContext);

  const [addCheckToFileDescriptor, { loading: addChecksLoading }] =
    useMutation(ADD_CHECK_TO_FILE_DESCRIPTOR);

  // Mutations
  const [deleteCheckFromDescriptor, { loading: deleteCheckLoading }] =
    useMutation(DELETE_CHECK_FROM_FILE_DESCRIPTOR, {
      onCompleted: () =>
        getChecksFromDocument({
          variables: {
            descriptorObject: stateApp.selectedDocument._id,
          },
        }),
    });

  // Fetching checks from descriptor
  useEffect(() => {
    getChecksFromDocument({
      variables: {
        descriptorObject: stateApp.selectedDocument._id,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // delete check from File Descriptor
  const deleteCheck = async (checkId) => {
    await deleteCheckFromDescriptor({
      variables: { descriptorId: stateApp?.selectedDocument?._id, checkId },
    });
  };

  const addSelectedCheckToDocument = (check) => {
    let checkData = {
      ...check,
      createdBy: stateApp?.user?._id,
    };
    addCheckToFileDescriptor({
      variables: {
        descriptorId: stateApp?.selectedDocument?._id,
        checkData: checkData,
      },
      awaitRefetchQueries: true,
    }).then(({ data }) => {
      const descriptorId = data.addCheckToFileDescriptor._id;
      const selectedDocument = stateApp.selectedDocument ?? {};
      setStateApp((stateApp) => ({
        ...stateApp,
        selectedDocument: { ...selectedDocument, _id: descriptorId },
      }));
      getChecksFromDocument({
        variables: {
          descriptorObject: descriptorId,
        },
      });
    });
  };

  // sending to check page
  const goToCheck = (check) => {
    const tenantName = window.sessionStorage.getItem("tenantName");
    history.push(
      `/revenue/statement/details/${check?._id.toLowerCase()}?tenant=${tenantName}`
    );
    setStateApp({ ...stateApp, DocumentDrawer: false, selectedDocument: {} });
  };

  // searching existing Check
  const searchExistingChecks = (value) => {
    setSearch(value);
    const checkDescriptor = checksFromDocument?.getCheckDescriptors;
    let existingChecks = checkDescriptor?.checks || [];
    if (value !== "") {
      const searchedChecks = existingChecks.filter((check) =>
        check.checkNumber.toLowerCase().includes(value)
      );
      setChecks(searchedChecks);
    } else {
      setChecks(existingChecks);
    }
  };
  return (
    <DocumentAssociation
      title={"Checks"}
      items={checks}
      navigateTo={goToCheck}
      esFilter={[]}
      esFields={["checkNumber"]}
      esIndex="checks_flat"
      searchExistingItems={searchExistingChecks}
      onSearchBlur={() => {
        setTimeout(() => {
          setSearchState(false);
        }, 300);
        setChecks(checksFromDocument?.getCheckDescriptors?.checks);
      }}
      setSearchState={setSearchState}
      isSearchActive={isSearchActive}
      search={search}
      setSearch={setSearch}
      relatedObjectType="Check"
      deleteDescriptorFile={deleteCheck}
      getSelectedItem={addSelectedCheckToDocument}
      addFileLoading={addChecksLoading}
      deleteFileLoading={deleteCheckLoading}
      updateDocumentLoading={getChecksLoading}
    />
  );
}
