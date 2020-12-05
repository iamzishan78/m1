import gql from "graphql-tag";

export const GETPIPELINES = gql`
  query getPipelines {
    pipelines
  }
`;
