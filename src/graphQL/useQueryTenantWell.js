import gql from "graphql-tag";

export const TENANTWELL = gql`
  query getTenantWell(
    $globalWellId: String
  ) {
    tenantWell(
        globalWellId: $globalWellId
    )
  }
`;
