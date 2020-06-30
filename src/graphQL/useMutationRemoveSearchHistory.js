import gql from "graphql-tag";

export const REMOVESEARCHHISTORY = gql`
  mutation RemoveSearchHistory($searchId: ID) {
    removeSearchHistory(searchId: $searchId) {
      success
      message
      error
    }
  }
`;
