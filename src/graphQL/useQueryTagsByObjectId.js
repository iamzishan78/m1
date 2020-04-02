import gql from "graphql-tag";

export const TAGSBYOBJECTIDQUERY = gql`
  query getTagsByObjectId($objectId: String) {
    tagsByObjectId(objectId: $objectId) {
      _id
      tag
      ts
      public
      taggedOn
      user {
        name
        email
      }
    }
  }
`;
