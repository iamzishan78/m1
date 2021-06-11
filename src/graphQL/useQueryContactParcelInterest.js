import gql from "graphql-tag";

export const CONTACT_PARCEL_INTERESTS = gql`
  query getContactParcelInterest($contactId: ID) {
    contactParcelInterest(contactId: $contactId)
  }
`;
