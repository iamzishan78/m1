import gql from "graphql-tag";

export const PERMITSQUERY = gql`
  query getPermits($offset: Int, $amount: Int) {
    permits(offset: $offset, amount: $amount)
  }
`;