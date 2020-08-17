import gql from "graphql-tag";

export const CUSTOMLAYER = gql`
  query getCustomLayer($id: ID) {
    customLayer(id: $id) {
      _id
      name
      shape
      layer
      user {
        _id
        name
        email
      }
      owners {
        _id
        name
        entity
        type
        depthFrom
        depthTo
        interest
        nma
        nra
      }
    }
  }
`;
