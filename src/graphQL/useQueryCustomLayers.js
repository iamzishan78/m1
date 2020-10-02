import gql from "graphql-tag";

export const CUSTOMLAYERSQUERY = gql`
  query getCustomLayers {
    allCustomLayers {
      _id
      shape
      name
      layer
      IsDeleted
      user {
        name
        email
      }
    }
  }
`;