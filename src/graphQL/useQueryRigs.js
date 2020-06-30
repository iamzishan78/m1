import gql from "graphql-tag";

export const RIGSQUERY = gql`
  query getRigs($offset: Int, $amount: Int) {
    rigs(offset: $offset, amount: $amount)
  }
`;