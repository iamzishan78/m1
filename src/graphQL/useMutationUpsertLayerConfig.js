import gql from "graphql-tag";

export const UPSERTLAYERCONFIG = gql`
  mutation UpsertLayerConfig($layerConfig: LayerConfigInput) {
    upsertLayerConfig(layerConfig: $layerConfig) {
      success
      error
      message
      layerConfig {
        _id
        config
        layerName
        user {
          name
          email
        }
      }
    }
  }
`;
