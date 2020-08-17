import gql from "graphql-tag";

export const ADDOWNERTOAPARCEL = gql`
  mutation addOwnerToAParcel($customLayerId: ID, $owner: ParcelOwnerInput) {
    addOwnerToAParcel(customLayerId: $customLayerId, owner: $owner) {
      success
      message
      error
      customLayer {
        _id
        name
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
  }
`;
