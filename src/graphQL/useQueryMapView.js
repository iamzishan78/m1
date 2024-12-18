import gql from 'graphql-tag';

export const GET_MAP_VIEWS = gql`
	query getMapViews($userId: String) {
		getMapViews(userId: $userId)
	}
`;
