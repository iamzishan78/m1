import gql from "graphql-tag";

export const UPDATE_PIPELINES_POSITIONS = gql`
  mutation updatePipelinesPositions($data: [JSON]) {
    updatePipelinesPositions(data: $data) {
      success
      message
      error
    }
  }
`;
