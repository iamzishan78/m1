import gql from "graphql-tag";

export const FILELAYERSQUERY = gql`
  query getFileLayers($userId: String) {
    fileLayers (userId: $userId) {
      _id
      layerName
      idColor
      layerType
      paintProps
      file {
        _id
        name
        contentType
        containerName
      }
      user {
        name
        email
      }
    }
  }
`;