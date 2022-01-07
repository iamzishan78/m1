import gql from "graphql-tag";

export const OWNERS_BY_WELL_IDS = gql`
  query getOwnersByWellIds($wellIds: JSON, $selectedYear:String) {
    ownersByWellIds(wellIds: $wellIds, selectedYear:$selectedYear)
  }
`;

export const OWNERS_INTEREST_BY_WELL_IDS = gql`
  query getOwnersInterestByWellIds($wellIds: JSON, $selectedYear:String) {
    ownersInterestByWellIds(wellIds: $wellIds, selectedYear:$selectedYear)
  }
`;
