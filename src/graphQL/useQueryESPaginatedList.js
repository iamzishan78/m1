import gql from "graphql-tag";

export const GET_ES_PAGINATED_LIST = gql`
  query getESPaginatedList( $esIndex: String, $search: String, $sort: JSON, $pagination: JSON, $filters: [JSON]) {
    getESPaginatedList(
      esIndex: $esIndex, 
      search: $search,
      sort: $sort,
      pagination: $pagination,
      filters: $filters
    )
  }
`;
