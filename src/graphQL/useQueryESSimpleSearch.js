import gql from 'graphql-tag';

export const GET_ES_SIMPLE_SEARCH = gql`
	query getESSimpleSearch(
		$index: String
		$search: esSearchInput
		$filters: [esFilterInput]
		$sort: esSortInput
		$pagination: esPaginationInput
		$project: JSON
		$parent: String
	) {
		getESSimpleSearch(
			index: $index
			search: $search
			filters: $filters
			sort: $sort
			pagination: $pagination
			project: $project
			parent: $parent
		)
	}
`;
