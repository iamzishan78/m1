import gql from 'graphql-tag';

export const ADD_RECORD_IN_RUN_TIME_MODEL = gql`
	mutation addRecordInRunTimeModel($tableName: String, $record: JSON) {
		addRecordInRunTimeModel(tableName: $tableName, record: $record)
	}
`;
