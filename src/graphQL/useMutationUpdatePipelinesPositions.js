import gql from "graphql-tag";

export const UPDATE_PIPELINES_POSITIONS = gql`
  mutation updatePipelinesPositions($data: [JSON], $userId: ID) {
    updatePipelinesPositions(data: $data, userId: $userId) {
      success
      message
      error
    }
  }
`;
