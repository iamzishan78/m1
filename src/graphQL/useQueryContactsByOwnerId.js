import gql from "graphql-tag";

export const CONTACTSBYOWNERSID = gql`
  query getContactsByOwnerId($objectId: String) {
    contactsByOwnerId(objectId: $objectId) {
      _id
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
