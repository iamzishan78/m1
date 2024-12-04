import gql from 'graphql-tag';

export const ADD_LAYER_GROUP = gql`
	mutation addLayerGroup($userId: ID, $layerGroup: JSON) {
		addLayerGroup(userId: $userId, layerGroup: $layerGroup)
	}
`;

export const UPDATE_LAYER_GROUP = gql`
	mutation updateLayerGroupName($layerGroupId: ID, $layerGroupName: String) {
		updateLayerGroupName(layerGroupId: $layerGroupId, layerGroupName: $layerGroupName)
	}
`;

export const REMOVE_LAYER_GROUP = gql`
	mutation removeLayerGroup($userId: ID, $layerGroupId: ID) {
		removeLayerGroup(userId: $userId, layerGroupId: $layerGroupId)
	}
`;
