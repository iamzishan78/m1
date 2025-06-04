import gql from 'graphql-tag';

export const UPSERT_CUSTOM_ASSET_INFO = gql`
	mutation upsertCustomAssetInfo($name: String, $modelKeys: [JSON], $creationPlace: String, $shapeType: String) {
		upsertCustomAssetInfo(name: $name, modelKeys: $modelKeys, creationPlace: $creationPlace, shapeType: $shapeType)
	}
`;

export const UPSERT_ASSOCIATED_MODELS = gql`
	mutation upsertAssociatedModels($tableName: String!, $associatedModel: JSON!) {
		upsertAssociatedModels(tableName: $tableName, associatedModel: $associatedModel)
	}
`;
