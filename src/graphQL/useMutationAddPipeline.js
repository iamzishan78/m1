import gql from "graphql-tag";

export const ADD_PIPELINE = gql`
  mutation addPipeline($name: String, $stages: [JSON], $userId: ID) {
    addPipeline(name: $name, stages: $stages, userId: $userId) {
      success
      message
      error
      pipeline
    }
  }
`;
