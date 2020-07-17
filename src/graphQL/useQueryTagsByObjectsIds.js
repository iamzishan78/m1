import gql from "graphql-tag";

export const TAGSBYOBJECTSIDS = gql`
  query getTagsByObjectsIds($objectsIdsArray: [String], $userId: ID) {
    tagsByObjectsIds(objectsIdsArray: $objectsIdsArray, userId: $userId)
  }
`;
