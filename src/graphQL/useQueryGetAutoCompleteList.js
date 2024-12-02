import gql from 'graphql-tag';

export const GET_AUTOCOMPLETE_LIST = gql`
	query autoCompleteList($type: String, $data: JSON) {
		autoCompleteList(type: $type, data: $data)
	}
`;
