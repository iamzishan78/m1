import gql from "graphql-tag";

export const USERAVAILABLETAGSQUERY = gql`
  query getUserAvailableTags($userId: ID) {
    userAvailableTags(userId: $userId)
  }
`;
