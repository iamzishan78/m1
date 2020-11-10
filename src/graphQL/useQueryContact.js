import gql from "graphql-tag";

export const CONTACT = gql`
  query getContact($contactId: ID) {
    contact(contactId: $contactId)
  }
`;
