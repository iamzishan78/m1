import gql from 'graphql-tag';

export const GET_NOTIFICATIONS = gql`
	query getNotifications($userId: ID, $state: String, $page: Int) {
		getNotifications(userId: $userId, state: $state, page: $page)
	}
`;

export const GET_NOTIFICATIONS_COUNT = gql`
	query getNotificationsCount($userId: ID, $state: String) {
		getNotificationsCount(userId: $userId, state: $state)
	}
`;
