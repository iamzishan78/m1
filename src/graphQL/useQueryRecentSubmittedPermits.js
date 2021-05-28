import gql from "graphql-tag";

export const RECENT_SUBMITTED_PERMITS_QUERY = gql`
  query {
    recent_submitted_permits
  }
`;
