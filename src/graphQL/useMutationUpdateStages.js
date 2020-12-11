import gql from "graphql-tag";

export const UPDATESTAGES = gql`
  mutation updateStages($stages: [JSON]) {
    updateStages(stages: $stages) {
      success
      message
      error
    }
  }
`;
