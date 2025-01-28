import gql from 'graphql-tag';

export const ALLLAYERSETTINGSBYUSER = gql`
	query getAllLayerSettingsByUser($userId: ID, $project: JSON, $applyShowableFilter: Boolean) {
		allLayerSettingsByUser(userId: $userId, project: $project, applyShowableFilter: $applyShowableFilter)
	}
`;

export const GET_PROJECTED_LAYERS = gql`
	query getProjectedLayers($userId: ID, $project: JSON, $applyShowableFilter: Boolean) {
		allLayerSettingsByUser(userId: $userId, project: $project, applyShowableFilter: $applyShowableFilter)
	}
`;
