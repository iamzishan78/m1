import gql from "graphql-tag";

export const ADDCONTACT = gql`
  mutation AddContact($contact: ContactInput) {
    addContact(contact: $contact) {
      success
      message
      error
      contact {
        _id
        name
        address1
        address2
        city
        country
        state
        zip
        phone
        mobile
        email
        owners
        ts
      }
    }
  }
`;
