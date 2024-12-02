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

export const GET_DB_MIN_VALUE = gql`
	query getDbMinValue($index: String, $field: String) {
		getDbMinValue(index: $index, field: $field) {
			success
			message
			error
			data
		}
	}
`;

export const GET_DB_MODELS = gql`
	query getDbModels($flatOnly: Boolean) {
		getDbModels(flatOnly: $flatOnly) {
			success
			message
			error
			data
		}
	}
`;
