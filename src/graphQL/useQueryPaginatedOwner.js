import gql from "graphql-tag";

export const PAGINATEDOWNERSQUERY = gql`
  query getPaginatedOwners(
    $search: String = ""
    $pageOverride: Int = 5
  ) {
    paginatedOwners(
      search: $search
      pageOverride: $pageOverride
    ) {
      edges {
        Score
        City
        Id
        OwnerName
        State
        StreetAddress
        SysStartTime
        Zip      
      }
    }
  }
`;