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

export const LAYERS_BY_DATASET_ID = gql`
	query layersByDatasetId($datasetIds: [ID!]!, $userId: ID) {
		layersByDatasetId(datasetIds: $datasetIds, userId: $userId)
	}
`;

export const LAYERS_BY_ID = gql`
	query layersById($layerIds: [ID!]!, $userId: ID) {
		layersById(layerIds: $layerIds, userId: $userId)
	}
`;
