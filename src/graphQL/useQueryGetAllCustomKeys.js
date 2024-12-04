import gql from 'graphql-tag';

export const GET_ALL_CUSTOM_DATA_KEYS = gql`
	query getCustomDataKeys($index: String, $pathToKey: String, $filters: JSON) {
		getAllKeys(esIndex: $index, pathToKey: $pathToKey, filters: $filters)
	}
`;
