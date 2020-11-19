import gql from "graphql-tag";

export const PAGINATEDCONTACTSQUERY = gql`
  query getPaginatedContacts(
    $pagination: PaginationInput = { first: 25, after: null }
    $sort: ContactSortInput = {}
    $filters: [FilterInput] = []
    $search: String = ""
    $userId: ID
  ) {
    paginatedContacts(
      pagination: $pagination
      sort: $sort
      filters: $filters
      search: $search
      userId: $userId
    ) {
      totalCount
      edges {
        node {
          _id
          entity
          name
          address1
          address2
          city
          country
          state
          zip
          title
          firstName
          lastName
          middleName
          suffix
          mobilePhone
          homePhone
          primaryEmail
          owners
          leadSource
          lastUpdateAt
          lastUpdateBy {
            name
          }
          homePhone2
          homePhone3
          mobilephone2
          mobilephone3
          AltPhone2
          AltPhone3
          email3
          status
          hasAuthority
          doNotDisturb
          timeZone
          notes
          website
          industryType
          campaignName
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
