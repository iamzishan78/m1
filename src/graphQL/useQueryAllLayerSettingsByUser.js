import gql from 'graphql-tag';

export const ALLLAYERSETTINGSBYUSER = gql`
	query getAllLayerSettingsByUser($userId: ID, $project: JSON, $onlyShowable: Boolean) {
		allLayerSettingsByUser(userId: $userId, project: $project, onlyShowable: $onlyShowable)
	}
`;

export const GET_PROJECTED_LAYERS = gql`
	query getProjectedLayers($userId: ID, $project: JSON, $onlyShowable: Boolean) {
		allLayerSettingsByUser(userId: $userId, project: $project, onlyShowable: $onlyShowable)
	}
`;
