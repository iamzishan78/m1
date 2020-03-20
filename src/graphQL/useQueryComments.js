import React from "react";
import gql from "graphql-tag";

export const COMMENTSQUERY = gql`
  query getComments($commentIdArray: [ID]) {
    comments(commentIdArray: $commentIdArray) {
      id
      comment
      _ts
    }
  }
`;
