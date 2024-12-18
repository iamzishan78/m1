import gql from 'graphql-tag';

export const SHAPE_WELL_OWNERS = gql`
	query getPaginatedWellShapeOwners(
		$polygon: String
		$pagination: PaginationInput = { first: 25, after: null }
		$sort: SortInput = {}
		$filters: [FilterInput] = []
		$search: String = ""
		$selectedYear: String = ""
		$filterByWells: String = ""
		$userId: ID
	) {
		paginatedShapeWellOwners(
			polygon: $polygon
			pagination: $pagination
			sort: $sort
			filters: $filters
			search: $search
			selectedYear: $selectedYear
			filterByWells: $filterByWells
			userId: $userId
		) {
			edges {
				node
				cursor
			}
			totalCount
			pageInfo {
				hasNextPage
				endCursor
			}
		}
	}
`;
