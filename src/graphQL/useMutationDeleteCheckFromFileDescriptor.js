import gql from "graphql-tag";

export const DELETE_CHECK_FROM_FILE_DESCRIPTOR = gql`
  mutation deleteCheckFromFileDescriptor(
    $descriptorId: String
    $checkId: String
  ) {
    deleteCheckFromFileDescriptor(
      descriptorId: $descriptorId
      checkId: $checkId
    ) {
      success
      message
    }
  }
`;
