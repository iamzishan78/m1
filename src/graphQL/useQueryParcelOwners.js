import gql from "graphql-tag";

export const PARCELOWNERSQUERY = gql`
  query getparcelOwners($customLayerId: ID) {
    parcelOwners(customLayerId: $customLayerId)
  }
`;
