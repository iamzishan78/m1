import gql from 'graphql-tag';

export const GETLAYERBYID = gql`
	query layerById($layerIds: [ID!]!, $userId: ID) {
		layerById(layerIds: $layerIds, userId: $userId)
	}
`;
