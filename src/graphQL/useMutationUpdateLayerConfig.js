import gql from "graphql-tag";

export const UPDATELAYERCONFIG = gql`
  mutation UpdateLayerConfig($layerConfigId: ID $layerConfig: LayerConfigInput) {
    updateLayerConfig(layerConfigId: $layerConfigId layerConfig: $layerConfig) {
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
