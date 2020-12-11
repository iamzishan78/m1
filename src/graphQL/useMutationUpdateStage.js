import gql from "graphql-tag";

export const UPDATESTAGE = gql`
  mutation updateStage($stage: JSON) {
    updateStage(stage: $stage) {
      success
      message
      error
    }
  }
`;
