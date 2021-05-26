import gql from "graphql-tag";

export const UPDATEPIPELINES = gql`
  mutation updatePipelines($pipelines: [JSON]) {
    updatePipelines(pipelines: $pipelines) {
      success
      message
      error
      pipelines
    }
  }
`;
