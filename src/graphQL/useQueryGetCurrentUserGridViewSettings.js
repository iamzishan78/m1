import gql from 'graphql-tag';

export const GET_CURRENT_USER_GRID_VIEW_SETTINGS = gql`
	query getCurrentUserGridViewSettings($userId: ID) {
		getCurrentUserGridViewSettings(userId: $userId)
	}
`;
