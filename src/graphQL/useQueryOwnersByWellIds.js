import gql from "graphql-tag";

export const OWNERS_BY_WELL_IDS = gql`
  query getOwnersByWellIds($wellIds: JSON, $selectedYear:String) {
    ownersByWellIds(wellIds: $wellIds, selectedYear:$selectedYear)
  }
`;
