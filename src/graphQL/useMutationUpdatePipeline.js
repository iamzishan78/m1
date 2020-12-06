import gql from "graphql-tag";

export const UPDATEPIPELINE = gql`
  mutation updatePipeline($pipeline: JSON) {
    updatePipeline(pipeline: $pipeline) {
      success
      message
      error
      pipeline
    }
  }
`;
