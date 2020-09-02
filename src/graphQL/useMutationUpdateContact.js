import gql from "graphql-tag";

export const UPDATECONTACT = gql`
  mutation UpdateContact($contact: ContactInput, $ignoreResponse: Boolean) {
    updateContact(contact: $contact, ignoreResponse: $ignoreResponse) {
      success
      message
      error
      contact {
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
        leadStage
        leadSource
        companyName
        jobTitle
        IsDeleted
      }
    }
  }
`;
