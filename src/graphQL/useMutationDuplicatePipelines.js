import gql from "graphql-tag";

export const DUPLICATE_PIPELINES = gql`
  mutation duplicatePipelines($pipelines: [JSON]) {
    duplicatePipelines(pipelines: $pipelines) {
      success
      message
      error
      pipelines
    }
  }
`;
