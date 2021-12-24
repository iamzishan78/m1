import gql from "graphql-tag";

export const GET_ES_AGGS_LIST = gql`
  query getESAggsList( $esIndex: String, $search: String, $filters: [JSON], $aggs: JSON) {
    getESAggsList(
      esIndex: $esIndex, 
      search: $search,
      filters: $filters,
      aggs: $aggs
    )
  }
`;
