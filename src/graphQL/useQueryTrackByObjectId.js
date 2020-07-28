import gql from "graphql-tag";

export const TRACKBYOBJECTID = gql`
  query trackByObjectId($objectId: String) {
    trackByObjectId(objectId: $objectId) {
      _id
      ts
      user
      objectType
      trackOn
    }
  }
`;
