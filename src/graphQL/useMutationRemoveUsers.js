import gql from "graphql-tag";

export const REMOVE_USERS = gql`
  mutation removeUsers($userIds: [ID]) {
    removeUsers(userIds: $userIds)
  }
`;
