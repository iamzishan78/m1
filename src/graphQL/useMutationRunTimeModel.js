import gql from 'graphql-tag';

export const ADD_RECORD_IN_RUN_TIME_MODEL = gql`
	mutation addRecordInRunTimeModel($tableName: String, $record: JSON) {
		addRecordInRunTimeModel(tableName: $tableName, record: $record)
	}
`;

export const UPDATE_RECORD_IN_RUN_TIME_MODEL = gql`
	mutation updateRecordInRunTimeModel($tableName: String, $ids: [String], $record: JSON) {
		updateRecordInRunTimeModel(tableName: $tableName, ids: $ids, record: $record)
	}
`;
