import gql from "graphql-tag";

export const ADD_CONTACT_TO_FILE_DESCRIPTOR = gql`
  mutation addContactToFileDescriptor($descriptorId: String, $contactData: JSON) {
    addContactToFileDescriptor(descriptorId: $descriptorId, contactData: $contactData) {
      success
      message
      _id
    }
  }
`;