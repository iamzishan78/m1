import gql from "graphql-tag";

export const CUSTOMLAYER = gql`
  query getCustomLayer($id: ID) {
    customLayer(id: $id) {
      _id
      shape
      name
      layer
      state
      user {
        _id
      }
      ownerCount
    }
  }
`;
