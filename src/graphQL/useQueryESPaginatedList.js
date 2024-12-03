import gql from 'graphql-tag';

export const GET_ES_PAGINATED_LIST = gql`
	query getESPaginatedList(
		$polygon: JSON
		$esIndex: String
		$search: String
		$sort: JSON
		$pagination: JSON
		$filters: [JSON]
		$customFilters: [JSON]
	) {
		getESPaginatedList(
			polygon: $polygon
			esIndex: $esIndex
			search: $search
			sort: $sort
			pagination: $pagination
			filters: $filters
			customFilters: $customFilters
		)
	}
`;
