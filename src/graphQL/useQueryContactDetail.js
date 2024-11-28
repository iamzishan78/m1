import gql from "graphql-tag";

export const GET_CONTACT_ANALYTICS = gql`
  query getAuditReportingAnalytics($search: esSearchInput, $filters: [esFilterInput]) {
    getAuditReportingAnalytics(
      search: $search,
      filters: $filters,
    )
  }
`;
