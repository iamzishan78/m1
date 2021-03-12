import gql from "graphql-tag";

export const GETRECENTCONTACTFILES = gql`
  query getRecentContactFiles($relatedObjectId: ID) {
    getFileDescriptors(relatedObjectId: $relatedObjectId, limit: 2) {
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
  query getContactFiles($relatedObjectId: ID) {
    getFileDescriptors(relatedObjectId: $relatedObjectId) {
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
