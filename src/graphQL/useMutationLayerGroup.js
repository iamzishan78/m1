import gql from "graphql-tag";

export const ADD_LAYER_GROUP = gql`
  mutation addLayerGroup($userId: ID, $layerGroup: JSON) {
    addLayerGroup(userId: $userId, layerGroup: $layerGroup)
  }
`;
