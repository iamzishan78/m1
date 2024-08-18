import gql from "graphql-tag";

export const DELETE_CONTACT_FROM_FILE_DESCRIPTOR = gql`
  mutation deleteContactFromFileDescriptor($descriptorId: String, $contactId: String) {
    deleteContactFromFileDescriptor(descriptorId: $descriptorId, contactId: $contactId) {
      success
      message
    }
  }
`;
