import gql from "graphql-tag";

export const ADD_RELATED_SHAPE = gql`
  mutation addRelatedShape($descriptorObject: ID, $relatedObject: ID) {
    addRelatedShape(descriptorObject: $descriptorObject, relatedObject: $relatedObject)
  }
`;
