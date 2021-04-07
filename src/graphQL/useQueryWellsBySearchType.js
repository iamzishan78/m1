import gql from "graphql-tag";

export const OWNER_WELLS_BY_SEARCHTYPE = gql`
  query wellsBySearchType($searchType: String, $searchIds: [String]) {
    wellsBySearchType(searchType: $searchType, searchIds: $searchIds)
  }
`;
