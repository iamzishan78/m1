import gql from 'graphql-tag';

export const LAYERS_FEATURES_COUNT = gql`
	query layerFeaturesCount($fileId: ID, $layerShapeName: String) {
		layerFeaturesCount(fileId: $fileId, layerShapeName: $layerShapeName)
	}
`;
