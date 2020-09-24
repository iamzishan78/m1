import gql from "graphql-tag";

export const REMOVEUSER = gql`
  mutation removeUser($userId: ID) {
    removeUser(userId: $userId)
  }
`;
