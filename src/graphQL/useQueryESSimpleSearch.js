import gql from "graphql-tag";

export const GET_ES_SIMPLE_SEARCH = gql`
  query getESSimpleSearch($index: String, $search: esSearchInput, $filters: [esFilterInput], $sort: esSortInput, $pagination: esPaginationInput, $isDynamicAsset: Boolean) {
    getESSimpleSearch(
      index: $index,
      search: $search,
      filters: $filters,
      sort: $sort,
      pagination: $pagination
      isDynamicAsset: $isDynamicAsset
    )
  }
`;
