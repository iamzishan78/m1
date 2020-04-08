import gql from "graphql-tag";

export const TAGSAMPLES = gql`
  query getTagSamples($objectsIdsArray: [String], $userId: ID) {
    tagSamples(objectsIdsArray: $objectsIdsArray, userId: $userId)
  }
`;
