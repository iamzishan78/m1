import gql from 'graphql-tag';

export const GET_DB_DATA_TOTAL = gql`
	query getDbDataTotal(
		$index: String
		$search: esSearchInput
		$filters: [esFilterInput]
		$sort: esSortInput
		$pagination: esPaginationInput
	) {
		getDbDataTotal(index: $index, search: $search, filters: $filters, sort: $sort, pagination: $pagination) {
			success
			message
			error
			data
		}
	}
`;
