import gql from "graphql-tag";

export const CUSTOMLAYER = gql`
  query getCustomLayer($id: ID) {
    customLayer(id: $id) {
      _id
      shape
      name
      layer
      user {
        _id
      }
      owners {
        _id
        ownerEntityId
        name
        address1
        address2
        city
        state
        zip
        country
        globalOwner
        entity
        type
        depthFrom
        depthTo
        interest
        nma
        nra
        customLayer
        IsDeleted
      }
    }
  }
`;
