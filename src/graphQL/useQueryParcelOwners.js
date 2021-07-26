import gql from "graphql-tag";

export const PARCELOWNERSQUERY = gql`
  query getparcelOwners($customLayerId: ID, $qtr: JSON!) {
    parcelOwners(customLayerId: $customLayerId, qtr:$qtr)
  }
`;
