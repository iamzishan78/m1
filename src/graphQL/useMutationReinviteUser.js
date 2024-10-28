import gql from "graphql-tag";

// TODO: remove this
export const REINVITEUSER = gql`
  mutation reinviteUser($userId: ID) {
    reinviteUser(userId: $userId)
  }
`;
