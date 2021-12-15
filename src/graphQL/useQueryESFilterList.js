import gql from "graphql-tag";

export const GET_ES_FILTER_LIST = gql`
  query getESFilterList( $esIndex: String, $filterKeys: JSON, $filterKey: String, $search: String,$extendSearchQuery: String, $size: Int) {
    getESFilterList(
      esIndex: $esIndex, 
      filterKey: $filterKey,
      filterKeys: $filterKeys,
      search: $search,
      extendSearchQuery: $extendSearchQuery,
      size: $size
    )
  }
`;
