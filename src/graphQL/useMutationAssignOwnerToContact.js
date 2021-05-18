import gql from "graphql-tag";

export const ASSIGN_OWNER_TO_CONTACT = gql`
  mutation assignOwnerToContact($contactIds: [ID], $contactOwner: ID, $userId:ID) {
    assignOwnerToContact(contactIds: $contactIds, contactOwner: $contactOwner, userId: $userId)
  }
`;
