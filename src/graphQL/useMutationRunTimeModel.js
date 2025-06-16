import gql from 'graphql-tag';

export const ADD_RECORD_IN_RUN_TIME_MODEL = gql`
	mutation addRecordInRunTimeModel($tableName: String, $record: JSON) {
		addRecordInRunTimeModel(tableName: $tableName, record: $record)
	}
`;

export const UPDATE_RECORD_IN_RUN_TIME_MODEL = gql`
	mutation updateRecordInRunTimeModel(
		$tableName: String
		$ids: [String]
		$record: JSON
		$targetLabel: String
		$tenant: String
		$model: String
		$mappingKey: String
	) {
		updateRecordInRunTimeModel(
			tableName: $tableName
			ids: $ids
			record: $record
			targetLabel: $targetLabel
			tenant: $tenant
			model: $model
			mappingKey: $mappingKey
		)
	}
`;

export const UPDATE_ASSET_SHAPE_LABEL = gql`
	mutation updateAssetShapeLabel($tableName: String!, $shapeLabel: String!, $recordId: String!) {
		updateAssetShapeLabel(tableName: $tableName, shapeLabel: $shapeLabel, recordId: $recordId)
	}
`;
