import gql from "graphql-tag";

export const OBJECTSFROMTAGSARRAY = gql`
  query getObjectsFromTagsArray(
    $objectType: String
    $tagsArray: [String]
    $userId: ID
  ) {
    objectsFromTagsArray(
      objectType: $objectType
      tagsArray: $tagsArray
      userId: $userId
    )
  }
`;
