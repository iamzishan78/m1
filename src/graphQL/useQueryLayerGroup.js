import gql from 'graphql-tag';

export const GET_LAYER_GROUPS = gql`
	query getLayerGroups($userId: ID) {
		getLayerGroups(userId: $userId)
	}
`;
