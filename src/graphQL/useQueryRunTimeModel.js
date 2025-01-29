import gql from 'graphql-tag';

export const GET_RECORD_FROM_RUN_TIME_MODEL = gql`
	query getRecordFromRunTimeModel($_id: String!, $tableName: String!) {
		getRecordFromRunTimeModel(_id: $_id, tableName: $tableName)
	}
`;
