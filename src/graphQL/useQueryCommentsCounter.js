import gql from "graphql-tag";

export const COMMENTSCOUNTER = gql`
  query getCommentsCounter($objectsIdsArray: [String], $userId: ID) {
    commentsCounter(objectsIdsArray: $objectsIdsArray, userId: $userId)
  }
`;
