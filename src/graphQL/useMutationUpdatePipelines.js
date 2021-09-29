import gql from "graphql-tag";

export const UPDATE_PIPELINE = gql`
  mutation updatePipeline($pipeline: JSON) {
    updatePipeline(pipeline: $pipeline) {
      success
      message
      error
      pipeline
    }
  }
`;

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
