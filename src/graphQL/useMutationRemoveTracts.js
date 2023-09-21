import gql from "graphql-tag";

export const REMOVE_SHAPE_TRACTS = gql`
  mutation removeShapeTracts($tractIds: [ID]) {
    removeShapeTracts(tractIds: $tractIds) {
      success
      message
      error
      agreement
    }
  }
`;