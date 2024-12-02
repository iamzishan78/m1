import gql from 'graphql-tag';

export const GET_SHAPE_OWNERS_DATA = gql`
	query getShapeOwnersData($ids: JSON) {
		getShapeOwnersData(ids: $ids)
	}
`;
