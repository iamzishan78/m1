import React from "react";
import gql from "graphql-tag";

export const COMMENTSBYOBJECTIDQUERY = gql`
  query getCommentsByObjectId($objectId: String) {
    commentsByObjectId(objectId: $objectId) {
      _id
      comment
      ts
      user {
        name
        email
      }
      commentedOn
    }
  }
`;
