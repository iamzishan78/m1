import gql from "graphql-tag";

export const SHAPEWELLS = gql`
  query getShapeWells($polygon: String) {
    shapeWells(polygon: $polygon)
  }
`;