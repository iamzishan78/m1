import gql from "graphql-tag";

export const CONTACT = gql`
  query getContact($contactId: ID) {
    contact(contactId: $contactId) {
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
      activityLog {
        type
        notes
        dateTime
        fullname
        user_id
      }
    }
  }
`;
