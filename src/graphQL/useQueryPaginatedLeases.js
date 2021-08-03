import gql from "graphql-tag";

export const PAGINATEDLEASESQUERY = gql`
  query getPaginatedLeases(
    $search: String = ""
    $pageOverride: Int = 5
  ) {
    paginatedLeases(
      search: $search
      pageOverride: $pageOverride
    ) {
      edges {
        Score
        ActiveWellCount
        BasinCount
        Country
        County
        DUCWellCount
        GasWellCount
        Lease
        LeaseId
        OilWellCount
        OperatorCount
        PermitCount
        PlayCount
        State
        TotalWellCount
        FormationCount
        id
      }
    }
  }
`;