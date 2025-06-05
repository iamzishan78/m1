import gql from 'graphql-tag';

export const GET_COMBINED_FILTER_LIST = gql`
	query getCombinedFilterList($size: Int, $query: String, $searchFields: [JSON]) {
		getCombinedFilterList(size: $size, query: $query, searchFields: $searchFields)
	}
`;
