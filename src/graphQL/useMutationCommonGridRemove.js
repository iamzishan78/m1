import gql from 'graphql-tag';

export const GRID_GENERIC_REMOVE = gql`
	mutation gridGenericRemove(
		$tableKey: String
		$deletedData: MRTDeletionInput
		$userId: String
		$ESVariables: JSON
		$isSelectAll: Boolean
		$cypressDelete: Boolean
	) {
		gridGenericRemove(
			tableKey: $tableKey
			deletedData: $deletedData
			userId: $userId
			ESVariables: $ESVariables
			isSelectAll: $isSelectAll
			cypressDelete: $cypressDelete
		) {
			success
			message
			error
			data
		}
	}
`;
