import gql from "graphql-tag";

export const GETRECENTCONTACTFILES = gql`
  query getRecentContactFiles($relatedObjectId: ID, $relatedObjectType: String, $limit: Int) {
    getFileDescriptors(relatedObjectId: $relatedObjectId, relatedObjectType: $relatedObjectType, limit: $limit) {
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
  query getContactFiles($relatedObjectId: ID, $relatedObjectType: String) {
    getFileDescriptors(relatedObjectId: $relatedObjectId, relatedObjectType: $relatedObjectType) {
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
