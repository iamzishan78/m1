import gql from "graphql-tag";

export const GET_PROPERTIES_FROM_DOCUMENT = gql`
  query getPropertiesFromDocument($descriptorObject: ID) {
    getPropertyDescriptors(descriptorObject: $descriptorObject) {
      _id
      properties
    }
  }
`;
