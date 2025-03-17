import gql from 'graphql-tag';

export const UPDATE_USER_FEATURE_SETTING = gql`
	mutation updateUserFeatureSetting($userId: ID, $feature: String, $value: Boolean) {
		updateUserFeatureSetting(userId: $userId, feature: $feature, value: $value) {
			success
		}
	}
`;
