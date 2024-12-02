import gql from 'graphql-tag';

export const GET_ES_FILTER_LIST = gql`
	query getESFilterList(
		$esIndex: String
		$filters: [JSON]
		$filterKeys: JSON
		$filterKey: String
		$search: String
		$extendSearchQuery: String
		$size: Int
		$key_as_string: Boolean
	) {
		getESFilterList(
			esIndex: $esIndex
			filters: $filters
			filterKey: $filterKey
			filterKeys: $filterKeys
			search: $search
			extendSearchQuery: $extendSearchQuery
			size: $size
			key_as_string: $key_as_string
		)
	}
`;
