import gql from "graphql-tag";

export const REMOVEFILELAYER = gql`
  mutation removeFileLayer($fileLayerId: ID) {
    removeFileLayer(fileLayerId: $fileLayerId) {
      success
      message
    }
  }
`;
