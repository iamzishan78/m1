import gql from 'graphql-tag';

export const UPDATEUSERLAYERMETA = gql`
	mutation updateUserLayersMeta($userId: ID!, $layersMeta: JSON!) {
		updateUserLayersMeta(userId: $userId, layersMeta: $layersMeta)
	}
`;
