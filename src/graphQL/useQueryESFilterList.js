import gql from "graphql-tag";

export const GET_ES_FILTER_LIST = gql`
  query getESFilterList( $esIndex: String, $filterKey: String, $search: String,$extendSearchQuery: String, $size: Int) {
    getESFilterList(
      esIndex: $esIndex, 
      filterKey: $filterKey,
      search: $search,
      extendSearchQuery: $extendSearchQuery,
      size: $size
    )
  }
`;
