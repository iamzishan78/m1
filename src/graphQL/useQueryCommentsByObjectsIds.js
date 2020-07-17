import gql from "graphql-tag";

export const COMMENTSBYOBJECTSIDS = gql`
  query getCommentsByObjectsIds($objectsIdsArray: [String], $userId: ID) {
    commentsByObjectsIds(objectsIdsArray: $objectsIdsArray, userId: $userId)
  }
`;
