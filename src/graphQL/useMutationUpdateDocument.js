import gql from "graphql-tag";

export const UPDATE_DOCUMENT = gql`
  mutation updateDocument($document: DocumentInput) {
    updateDocumentFile(document: $document) {
      success
      message
      error
    }
  }
`;
