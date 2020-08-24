import gql from "graphql-tag";

export const LAYERCONFIGSBYUSER = gql`
  query getLayerConfigsByUser($userId: String) {
    layersConfigByUser(userId: $userId) {
      _id
      config
      layerName
      user {
        name
        email
      }
    }
  }
`;
