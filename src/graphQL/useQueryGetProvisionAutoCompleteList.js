import gql from 'graphql-tag';

export const GET_PROVISION_AUTOCOMPLETE_LIST = gql`
	query provisionAutoCompleteList($keys: [String], $agreementId: ID) {
		provisionAutoCompleteList(keys: $keys, agreementId: $agreementId)
	}
`;
