import gql from "graphql-tag";

export const SHAPEWELLS = gql`
  query getPaginatedShapeWells(
    $polygon: String
    $pagination: PaginationInput = { first: 25, after: null }
    $sort: WellSortInput = {}
    $filters: [FilterInput] = []
    $search: String = ""
    $userId: ID
  ) {
    paginatedShapeWells(
      polygon: $polygon
      pagination: $pagination
      sort: $sort
      filters: $filters
      search: $search
      userId: $userId
    ) {
      edges {
        node {
          id
          coordinates
          wellName
          api
          operator
          wellType
          latitude
          longitude
          wellBoreProfile
          ownerCount

          wellStatus
          lastTwelveMonthBOE
          permitApprovedDate
          permitApprovedDateReady
          spudDate
          spudDateReady
          completionDate
          completionDateReady
          firstProductionDate
          firstProductionDateReady
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
