import gql from 'graphql-tag';

export const ALL_CUSTOM_ASSET_INFO = gql`
	query getAllCustomAssetInfo($type: String) {
		getAllCustomAssetInfo(type: $type)
	}
`;

export const GET_CUSTOM_ASSET_INFO = gql`
	query getCustomAssetInfo($_id: String, $tableName: String, $name: String) {
		getCustomAssetInfo(_id: $_id, tableName: $tableName, name: $name)
	}
`;
