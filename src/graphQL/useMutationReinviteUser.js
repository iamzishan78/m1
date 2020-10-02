import gql from "graphql-tag";

export const REINVITEUSER = gql`
  mutation reinviteUser($userId: ID) {
    reinviteUser(userId: $userId)
  }
`;
