import gql from "graphql-tag";

// TODO: remove this
export const REMOVE_USERS = gql`
  mutation removeUsers($userIds: [ID]) {
    removeUsers(userIds: $userIds)
  }
`;
