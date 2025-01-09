import gql from 'graphql-tag';

export const GETLAYERBYID = gql`
	query layerById($layerId: ID, $userId: ID) {
		layerById(layerId: $layerId, userId: $userId)
	}
`;
