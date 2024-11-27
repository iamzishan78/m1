import gql from "graphql-tag";

export const ADD_CHECK_TO_FILE_DESCRIPTOR = gql`
  mutation AddCheckToFileDescriptor(
    $descriptorId: String
    $checkData: JSON
  ) {
    addCheckToFileDescriptor(
      descriptorId: $descriptorId
      checkData: $checkData
    ) {
      _id
      message
      success
    }
  }
`;
