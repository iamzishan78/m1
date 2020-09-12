import gql from "graphql-tag";

export const CONTACTPARCELINTERESTS = gql`
  query getContactParcelInterests($contactId: ID) {
    contactParcelInterests(contactId: $contactId)
  }
`;
