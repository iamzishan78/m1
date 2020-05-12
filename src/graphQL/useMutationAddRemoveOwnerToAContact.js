import gql from "graphql-tag";

export const ADDREMOVEOWNERTOACONTACT = gql`
  mutation AddRemoveOwnerToAContact($contactId: ID, $ownerId: String) {
    addRemoveOwnerToAContact(contactId: $contactId, ownerId: $ownerId) {
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
        mobilePhone
        homePhone
        primaryEmail
        owners
        lastUpdateBy {
          name
        }
        lastUpdateAt
        createBy {
          name
        }
        createAt
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
        companyName
        jobTitle
      }
    }
  }
`;
