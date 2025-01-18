import gql from 'graphql-tag';

export const UPSERT_GRID_VIEW = gql`
	mutation upsertGridView($gridView: gridViewInput) {
		upsertGridView(gridView: $gridView)
	}
`;
