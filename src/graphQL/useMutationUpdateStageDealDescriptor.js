import gql from "graphql-tag";

export const UPDATE_STAGE_DEAL_DESCRIPTOR = gql`
  mutation updateStageDealDescriptor($descriptor: JSON) {
    updateStageDealDescriptor(descriptor: $descriptor) {
      success
      message
      error
      stageDealDescriptors
    }
  }
`;
