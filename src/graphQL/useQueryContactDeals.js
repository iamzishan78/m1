import gql from "graphql-tag";

export const CONTACTDEALS = gql`
  query getContactDeals($contactId: ID) {
    contactDeals(contactId: $contactId)
  }
`;
