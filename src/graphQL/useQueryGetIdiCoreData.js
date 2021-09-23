import gql from "graphql-tag";

export const GET_IDICORE_DATA = gql`
  mutation getIdiCoreData($tenantId: String, $persons: [JSON]) {
    getIdiCoreData(tenantId: $tenantId, persons: $persons)
  }
`;
