import gql from 'graphql-tag';

export const GET_DB_DATA_TOTAL = gql`
	query getDbDataTotal(
		$index: String
		$modelName: String
		$search: esSearchInput
		$filters: [esFilterInput]
		$sort: esSortInput
		$pagination: esPaginationInput
	) {
		getDbDataTotal(
			index: $index
			modelName: $modelName
			search: $search
			filters: $filters
			sort: $sort
			pagination: $pagination
		) {
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

export const GET_DB_FILTERS = gql`
	query getDbFilters(
		$index: String
		$modelName: String
		$search: esSearchInput
		$filters: [esFilterInput]
		$sort: esSortInput
		$pagination: esPaginationInput
		$filterAggs: esFilterAggsInput
		$key_as_string: Boolean
		$multi_filter_keys: Boolean
	) {
		getDbFilters(
			index: $index
			modelName: $modelName
			search: $search
			filters: $filters
			filterAggs: $filterAggs
			sort: $sort
			pagination: $pagination
			key_as_string: $key_as_string
			multi_filter_keys: $multi_filter_keys
		)
	}
`;

export const GET_DB_AGGS = gql`
	query getDbAggs(
		$index: String
		$modelName: String
		$search: esSearchInput
		$fields: [JSON]
		$filters: [JSON]
		$aggs: JSON
	) {
		getDbAggs(index: $index, modelName: $modelName, search: $search, fields: $fields, filters: $filters, aggs: $aggs)
	}
`;
