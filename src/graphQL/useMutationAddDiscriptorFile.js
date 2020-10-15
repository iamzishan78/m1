import gql from "graphql-tag";

export const ADDDISCRIPTORFILE = gql`
  mutation AddDiscriptorFile($fileName: String, $userId: ID, $contactId: ID) {
    addDiscriptorFile(
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
