import gql from 'graphql-tag';

export const UPDATE_NOTIFICATION_STATUS = gql`
	mutation updateNotificationStatus($id: ID, $state: String) {
		updateNotificationStatus(id: $id, state: $state)
	}
`;
