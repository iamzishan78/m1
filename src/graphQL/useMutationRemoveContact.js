import gql from "graphql-tag";

export const REMOVE_CONTACTS = gql`
  mutation removeContact($contactIds: [ID], $userId: String) {
    removeContact(contactIds: $contactIds, userId: $userId) {
      success
      message
      error
    }
  }
`;
