import gql from "graphql-tag";

export const TRACKSBYUSERANDOBJECTTYPE = gql`
  query tracksByUserAndObjectType($userId: ID, $objectType: String) {
    tracksByUserAndObjectType(userId: $userId, objectType: $objectType) {
      _id
      ts
      user
      objectType
      trackOn
    }
  }
`;
