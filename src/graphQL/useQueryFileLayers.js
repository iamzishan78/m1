import gql from "graphql-tag";

export const FILELAYERSQUERY = gql`
  query getFileLayers {
    allFileLayers {
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