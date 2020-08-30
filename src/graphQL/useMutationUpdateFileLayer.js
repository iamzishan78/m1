import gql from "graphql-tag";

export const UPDATEFILELAYER = gql`
  mutation updateFileLayer(
    $fileLayerId: ID
    $fileLayer: FileLayerInput
  ) {
    updateFileLayer(
      fileLayerId: $fileLayerId
      fileLayer: $fileLayer
    ) {
      success
      message
      error
      fileLayer {
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
  }
`;
