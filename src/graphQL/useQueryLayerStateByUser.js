import gql from "graphql-tag";

export const LAYERSTATESBYUSER = gql`
  query getLayerStatesByUser($userId: String) {
    layerStateByUser(userId: $userId) {
      _id
      layersConfig
      user {
        name
        email
      }
    }
  }
`;
