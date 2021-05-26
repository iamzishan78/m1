import gql from "graphql-tag";

export const UPDATE_PIPELINE_DESCRIPTORS = gql`
  mutation updatePipelineDescriptors($descriptors: [JSON]) {
    updatePipelineDescriptors(descriptors: $descriptors) {
      success
      message
      error
      descriptors
    }
  }
`;

export const CREATE_PIPELINE_DESCRIPTORS = gql`
  mutation createPipelineDescriptors($descriptor: JSON) {
    createPipelineDescriptors(descriptor: $descriptor) {
      success
      message
      error
    }
  }
`;
