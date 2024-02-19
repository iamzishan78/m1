import gql from "graphql-tag";

export const GET_ES_SIMPLE_FILTER = gql`
  query getESSimpleFilter($index: String, $search: esSearchInput, $filters: [esFilterInput], $sort: esSortInput, $pagination: esPaginationInput, $filterAggs: esFilterAggsInput, $key_as_string: Boolean,  $multi_filter_keys: Boolean) {
    getESSimpleFilter(
      index: $index,
      search: $search,
      filters: $filters,
      sort: $sort,
      pagination: $pagination,
      filterAggs: $filterAggs,
      key_as_string: $key_as_string,
      multi_filter_keys: $multi_filter_keys
    ),
  }
`;

export const GET_ES_INDICES = gql`
  query getESIndices {
    getESIndices {
      success
      message
      indices
    }
  }
`;
