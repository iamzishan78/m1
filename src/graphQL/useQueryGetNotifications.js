import gql from "graphql-tag";

export const GET_NOTIFICATIONS = gql`
  query getNotifications($userId: ID, $state: String) {
    getNotifications(userId: $userId, state: $state)
  }
`;
