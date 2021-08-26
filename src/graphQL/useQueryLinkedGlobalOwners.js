import gql from "graphql-tag";

export const LINKED_GLOBAL_OWNERS = gql`
  query getLinkedGlobalOwners($contactId: ID) {
    linkedGlobalOwners(contactId: $contactId)
  }
`;

export const UNLINK_GLOBAL_OWNER = gql`
  mutation unlinkGlobalOwners($contactId: ID, $globalOwner: String) {
    unlinkGlobalOwners(contactId: $contactId, globalOwner: $globalOwner)
  }
`