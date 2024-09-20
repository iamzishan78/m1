import gql from "graphql-tag";

export const ADD_AGREEMENT_TO_FILE_DESCRIPTOR = gql`
  mutation AddAgreementToFileDescriptor(
    $descriptorId: String
    $shapeData: JSON
  ) {
    addAgreementToFileDescriptor(
      descriptorId: $descriptorId
      shapeData: $shapeData
    ) {
      _id
      message
      success
    }
  }
`;
