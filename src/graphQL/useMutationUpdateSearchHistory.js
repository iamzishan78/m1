import gql from "graphql-tag";

export const UPDATESEARCHHISTORY = gql`
  mutation UpdateSearchHistory($id: ID) {
    updateSearchHistory(id: $id) {
      success
      message
      error
      searchHistory {
        _id
        ts
        searchData
        user
      }
    }
  }
`;
