import gql from "graphql-tag";

export const UPDATEPARCELOWNER = gql`
  mutation updateParcelOwner($parcelOwner: ParcelOwnerInput) {
    updateParcelOwner(parcelOwner: $parcelOwner) {
      success
      message
      error
    }
  }
`;
