import gql from "graphql-tag";

export const CONTACT_PURCHASE_DATA = gql`
  query getContactPurchaseData($contactId: ID) {
    getContactPurchaseData(contactId: $contactId)
  }
`;
