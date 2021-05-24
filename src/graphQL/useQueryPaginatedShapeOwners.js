import gql from "graphql-tag";

export const SHAPE_OWNERS = gql`
  query getPaginatedShapeOwners(
    $polygon: String
    $pagination: PaginationInput = { first: 25, after: null }
    $sort: OwnerSortInput = {}
    $filters: [FilterInput] = []
    $search: String = ""
    $userId: ID
  ) {
    paginatedShapeOwners(
      polygon: $polygon
      pagination: $pagination
      sort: $sort
      filters: $filters
      search: $search
      userId: $userId
    ) {
      edges {
        node,
        cursor
      },
      totalCount,
      pageInfo {
        hasNextPage,
        endCursor
      },
    }
  }
`;
