import gql from "graphql-tag";

export const CUSTOMLAYER = gql`
  query getCustomLayer($id: ID) {
    customLayer(id: $id) {
      _id
      shapeJson
      qtrQtrSelection
      shape
      name
      layer
      state
      user {
        _id
      }
      ownerCount
      prospectID
    }
  }
`;
