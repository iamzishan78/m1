import gql from "graphql-tag";

export const GETRECENTCONTACTFILES = gql`
  query getRecentContactFiles($userId: ID, $contactId: ID) {
    getFileDescriptors(userId: $userId, contactId: $contactId, limit: 2) {
      fileName
      fileUrl
      userName
      dateTime
      descriptorId
    }
  }
`;

export const GETCONTACTFILES = gql`
  query getContactFiles($userId: ID, $contactId: ID) {
    getFileDescriptors(userId: $userId, contactId: $contactId) {
      fileName
      fileUrl
      userName
      dateTime
      descriptorId
    }
  }
`;
