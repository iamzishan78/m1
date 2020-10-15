import gql from "graphql-tag";

export const GETCONTACTFILES = gql`
  query getContactFiles($userId: ID, $contactId: ID) {
    discriptorFiles(userId: $userId, contactId: $contactId, limit: 2) {
      name
    }
  }
`;
