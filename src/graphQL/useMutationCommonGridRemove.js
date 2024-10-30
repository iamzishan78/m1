import gql from 'graphql-tag';

export const REMOVECOMMONGRIDFUNCTIONALITY = gql`
	mutation gridGenericRemove($tableKey: String, $assetName: String, $deletedData: MRTDeletionInput, $userId: String, $ESVariables: JSON, $isSelectAll: Boolean, $cypressDelete: Boolean) {
		gridGenericRemove(tableKey: $tableKey, assetName: $assetName, deletedData: $deletedData, userId: $userId, ESVariables: $ESVariables, isSelectAll: $isSelectAll, cypressDelete:  $cypressDelete) {
			success
			message
			error
			data
		}
	}
`;