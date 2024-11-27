import gql from "graphql-tag";

export const GET_CHECKS_FROM_DOCUMENT = gql`
  query getChecksFromDocument($descriptorObject: ID) {
    getCheckDescriptors(descriptorObject: $descriptorObject) {
      _id
      checks
    }
  }
`;
