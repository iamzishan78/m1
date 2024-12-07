import gql from 'graphql-tag';

export const SHAPE_OWNERS_QUERY = gql`
	query getShapeOwners($customLayerId: ID, $shapeType: String) {
		shapeOwners(customLayerId: $customLayerId, shapeType: $shapeType)
	}
`;
