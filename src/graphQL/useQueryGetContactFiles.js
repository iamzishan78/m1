import gql from "graphql-tag";

export const GETRECENTCONTACTFILES = gql`
  query getRecentContactFiles($contactId: ID) {
    getFileDescriptors(contactId: $contactId, limit: 2) {
      fileName
      fileState
      fileUrl
      fileId
      userName
      dateTime
      descriptorId
    }
  }
`;

export const GETCONTACTFILES = gql`
  query getContactFiles($contactId: ID) {
    getFileDescriptors(contactId: $contactId) {
      fileName
      fileState
      fileUrl
      fileId
      userName
      dateTime
      descriptorId
    }
  }
`;
