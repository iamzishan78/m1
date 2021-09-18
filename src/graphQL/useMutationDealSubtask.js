import gql from "graphql-tag";

export const ADD_DEAL_SUBTASK = gql`
  mutation addSubtask($task: JSON, $stageId: ID, $dealId: ID) {
    addSubtask(task: $task, stageId: $stageId, dealId: $dealId)
  }
`;

export const UPDATE_DEAL_SUBTASK = gql`
  mutation updateSubtask($task: JSON, $tasks: [JSON]) {
    updateSubtask(task: $task, tasks: $tasks) {
      success
      message
      error
      task
    }
  }
`;
