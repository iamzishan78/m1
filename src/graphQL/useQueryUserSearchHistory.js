import gql from "graphql-tag";

export const USERSEARCHHISTORY = gql`
  query getSearchHistory($userId: ID) {
    getSearchHistory(userId: $userId) {
      _id
      ts
      searchData
      user
    }
  }
`;
