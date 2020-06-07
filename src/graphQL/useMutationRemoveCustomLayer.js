import gql from "graphql-tag";

export const REMOVECUSTOMLAYER = gql`
  mutation removeCustomLayer($customLayerId: ID) {
    removeCustomLayer(customLayerId: $customLayerId) {
      success
      message
    }
  }
`;
