import gql from "graphql-tag";

export const COMMENTSBYOBJECTIDQUERY = gql`
  query getCommentsByObjectId($objectId: String) {
    commentsByObjectId(objectId: $objectId) {
      _id
      comment
      ts
      public
      user {
        name
        email
      }
      commentedOn
    }
  }
`;