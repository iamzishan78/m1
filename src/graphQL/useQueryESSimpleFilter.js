import gql from "graphql-tag";

export const GET_ES_SIMPLE_FILTER = gql`
  query getESSimpleFilter($index: String, $search: esSearchInput, $filters: [esFilterInput], $sort: esSortInput, $pagination: esPaginationInput, $filterAggs: esFilterAggsInput) {
    getESSimpleFilter(
      index: $index,
      search: $search,
      filters: $filters,
      sort: $sort,
      pagination: $pagination,
      filterAggs: $filterAggs
    ),
  }
`;
