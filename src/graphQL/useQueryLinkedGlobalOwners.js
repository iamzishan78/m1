import gql from "graphql-tag";

export const LINKED_GLOBAL_OWNERS = gql`
  query getLinkedGlobalOwners($contactId: ID) {
    linkedGlobalOwners(contactId: $contactId)
  }
`;
