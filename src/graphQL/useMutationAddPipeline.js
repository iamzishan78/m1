import gql from "graphql-tag";

export const ADD_PIPELINE = gql`
  mutation addPipeline($name: String, $project: String, $stages: [JSON], $userId: ID) {
    addPipeline(name: $name, project: $project, stages: $stages, userId: $userId) {
      success
      message
      error
    }
  }
`;
