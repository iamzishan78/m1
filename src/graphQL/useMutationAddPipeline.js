import gql from "graphql-tag";

export const ADD_PIPELINE = gql`
  mutation addPipeline($pipeline: JSON) {
    addPipeline(pipeline: $pipeline) {
      success
      message
      error
      pipeline
    }
  }
`;
