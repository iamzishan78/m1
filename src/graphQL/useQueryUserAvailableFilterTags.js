import gql from "graphql-tag";

export const USERAVAILABLEFILTERTAGSQUERY = gql`
  query getUserAvailableFilterTags($userId: ID) {
    userAvailableFilterTags(userId: $userId)
  }
`;
