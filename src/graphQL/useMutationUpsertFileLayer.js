import gql from "graphql-tag";

export const UPSERTFILELAYER = gql`
  mutation UpsertFileLayer($fileLayer: FileLayerInput) {
    upsertFileLayer(fileLayer: $fileLayer) {
      success
      message
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
