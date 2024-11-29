import gql from "graphql-tag";
export const UPDATE_SHAPES = gql`
  mutation updateShapes($shapes: [JSON]) {
    updateShapes(shapes: $shapes) {
      success
      message
      error
    }
  }
`;
