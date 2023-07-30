import gql from "graphql-tag";

export const CONTACT_PARCEL_INTERESTS = gql`
  query getContactParcelInterest($contactId: ID, $contactIds: [ID], $dealId: ID) {
    contactParcelInterest(contactId: $contactId, contactIds: $contactIds, dealId: $dealId)
  }
`;
