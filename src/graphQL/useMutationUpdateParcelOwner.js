import gql from "graphql-tag";

export const UPDATEPARCELOWNER = gql`
  mutation updateParcelOwner($owner: ParcelOwnerInput) {
    updateParcelOwner(owner: $owner) {
      success
      message
      error
      parcelOwner {
        _id
        name
        entity
        type
        depthFrom
        depthTo
        interest
        nma
        nra
        IsDeleted
      }
    }
  }
`;
