import gql from "graphql-tag";

export const REMOVECONTACT = gql`
  mutation removeContact($contactId: ID) {
    removeContact(contactId: $contactId) {
      success
      message
      error
    }
  }
`;
