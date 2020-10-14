import gql from "graphql-tag";

export const ADDCONTACTFILE = gql`
  mutation AddContactFile($fileName: String, $userId: ID, $contactId: ID) {
    addContactFile(
      fileName: $fileName
      userId: $userId
      contactId: $contactId
    ) {
      success
      message
      error
      file {
        id
        uri
        internalKey
      }
    }
  }
`;
