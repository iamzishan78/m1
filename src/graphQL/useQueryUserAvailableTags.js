import gql from "graphql-tag";

export const USERAVAILABLETAGSQUERY = gql`
  query getUserAvailableTags($userId: ID) {
    userAvailableTags(userId: $userId)
  }
`;

export const GETDEALTAGOPTIONS = gql`
  query getDealTagOptions($userId: ID) {
    getDealTagOptions(userId: $userId)
  }
`;
