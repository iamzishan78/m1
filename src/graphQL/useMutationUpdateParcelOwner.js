import gql from "graphql-tag";

export const UPDATEPARCELOWNER = gql`
  mutation updateParcelOwner($parcelOwner: JSON) {
    updateParcelOwner(parcelOwner: $parcelOwner) {
      success
      message
      error
    }
  }
`;
