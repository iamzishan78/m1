import gql from "graphql-tag";

export const SHAPEOWNERSCOUNT = gql`
  query getShapeOwnersCount(
    $polygon: String
  ) {
    shapeOwnersCount(
      polygon: $polygon
    )
  }
`;

export const SHAPEOWNERSINTERESTCOUNT = gql`
  query getShapeOwnersInterestCount(
    $polygon: JSON, $pagination: JSON, $filters: [JSON]
  ) {
    shapeOwnersInterestCount(
      polygon: $polygon, pagination: $pagination, filters: $filters
    )
  }
`;