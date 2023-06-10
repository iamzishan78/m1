import gql from "graphql-tag";

export const GET_REVENUE_ANALYTICS_COUNT = gql`
  query getRevenueAnalyticsCounts($index: String, $search: esSearchInput, $filters: [esFilterInput], $sort: esSortInput, $pagination: esPaginationInput) {
    getRevenueAnalyticsCounts(
      index: $index,
      search: $search,
      filters: $filters,
      sort: $sort,
      pagination: $pagination
    )
  }
`;
