import gql from "graphql-tag";

export const ADDOWNERTOAPARCEL = gql`
  mutation addOwnerToAParcel($parcelOwner: JSON) {
    addOwnerToAParcel(parcelOwner: $parcelOwner) {
      success
      message
      error
    }
  }
`;
