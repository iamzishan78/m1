import gql from "graphql-tag";

export const ADDCONTACT = gql`
  mutation AddContact($contact: ContactInput) {
    addContact(contact: $contact) {
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
        createBy {
          name
        }
        lastUpdateBy {
          name
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
      }
    }
  }
`;
