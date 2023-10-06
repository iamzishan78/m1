import gql from 'graphql-tag';

export const REMOVECOMMONGRIDFUNCTIONALITY = gql`
	mutation gridGenericRemove($tableKey: String, $Ids: MRTDeletionInput) {
		gridGenericRemove(tableKey: $tableKey, Ids: $Ids) {
			success
			message
			error
		}
	}
`;
