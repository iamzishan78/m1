import gql from "graphql-tag";

export const PAGINATEDWELLSQUERY = gql`
  query getPaginatedWells(
    $search: String = ""
    $pageOverride: Int = 5
  ) {
    paginatedWells(
      search: $search
      pageOverride: $pageOverride
    ) {
      edges {
        Score
        ApiNumber
        County
        CurrentOperator
        Id
        Latitude
        Lease
        LeaseAcreage
        LeaseId
        Longitude
        MaxCompletionRecordDate
        State
        WellBoreProfile
        WellName
        WellStatus
        WellType      
      }
    }
  }
`;