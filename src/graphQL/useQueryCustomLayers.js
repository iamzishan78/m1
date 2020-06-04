import gql from "graphql-tag";

export const CUSTOMLAYERSQUERY = gql`
  query getCustomLayers($userId: String) {
    customLayers(userId: $userId) {
      _id
      shape
      name
      layer
      user {
        name
        email
      }
    }
  }
`;