import gql from "graphql-tag";

export const GET_CONTACT_TAX_ROLL_INTERESTS_QUERY = gql`
  query getContactTaxRollInterests( $contactId: ID) {
    contactTaxRollInterests(contactId: $contactId) 
  }
`;

