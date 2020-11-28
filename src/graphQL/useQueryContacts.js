import gql from "graphql-tag";

export const CONTACTSQUERY = gql`
  query getContacts($userId: ID) {
    contacts(userId: $userId) {
      _id
      entity
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
      leadSource
      lastUpdateAt
      lastUpdateBy {
        name
      }
    }
  }
`;
