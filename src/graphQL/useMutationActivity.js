import gql from "graphql-tag";

export const ADDACTIVITY = gql`
  mutation addActivity($activity: ActivityLogInput) {
    addActivity(activity: $activity) {
      success
      message
    }
  }
`;

export const UPDATEACTIVITY = gql`
  mutation updateActivity($activity: ActivityLogInput) {
    updateActivity(activity: $activity) {
      success
      message
    }
  }
`;

export const DELETEACTIVITY = gql`
  mutation deleteActivity($id: ID) {
    deleteActivity(id: $id) {
      success
      message
    }
  }
`;
