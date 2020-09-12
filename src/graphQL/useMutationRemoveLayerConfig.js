import gql from "graphql-tag";

export const REMOVELAYERCONFIG = gql`
  mutation removeLayerConfig($layerConfigId: ID) {
    removeLayerConfig(layerConfigId: $layerConfigId) {
      success
      error
      message
    }
  }
`;
