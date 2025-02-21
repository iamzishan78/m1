import gql from 'graphql-tag';

export const LAYERS_FEATURES_COUNT = gql`
	query layerFeaturesCount($fileId: ID, $layerIdentifier: String) {
		layerFeaturesCount(fileId: $fileId, layerIdentifier: $layerIdentifier)
	}
`;
