import gql from "graphql-tag";

export const SHAPE_AUTOCOMPLETE_LIST = gql`
  query getShapeAutoCompleteList($shapeType: String, $key: String) {
    shapeAutoCompleteList(shapeType: $shapeType, key: $key)
  }
`;
