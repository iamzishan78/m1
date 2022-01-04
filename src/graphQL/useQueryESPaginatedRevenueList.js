import gql from "graphql-tag";

export const GET_ES_PAGINATED_REVENUE_LIST = gql`
  query getESPaginatedRevenueList( $esIndex: String, $search: String, $sort: JSON, $pagination: JSON, $filters: [JSON]) {
    getESPaginatedRevenueList(
      esIndex: $esIndex, 
      search: $search,
      sort: $sort,
      pagination: $pagination,
      filters: $filters
    )
  }
`;
