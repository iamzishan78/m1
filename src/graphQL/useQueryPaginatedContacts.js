import gql from "graphql-tag";

export const PAGINATEDCONTACTSQUERY = gql`
  query getPaginatedContacts($perPage: Int, $after: Cursor = null, $sortField: ContactSortField = _id, $sortOrder: Int = 1) {
    paginatedContacts(pagination: {first: $perPage, after: $after}, sort: {field: $sortField, order: $sortOrder}) {
      totalCount,
      edges {
        node {
          _id
          entityObj {
            _id
            name
            address1
            address2
            city
            country
            state
            zip
          }
          mobilePhone
          homePhone
          primaryEmail
          leadSource
          lastUpdateAt
          lastUpdateBy {
            name
          }
        },
        cursor
      },
      pageInfo {
        hasNextPage,
        endCursor
      }
    }
  }
`;
