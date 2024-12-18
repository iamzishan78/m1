import gql from 'graphql-tag';

export const SHAPEWELLS = gql`
	query getPaginatedShapeWells(
		$polygon: String
		$pagination: PaginationInput = { first: 25, after: null }
		$sort: WellSortInput = {}
		$filters: [FilterInput] = []
		$search: String = ""
		$shapeId: ID
	) {
		paginatedShapeWells(
			polygon: $polygon
			pagination: $pagination
			sort: $sort
			filters: $filters
			search: $search
			shapeId: $shapeId
		) {
			edges {
				node {
					id
					coordinates
					wellName
					api
					lease
					leaseId
					operator
					wellType
					latitude
					longitude
					wellBoreProfile
					ownerCount
					county
					state
					wellStatus
					lastTwelveMonthBOE
					permitApprovedDate
					spudDate
					completionDate
					firstProductionDate
				}
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
