import gql from 'graphql-tag';

export const REMOVECOMMONGRIDFUNCTIONALITY = gql`
	mutation gridGenericRemove($tableKey: String, $Ids: MRTDeletionInput, $userId: String) {
		gridGenericRemove(tableKey: $tableKey, Ids: $Ids, userId: $userId) {
			success
			message
			error
		}
	}
`;
