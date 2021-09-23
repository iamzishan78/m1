import gql from "graphql-tag";

export const GET_FEATURE_QUOTA = gql`
  query featureQuota($featureId: String, $tenantId: String) {
    featureQuota(featureId: $featureId, tenantId: $tenantId)
  }
`;
