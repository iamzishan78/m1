import gql from "graphql-tag";

export const ADD_CONTACT_TO_FILE_DESCRIPTOR = gql`
  mutation addContactToFileDescriptor($descriptorId: String, $wellData: JSON) {
    addContactToFileDescriptor(descriptorId: $descriptorId, wellData: $wellData) {
      success
      message
      _id
    }
  }
`;