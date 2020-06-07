import gql from "graphql-tag";

export const TRACKBYUSERANDOBJECTID = gql`
  query trackByUserAndObjectId($userId: ID, $objectId: String) {
    trackByUserAndObjectId(userId: $userId, objectId: $objectId) {
      _id
      ts
      user
      objectType
      trackOn
    }
  }
`;
