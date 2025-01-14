import gql from 'graphql-tag';

export const UPSERT_CUSTOM_ASSET_INFO = gql`
	mutation upsertCustomAssetInfo($tableName: String, $modelKeys: [JSON], $creationPlace: String) {
		upsertCustomAssetInfo(tableName: $tableName, modelKeys: $modelKeys, creationPlace: $creationPlace)
	}
`;

export const UPSERT_ASSOCIATED_MODELS = gql`
	mutation upsertAssociatedModels($tableName: String, $associatedModels: [JSON]) {
		upsertAssociatedModels(tableName: $tableName, associatedModels: $associatedModels)
	}
`;
