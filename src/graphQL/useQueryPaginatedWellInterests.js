import gql from "graphql-tag";

export const PAGINATEDWELLINTERESTSQUERY = gql`
  query getPaginatedWellInterests(
    $pagination: PaginationInput = { first: 25, after: null }
    $sort: ContactSortInput = {}
    $filters: [FilterInput] = []
    $search: String = ""
    $userId: ID
  ) {
    paginatedWellInterests(
        pagination: $pagination
        sort: $sort
        filters: $filters
        search: $search
        userId: $userId
      ) {
    totalCount,
      edges {
        node {
          id
          wellName
          apiNumber
          operator
          state
          county
          country
          latitude
          longitude
          interestType
          ownershipPercentage
          appraisedValue
          lodId
        },
        cursor
      },
      pageInfo {
        hasNextPage,
        endCursor
      },
    }
  }
`;