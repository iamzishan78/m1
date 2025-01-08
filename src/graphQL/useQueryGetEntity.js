import gql from 'graphql-tag';

export const GET_ENTITY = gql`
	query getEntity($entityId: ID) {
		getEntity(entityId: $entityId)
	}
`;
