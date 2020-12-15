import gql from "graphql-tag";

export const ADDPIPELINE = gql`
  mutation addPipeline($name: String, $stages: [JSON], $userId: ID) {
    addPipeline(name: $name, stages: $stages, userId: $userId) {
      success
      message
      error
    }
  }
`;
