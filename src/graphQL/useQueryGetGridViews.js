import gql from 'graphql-tag';

export const GET_GRID_VIEWS = gql`
	query getGridViews($userId: ID, $module: String) {
		getGridViews(userId: $userId, module: $module)
	}
`;
