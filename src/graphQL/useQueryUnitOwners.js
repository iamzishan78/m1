import gql from "graphql-tag";

export const UNIT_OWNERS_QUERY = gql`
  query getUnitOwners($customLayerId: ID) {
    unitOwners(customLayerId: $customLayerId)
  }
`;
