import gql from 'graphql-tag';

export const REMOVECOMMONGRIDFUNCTIONALITY = gql`
	mutation gridGenericRemove($tableKey: String, $Ids: [ID], $shapeIds: [ID]) {
		gridGenericRemove(tableKey: $tableKey, Ids: $Ids, shapeIds: $shapeIds) {
			success
			message
			error
		}
	}
`;
