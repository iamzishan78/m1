import gql from "graphql-tag";

export const UPDATE_SHAPE_OWNER = gql`
  mutation updateShapeOwner($shapeOwner: JSON, $shapeType: String) {
    updateShapeOwner(shapeOwner: $shapeOwner,shapeType: $shapeType)
  }
`;
