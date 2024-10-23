import gql from 'graphql-tag';

export const ALL_CUSTOM_ASSET_INFO = gql`
	query getAllCustomAssetInfo {
		getAllCustomAssetInfo
	}
`;

export const GET_CUSTOM_ASSET_INFO = gql`
	query getCustomAssetInfo($_id: String, $tableName: String) {
		getCustomAssetInfo(_id: $_id, tableName: $tableName)
	}
`;
