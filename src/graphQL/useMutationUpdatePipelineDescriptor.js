import gql from "graphql-tag";

export const UPDATE_PIPELINE_DESCRIPTOR = gql`
  mutation updatePipelineDescriptor($descriptor: JSON) {
    updatePipelineDescriptor(descriptor: $descriptor) {
      success
      message
      error
      descriptor
    }
  }
`;
