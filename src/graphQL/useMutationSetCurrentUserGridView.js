import gql from 'graphql-tag';

export const SET_CURRENT_USER_GRID_VIEW_MUTATION = gql`
	mutation setCurrentUserGridView($gridViewId: ID, $userId: ID) {
		setCurrentUserGridView(gridViewId: $gridViewId, userId: $userId)
	}
`;
