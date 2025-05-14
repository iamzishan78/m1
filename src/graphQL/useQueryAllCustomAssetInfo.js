import gql from 'graphql-tag';

export const ALL_CUSTOM_ASSET_INFO = gql`
	query getAllCustomAssetInfo($type: String, $ids: [ID]) {
		getAllCustomAssetInfo(type: $type, ids: $ids)
	}
`;

export const GET_CUSTOM_ASSET_INFO = gql`
	query getCustomAssetInfo($_id: String, $tableName: String, $name: String) {
		getCustomAssetInfo(_id: $_id, tableName: $tableName, name: $name)
	}
`;

export const IS_TABLE_NAME_VALID = gql`
	query isTableNameValid($tableName: String!) {
		isTableNameValid(tableName: $tableName)
	}
`;
