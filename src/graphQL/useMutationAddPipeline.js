import gql from "graphql-tag";

export const ADDPIPELINE = gql`
  mutation addPipeline($name: String, $stages: [JSON], $userId: ID, $project: String) {
    addPipeline(name: $name, stages: $stages, userId: $userId, project: $project) {
      success
      message
      error
    }
  }
`;
