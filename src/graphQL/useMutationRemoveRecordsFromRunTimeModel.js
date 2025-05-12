import gql from 'graphql-tag';

export const REMOVE_RECORDS_FROM_RUNTIME_MODEL = gql`
	mutation removeRecordsFromRunTimeModel($tableName: String, $ids: [String]) {
		removeRecordsFromRunTimeModel(tableName: $tableName, ids: $ids)
	}
`;
