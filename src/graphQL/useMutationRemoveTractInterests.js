import gql from "graphql-tag";

export const REMOVE_TRACT_INTERESTS = gql`
  mutation removeTractInterests($descriptorIds: [ID]) {
    removeTractInterests(descriptorIds: $descriptorIds) {
      success
      message
      error
      agreement
    }
  }
`;