import gql from "graphql-tag";

export const UPDATE_SHAPE_TRACTS = gql`
  mutation updateShapeTracts($shapeTracts: [JSON], $shapeType: String, $selectedTractToUpdate: String) {
    updateShapeTracts(shapeTracts: $shapeTracts,shapeType: $shapeType, selectedTractToUpdate: $selectedTractToUpdate)
  }
`;
