import gql from 'graphql-tag';

export const REMOVECOMMONGRIDFUNCTIONALITY = gql`
	mutation gridGenericRemove($tableKey: String, $deletedData: MRTDeletionInput, $userId: String) {
		gridGenericRemove(tableKey: $tableKey, deletedData: $deletedData, userId: $userId) {
			success
			message
			error
		}
	}
`;
