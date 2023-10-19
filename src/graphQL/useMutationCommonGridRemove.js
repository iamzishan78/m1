import gql from 'graphql-tag';

export const REMOVECOMMONGRIDFUNCTIONALITY = gql`
	mutation gridGenericRemove($tableKey: String, $deletedKeysInformation: MRTDeletionInput, $userId: String) {
		gridGenericRemove(tableKey: $tableKey, deletedKeysInformation: $deletedKeysInformation, userId: $userId) {
			success
			message
			error
		}
	}
`;
