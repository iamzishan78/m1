import gql from "graphql-tag";

export const GET_PARCELS_FILES = gql`
  query getParcelFiles($search: String, $relatedObjectId: ID, $relatedObjectType: String) {
    getParcelFiles(search: $search, relatedObjectId: $relatedObjectId, relatedObjectType: $relatedObjectType)
  }
`;
