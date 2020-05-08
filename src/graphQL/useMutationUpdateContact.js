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
        country
        state
        zip
        mobilePhone
        homePhone
        primaryEmail
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
  }
`;
