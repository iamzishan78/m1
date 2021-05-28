import gql from "graphql-tag";

export const UPDATE_PROJECT = gql`
  mutation updateProject($project: JSON) {
    updateProject(project: $project) {
      success
      message
      error
      project
    }
  }
`;
