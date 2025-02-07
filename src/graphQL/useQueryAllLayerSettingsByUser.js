import gql from 'graphql-tag';

export const ALLLAYERSETTINGSBYUSER = gql`
	query getAllLayerSettingsByUser($userId: ID, $project: JSON, $onlyShowable: Boolean) {
		allLayerSettingsByUser(userId: $userId, project: $project, onlyShowable: $onlyShowable)
	}
`;
