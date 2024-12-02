import gql from 'graphql-tag';

export const GET_ES_COUNT = gql`
	query getESCount($polygon: JSON, $esIndex: String, $search: String, $filters: [JSON], $customFilters: [JSON]) {
		getESCount(polygon: $polygon, esIndex: $esIndex, search: $search, filters: $filters, customFilters: $customFilters)
	}
`;

export const GET_ES_SIMPLE_COUNT = gql`
	query getESSimpleCount($index: String, $search: esSearchInput, $filters: [esFilterInput]) {
		getESSimpleCount(index: $index, search: $search, filters: $filters)
	}
`;
