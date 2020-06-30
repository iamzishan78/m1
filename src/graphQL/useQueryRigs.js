import gql from "graphql-tag";

export const RIGSQUERY = gql`
  query getRigs($offset: Int) {
    rigs(offset: $offset)
  }
`;