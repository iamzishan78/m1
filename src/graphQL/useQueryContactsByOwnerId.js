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
      createAt
      createBy {
        name
      }
      lastUpdateAt
      lastUpdateBy {
        name
      }
      address1Alt
      address2Alt
      cityAlt
      stateAlt
      zipAlt
      countryAlt
      AltPhone
      secondaryEmail
      relatives
      linkedln
      facebook
      twitter
      leadSource
    }
  }
`;
