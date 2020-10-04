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
    $search: String
  ) {
    paginatedContacts(
      pagination: $pagination,
      sort: $sort,
      filters: $filters,
      search: $search
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
          lastUpdateBy {
            name
          }
          name
          address1
          address2
          city
          country
          state
          zip
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
