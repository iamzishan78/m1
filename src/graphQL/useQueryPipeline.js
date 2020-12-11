import gql from "graphql-tag";

export const GETPIPELINE = gql`
  query getPipeline($id: ID) {
    pipeline(id: $id)
  }
`;
