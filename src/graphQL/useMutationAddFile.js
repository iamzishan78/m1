import gql from "graphql-tag";

export const ADDFILE = gql`
  mutation AddFile($fileName: String, $userId: ID) {
    addFile(fileName: $fileName, userId: $userId) {
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
