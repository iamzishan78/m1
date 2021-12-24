import gql from "graphql-tag";

export const UPDATE_SHAPE_OWNERS = gql`
  mutation updateShapeOwners($shapeOwners: [JSON], $shapeType: String) {
    updateShapeOwners(shapeOwners: $shapeOwners,shapeType: $shapeType)
  }
`;
