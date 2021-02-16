import gql from "graphql-tag";

export const SHAPEWELLSCOUNT = gql`
  query getShapeWellsCount(
    $polygon: String
  ) {
    shapeWellsCount(
      polygon: $polygon
    )
  }
`;
