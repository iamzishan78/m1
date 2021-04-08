import gql from "graphql-tag";

export const REMOVEDEALDESCRIPTOR = gql`
  mutation removeDealDescriptor($id: ID, $relatedObjectType: String) {
    removeDealDescriptor(descriptorId: $id, relatedObjectType: $relatedObjectType) {
      success
      message
      error
    }
  }
`;
