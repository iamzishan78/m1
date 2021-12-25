import gql from "graphql-tag";

export const GETWELLSFROMDOCUMENTS = gql`
  query getWellsFromDocument($descriptorObject: ID) {
    getWellDescriptors(descriptorObject: $descriptorObject) {
      fileName
    }
  }
`;