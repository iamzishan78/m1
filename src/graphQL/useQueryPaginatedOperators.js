import gql from "graphql-tag";

export const PAGINATEDOPERATORSQUERY = gql`
  query getPaginatedOperators(
    $search: String = ""
    $pageOverride: Int = 5
  ) {
    paginatedOperators(
      search: $search
      pageOverride: $pageOverride
    ) {
      edges {
        Score
        ActiveWellCount
        BasinCount
        DUCWellCount
        GasWellCount
        Id
        OilWellCount
        Operator
        PermitCount
        StateCount
        TotalWellCount
      }
    }
  }
`;