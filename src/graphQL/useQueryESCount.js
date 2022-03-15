import gql from "graphql-tag";

export const GET_ES_COUNT = gql`
  query getESCount( $polygon: JSON, $esIndex: String, $search: String, $filters: [JSON], $customFilters: [JSON]) {
    getESCount(
      polygon: $polygon,
      esIndex: $esIndex, 
      search: $search,
      filters: $filters,
      customFilters: $customFilters,
    )
  }
`;
