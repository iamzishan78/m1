import gql from "graphql-tag";

export const UPDATE_SHAPE_TRACT = gql`
  mutation updateShapeTract($shapeTract: JSON, $shapeType: String) {
    updateShapeTract(shapeTract: $shapeTract,shapeType: $shapeType)
  }
`;
