import gql from "graphql-tag";

export const PERMITSQUERY = gql`
  query getPermits {
    permits
  }
`;