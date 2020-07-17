import gql from "graphql-tag";

export const ADDBULKCONTACT = gql`
  mutation CreateBulkContacts($contactList: [ContactInput]) {
    createBulkContacts(contactList: $contactList) {
      success
      message
      error
    }
  }
`;
