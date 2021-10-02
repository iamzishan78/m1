import gql from "graphql-tag";

export const ADD_TASK = gql`
  mutation createTask($task: JSON) {
    createTask(task: $task) {
      success
      message
      error
      task
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation updateTask($task: JSON) {
    updateTask(task: $task) {
      success
      message
      error
      task
    }
  }
`;
