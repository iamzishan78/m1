import gql from "graphql-tag";

export const CONTACTSQUERY = gql`
  query getContacts {
    contacts {
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
`;
