import gql from "graphql-tag";

export const PAGINATEDCONTACTSQUERY = gql`
  query getPaginatedContacts($perPage: Int, $after: Cursor) {
    paginatedContacts(pagination: {first: $perPage, after: $after}) {
      totalCount,
      edges {
        node {
          _id
          entity {
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
