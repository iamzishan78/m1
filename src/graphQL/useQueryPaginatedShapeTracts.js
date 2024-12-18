import gql from 'graphql-tag';

export const SHAPE_TRACTS = gql`
	query getPaginatedPotentialShapeTracts(
		$polygon: JSON
		$pagination: PaginationInput = { first: 25, after: null }
		$sort: SortInput = {}
		$filters: [FilterInput] = []
		$search: String = ""
		$userId: ID
	) {
		paginatedPotentialShapeTracts(
			polygon: $polygon
			pagination: $pagination
			sort: $sort
			filters: $filters
			search: $search
			userId: $userId
		)
	}
`;
