import gql from 'graphql-tag';

export const GET_ES_MIN_VALUE = gql`
	query getESMinValue($esIndex: String, $field: String, $value_as_string: Boolean) {
		getESMinValue(esIndex: $esIndex, field: $field, value_as_string: $value_as_string)
	}
`;
