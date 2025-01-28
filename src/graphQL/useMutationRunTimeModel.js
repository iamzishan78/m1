import gql from 'graphql-tag';

export const ADD_RECORD_IN_RUN_TIME_MODEL = gql`
	mutation addRecordInRunTimeModel($name: String, $record: JSON) {
		addRecordInRunTimeModel(name: $name, record: $record)
	}
`;

export const UPDATE_RECORD_IN_RUN_TIME_MODEL = gql`
	mutation updateRecordInRunTimeModel($name: String, $ids: [String], $record: JSON) {
		updateRecordInRunTimeModel(name: $name, ids: $ids, record: $record)
	}
`;
