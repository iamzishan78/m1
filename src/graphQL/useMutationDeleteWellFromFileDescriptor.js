import gql from "graphql-tag";

export const DELETEWELLFROMFILEDESCRIPTOR = gql`
  mutation deleteWellFromDescriptor($descriptorId: String, $wellId: String) {
    deleteWellFromFileDescriptor(descriptorId: $descriptorId, relatedObjectId: $wellId) {
      success
      message
    }
  }
`;
