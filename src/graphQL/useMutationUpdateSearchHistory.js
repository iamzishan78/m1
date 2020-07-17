import gql from "graphql-tag";

export const UPDATESEARCHHISTORY = gql`
  mutation UpdateSearchHistory($searchId: ID) {
    updateSearchHistory(searchId: $searchId) {
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
