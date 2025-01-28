import gql from 'graphql-tag';

export const UPSERT_CUSTOM_ASSET_INFO = gql`
	mutation upsertCustomAssetInfo($name: String, $modelKeys: [JSON], $creationPlace: String) {
		upsertCustomAssetInfo(name: $name, modelKeys: $modelKeys, creationPlace: $creationPlace)
	}
`;

export const UPSERT_ASSOCIATED_MODELS = gql`
	mutation upsertAssociatedModels($name: String, $associatedModels: [JSON]) {
		upsertAssociatedModels(name: $name, associatedModels: $associatedModels)
	}
`;
