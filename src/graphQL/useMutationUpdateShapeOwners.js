import gql from 'graphql-tag';

export const UPDATE_SHAPE_OWNERS = gql`
	mutation updateShapeOwners($shapeOwners: [JSON], $shapeType: String, $userId: ID) {
		updateShapeOwners(shapeOwners: $shapeOwners, shapeType: $shapeType, userId: $userId)
	}
`;
