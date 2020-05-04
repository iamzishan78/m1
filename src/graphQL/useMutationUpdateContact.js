import gql from "graphql-tag";

export const UPDATECONTACT = gql`
  mutation UpdateContact($contact: ContactInput) {
    updateContact(contact: $contact) {
      success
      message
      error
      contact {
        _id
        name
        address1
        address2
        city
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
