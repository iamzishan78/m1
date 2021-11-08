import gql from "graphql-tag";

export const ADD_TRACT_TOA_SHAPE = gql`
  mutation addTractToAShape($shapeTract: JSON, $shapeType: String) {
    addTractToAShape(shapeTract: $shapeTract, shapeType: $shapeType)
  }
`;
