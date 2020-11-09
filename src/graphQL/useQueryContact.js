import gql from "graphql-tag";

export const CONTACT = gql`
  query getContact($contactId: ID) {
    contact(contactId: $contactId) {
      _id
      entity
      name
      address1
      address2
      city
      country
      state
      zip
      title
      firstName
      lastName
      middleName
      suffix
      globalOwner
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
      leadStage
      lastUpdateLeadStageAt
      IsDeleted
      activityLog {
        type
        notes
        dateTime
        fullname
        user_id
      }
      homePhone2
      homePhone3
      mobilephone2
      mobilephone3
      AltPhone2
      AltPhone3
      email3
      status

      hasAuthority
      doNotDisturb

      timeZone
      notes
      website
      industryType
      campaignName
    }
  }
`;
