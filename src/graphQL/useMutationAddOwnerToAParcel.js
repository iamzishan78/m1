import gql from "graphql-tag";

export const ADDOWNERTOAPARCEL = gql`
  mutation addOwnerToAParcel($parcelOwner: ParcelOwnerInput) {
    addOwnerToAParcel(parcelOwner: $parcelOwner) {
      success
      message
      error
    }
  }
`;
