import gql from "graphql-tag";

export const DELETEDESCRIPTORFILE = gql`
  mutation deleteDescriptorFile($id: String) {
    deleteFileDescriptor(descriptorId: $id) {
      success
      message
    }
  }
`;
