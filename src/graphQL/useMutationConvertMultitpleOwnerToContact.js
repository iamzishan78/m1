import gql from "graphql-tag";

export const CONVERT_MULTITPLE_OWNER_TO_CONTACT = gql`
  mutation convertMultitpleOwnerToContact($ownerIds: [ID], $existingContactId: ID, $userId:ID) {
    convertMultitpleOwnerToContact(ownerIds: $ownerIds, existingContactId: $existingContactId, userId: $userId)
  }
`;
