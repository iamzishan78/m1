import gql from "graphql-tag";

export const UPDATE_PARCEL_OWNERS = gql`
  mutation updateParcelOwners($parcelOwners: [JSON]) {
    updateParcelOwners(parcelOwners: $parcelOwners) {
      success
      message
      error
    }
  }
`;
