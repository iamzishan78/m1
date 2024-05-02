import gql from "graphql-tag";

export const GET_CONTACT_ANALYTICS = gql`
  query getContactAnalytics($search: esSearchInput, $filters: [esFilterInput]) {
    getContactAnalytics(
      search: $search,
      filters: $filters,
    )
  }
`;
