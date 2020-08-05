import gql from "graphql-tag";

export const TRACKSBYOBJECTTYPE = gql`
  query tracksByObjectType($objectType: String) {
    tracksByObjectType(objectType: $objectType) {
      _id
      ts
      user
      objectType
      trackOn
    }
  }
`;
