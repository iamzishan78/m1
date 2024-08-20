import { useContext } from "react";

//Contexts
import { AppContext } from "AppContext";

// Hooks
import { useLazyQuery, useMutation } from "@apollo/client";

// Mutations
import { ADDDESCRIPTORFILE } from "graphQL/useMutationAddDescriptorFile";
import { DELETEDESCRIPTORRELATEDFILE } from "graphQL/useMutationDeleteDescriptorFile";

//Query
import { GET_ES_DOCUMENTS } from "graphQL/useQueryESDocuments";

export default function useFileDescriptor(items = []) {
  // Initials
  const [stateApp, setStateApp] = useContext(AppContext);

  //Query
  const [getESDocuments, { loading: updateDocumentLoading }] = useLazyQuery(
    GET_ES_DOCUMENTS,
    {
      fetchPolicy: "no-cache",
    }
  );

  // Mutations
  const [deleteFile, { loading: deleteFileLoading }] = useMutation(
    DELETEDESCRIPTORRELATEDFILE
  );
  const [addFile, { loading: addFileLoading }] = useMutation(ADDDESCRIPTORFILE);

  // update selected document
  const setUpdatedDocument = async () => {
    const { data } = await getESDocuments({
      variables: {
        pagination: {
          first: 50,
          keep_alive: "1micros",
        },
        filters: [{ field: "_id", value: stateApp.selectedDocument._id }],
        sort: {},
      },
    });
    if (data?.getESFiles && data.getESFiles?.hits?.length) {
      const currentDocument = data.getESFiles?.hits.find(
        (doc) => doc._id === stateApp.selectedDocument._id
      );
      if (currentDocument) {
        setStateApp((stateApp) => ({
          ...stateApp,
          selectedDocument: { ...currentDocument },
        }));
      }
    }
  };

  // delete from File Descriptor
  const deleteDescriptorFile = async (id) => {
    await deleteFile({
      variables: {
        descriptorObjectId: stateApp.selectedDocument._id,
        relatedObjectId: id,
      },
    });
    await setUpdatedDocument();
  };

  // get Item
  const getSelectedItem = async (selection, relatedObjectType) => {
    const isExists = items.some((item) => selection._id === item._id);

    if (isExists) return;

    let data = {
      ...selection,
      createdBy: stateApp?.user?._id,
    };

    await addFile({
      variables: {
        fileName: stateApp.selectedDocument.name,
        fileId: stateApp.selectedDocument._id,
        userId: stateApp?.user?._id,
        relatedObjectId: data._id,
        relatedObjectType,
      },
    });
    await setUpdatedDocument();
  };

  return {
    getSelectedItem,
    deleteDescriptorFile,
    addFileLoading,
    deleteFileLoading,
    updateDocumentLoading,
  };
}
