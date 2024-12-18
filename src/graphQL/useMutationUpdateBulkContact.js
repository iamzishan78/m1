import gql from 'graphql-tag';

export const UPDATEBULKCONTACT = gql`
	mutation UpdateBulkContact($contactIds: [ID], $keysToUpdate: JSON, $lastUpdateBy: String, $ignoreResponse: Boolean) {
		updateBulkContact(
			contactIds: $contactIds
			keysToUpdate: $keysToUpdate
			lastUpdateBy: $lastUpdateBy
			ignoreResponse: $ignoreResponse
		) {
			success
			message
			error
		}
	}
`;
