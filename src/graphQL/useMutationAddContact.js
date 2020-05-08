import gql from "graphql-tag";

export const ADDCONTACT = gql`
  mutation AddContact($contact: ContactInput) {
    addContact(contact: $contact) {
      success
      message
      error
      contact {
        name
        address1
        address2
        city
        country
        state
        zip
        mobilePhone
        homePhone
        primaryEmail
        owners
        createBy {
          name
        }
        lastUpdateBy {
          name
        }
      }
    }
  }
`;
