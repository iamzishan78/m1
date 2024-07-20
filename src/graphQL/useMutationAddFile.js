import gql from "graphql-tag";

export const ADDFILE = gql`
  mutation AddFile($fileName: String, $userId: ID, $custom_data: JSON) {
    addFile(fileName: $fileName, userId: $userId, custom_data: $custom_data) {
      success
      message
      error
      file {
        id
        name
        uri
        internalKey
        custom_data
      }
    }
  }
`;
