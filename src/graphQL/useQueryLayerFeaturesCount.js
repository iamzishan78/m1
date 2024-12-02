import gql from 'graphql-tag';

export const LAYERS_FEATURES_COUNT = gql`
	query layerFeaturesCount($fileId: ID) {
		layerFeaturesCount(fileId: $fileId)
	}
`;
