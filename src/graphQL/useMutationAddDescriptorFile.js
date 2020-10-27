import gql from "graphql-tag";

export const ADDDESCRIPTORFILE = gql`
  mutation AddDescriptorFile($fileName: String, $userId: ID, $contactId: ID) {
    addFileDescriptor(
      fileName: $fileName
      userId: $userId
      contactId: $contactId
    ) {
      success
      message
      error
      file {
        id
        name
        uri
        internalKey
      }
    }
  }
`;
