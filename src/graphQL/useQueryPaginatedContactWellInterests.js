import gql from "graphql-tag";

export const PAGINATED_CONTACT_WELLINTERESTS_QUERY = gql`
  query getPaginatedContactWellInterests(
    $pagination: PaginationInput = { first: 25, after: null }
    $sort: WellInterestSortInput = {}
    $filters: [FilterInput] = []
    $search: String = ""
    $contactId: ID
  ) {
    paginatedContactWellInterests(
        pagination: $pagination
        sort: $sort
        filters: $filters
        search: $search
        contactId: $contactId
      ) {
    totalCount,
      edges {
        node {
          _id
          wellId
          wellName
          api
          latitude
          longitude
          state
          county
          leaseId
          lease
          leaseDescription
          leaseAcres
          interestOwner
          interestOwnerType
          entity
          type
          amount
          taxValue
          nra
          year
          globalLod
          isOverridden
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