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
        contactOwner
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
        linkedIn
        facebook
        twitter
        leadStage
        lastUpdateLeadStageAt
        leadSource
        companyName
        jobTitle
        IsDeleted
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
  }
`;
