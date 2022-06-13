import gql from "graphql-tag";

export const ADD_LAYER_GROUP = gql`
  mutation addLayerGroup($layerGroup: JSON) {
    addLayerGroup(layerGroup: $layerGroup)
  }
`;
