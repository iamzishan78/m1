import gql from 'graphql-tag';

export const ADD_GRID_VIEW = gql`
	mutation addGridView($gridView: gridViewInput) {
		addGridView(gridView: $gridView)
	}
`;
