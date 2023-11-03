import gql from "graphql-tag";

export const GET_NOTIFICATIONS = gql`
  query getNotifications($userId: ID, $state: String, $page: Int) {
    getNotifications(userId: $userId, state: $state, page: $page)
  }
`;
