import gql from 'graphql-tag';

export const GET_META_DATA = gql`
	query getMetaData($user: ID, $category: String, $isControlled: Boolean) {
		getMetaData(user: $user, category: $category, isControlled: $isControlled)
	}
`;

export const GET_ALL_LIBRARY_META_DATA = gql`
	query getAllLibraryMetaData {
		getAllLibraryMetaData
	}
`;

export const CHECK_META_KEY_EXISTS = gql`
	query checkMetaDataKeyExists($name: String, $category: String) {
		checkMetaDataKeyExists(name: $name, category: $category)
	}
`;
