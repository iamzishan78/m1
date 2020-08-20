import gql from "graphql-tag";

export const ADDOWNERTOAPARCEL = gql`
  mutation addOwnerToAParcel($customLayerId: ID, $owner: ParcelOwnerInput) {
    addOwnerToAParcel(customLayerId: $customLayerId, owner: $owner) {
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
        customLayer {
          _id
        }
      }
    }
  }
`;
