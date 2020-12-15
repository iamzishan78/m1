import gql from "graphql-tag";

export const ADDSTAGES = gql`
  mutation addStages($stages: [JSON], $pipelineId: ID, $userId: ID) {
    addStages(stages: $stages, pipelineId: $pipelineId, userId: $userId) {
      success
      message
      error
    }
  }
`;
