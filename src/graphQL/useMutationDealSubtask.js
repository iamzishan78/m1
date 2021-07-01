import gql from "graphql-tag";

export const ADD_DEAL_SUBTASK = gql`
  mutation addSubtask($task: JSON, $stageId: ID, $dealId: ID) {
    addSubtask(task: $task, stageId: $stageId, dealId: $dealId)
  }
`;

export const UPDATE_DEAL_SUBTASK = gql`
  mutation updateSubtask($task: JSON) {
    updateSubtask(task: $task) {
      success
      message
      error
      task
    }
  }
`;
