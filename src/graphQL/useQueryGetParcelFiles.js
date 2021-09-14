import gql from "graphql-tag";

export const GET_PARCELS_FILES = gql`
  query getParcelFiles($search: String, $relatedObjectId: ID, $relatedObjectType: String) {
    getParcelFiles(search: $search, relatedObjectId: $relatedObjectId, relatedObjectType: $relatedObjectType)
  }
`;

export const GET_PARCELS_FILES_COUNT = gql`
  query getParcelFilesCount($search: String, $relatedObjectId: ID, $relatedObjectType: String) {
    getParcelFilesCount(search: $search, relatedObjectId: $relatedObjectId, relatedObjectType: $relatedObjectType)
  }
`;
