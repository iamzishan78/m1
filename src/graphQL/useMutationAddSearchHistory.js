import gql from "graphql-tag";

export const ADDSEARCHHISTORY = gql`
  mutation AddSearchHistory($searchHistory: SearchHistoryInput) {
    addtSearchHistory(searchHistory: $searchHistory) {
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
