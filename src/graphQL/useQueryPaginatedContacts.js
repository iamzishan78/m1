import gql from "graphql-tag";

export const PAGINATEDCONTACTSQUERY = gql`
  query getPaginatedContacts(
    $pagination: PaginationInput = {
      first: 25,
      after: null
    },
    $sort: ContactSortInput = {
      field: "name",
      order: 1
    },
    $filters: [FilterInput] = [],
    $search: String,
    $userId: ID
  ) {
    paginatedContacts(
      pagination: $pagination,
      sort: $sort,
      filters: $filters,
      search: $search,
      userId: $userId
    ) {
      totalCount,
      edges {
        node {
          _id
          entity
          mobilePhone
          homePhone
          primaryEmail
          leadSource
          lastUpdateAt
          lastUpdateBy
          name
          address1
          address2
          city
          country
          state
          zip
          commentsCounter
          tags
          melissaRowsCount
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
