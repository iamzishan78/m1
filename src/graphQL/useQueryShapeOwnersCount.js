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
