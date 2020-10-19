import gql from "graphql-tag";

export const GETCONTACTFILES = gql`
  query getContactFiles($userId: ID, $contactId: ID, $limit: Int) {
    getFileDescriptors(userId: $userId, contactId: $contactId, limit: $limit) {
      fileName
      fileUrl
      userName
      dateTime
    }
  }
`;
