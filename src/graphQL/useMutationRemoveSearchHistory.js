import gql from "graphql-tag";

export const REMOVESEARCHHISTORY = gql`
  mutation RemoveSearchHistory($id: ID) {
    removeSearchHistory(id: $id) {
      success
      message
      error
    }
  }
`;
